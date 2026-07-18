import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, saveProfile } from "@/lib/store";
import { newId, sanitizeUrl } from "@/lib/slug";
import {
  ACCENT_PRESETS,
  AvatarFrameId,
  AvatarShape,
  BgType,
  ButtonStyleId,
  CardAlign,
  CardIntro,
  CursorId,
  Decoration,
  EffectId,
  FontId,
  GameEntry,
  LAYOUT_DEFAULTS,
  LayoutId,
  LinkGroup,
  NAME_EFFECT_LABELS,
  NameEffect,
  PLAN_LIMITS,
  Profile,
  ProfileLink,
  SocialLinks,
  THEME_DEFAULTS,
} from "@/lib/types";

export const dynamic = "force-dynamic";

const SOCIAL_KEYS: (keyof SocialLinks)[] = [
  "discord",
  "twitch",
  "youtube",
  "x",
  "tiktok",
  "instagram",
  "snapchat",
  "telegram",
  "reddit",
  "skool",
  "whatsapp",
  "threads",
  "facebook",
  "pinterest",
  "linkedin",
  "spotify",
  "soundcloud",
  "patreon",
  "github",
  "steam",
  "kick",
];

function clampText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  let body: Partial<Profile>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const limits = PLAN_LIMITS[user.plan];
  const current = await getProfile(user.username);
  if (!current) {
    return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
  }

  const links: ProfileLink[] = Array.isArray(body.links)
    ? body.links
        .slice(0, limits.links)
        .map((l) => {
          const url = sanitizeUrl(typeof l?.url === "string" ? l.url : "");
          if (!url) return null;
          const rawColor = typeof l.color === "string" ? l.color : "";
          const color =
            limits.perLinkColor && /^#[0-9a-fA-F]{6}$/.test(rawColor)
              ? rawColor
              : undefined;
          const icon = clampText(l.icon, 8);
          const rawExpiry = typeof l.expiresAt === "string" ? l.expiresAt : "";
          const expiresAt = rawExpiry && !isNaN(Date.parse(rawExpiry)) ? rawExpiry : undefined;
          return {
            id: typeof l.id === "string" && l.id ? l.id.slice(0, 32) : newId(),
            label: clampText(l.label, 60) || url.replace(/^https?:\/\//, "").slice(0, 60),
            url,
            ...(color ? { color } : {}),
            ...(icon ? { icon } : {}),
            ...(expiresAt ? { expiresAt } : {}),
          };
        })
        .filter((l): l is ProfileLink => l !== null)
    : current.links;

  const games: GameEntry[] = Array.isArray(body.games)
    ? body.games
        .slice(0, limits.games)
        .map((g) => ({
          id: typeof g?.id === "string" && g.id ? g.id.slice(0, 32) : newId(),
          game: clampText(g?.game, 50),
          pseudo: clampText(g?.pseudo, 50),
        }))
    : current.games;

  const socials: SocialLinks = {};
  const rawSocials = (body.socials ?? {}) as Record<string, unknown>;
  for (const key of SOCIAL_KEYS) {
    const value = clampText(rawSocials[key], 120);
    if (value) socials[key] = value;
  }

  const requestedEffect = (body.theme?.effect ?? current.theme.effect) as EffectId;
  const effect: EffectId = limits.effects.includes(requestedEffect)
    ? requestedEffect
    : "none";

  const requestedLayout = (body.theme?.layout ?? current.theme.layout) as LayoutId;
  const layout: LayoutId = requestedLayout === "clean" ? "clean" : "card";

  let accent = clampText(body.theme?.accent, 7);
  if (!/^#[0-9a-fA-F]{6}$/.test(accent)) accent = ACCENT_PRESETS[1];

  // Options gated par plan : on retombe sur le défaut si l'option demandée
  // n'est pas autorisée pour le plan de l'utilisateur.
  const requestedFont = (body.theme?.font ?? current.theme.font) as FontId;
  const font: FontId = limits.fonts.includes(requestedFont)
    ? requestedFont
    : THEME_DEFAULTS.font;

  // Police du pseudo : même liste autorisée que la police globale.
  const requestedNameFont = (body.theme?.nameFont ?? current.theme.nameFont) as
    | FontId
    | undefined;
  const nameFont: FontId | undefined =
    requestedNameFont && limits.fonts.includes(requestedNameFont)
      ? requestedNameFont
      : undefined;

  const requestedButton = (body.theme?.buttonStyle ??
    current.theme.buttonStyle) as ButtonStyleId;
  const buttonStyle: ButtonStyleId = limits.buttonStyles.includes(requestedButton)
    ? requestedButton
    : THEME_DEFAULTS.buttonStyle;

  const requestedFrame = (body.theme?.avatarFrame ??
    current.theme.avatarFrame) as AvatarFrameId;
  const avatarFrame: AvatarFrameId = limits.avatarFrames.includes(requestedFrame)
    ? requestedFrame
    : THEME_DEFAULTS.avatarFrame;

  const requestedCursor = (body.theme?.cursor ?? current.theme.cursor) as CursorId;
  const cursor: CursorId = limits.cursors.includes(requestedCursor)
    ? requestedCursor
    : THEME_DEFAULTS.cursor;

  // Mise en page libre : réglée seulement si le plan l'autorise, sinon défauts.
  const clampInt = (v: unknown, min: number, max: number, fallback: number) => {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.round(Math.min(max, Math.max(min, n)));
  };
  // PUT = remplacement : un champ absent du body est bien un champ effacé
  // (l'éditeur envoie toujours le thème complet). Fusionner avec le thème
  // stocké ressusciterait les réglages qu'un preset vient de réinitialiser.
  const src = limits.customLayout ? { ...body.theme } : LAYOUT_DEFAULTS;
  const cardWidth = clampInt(src.cardWidth, 300, 560, LAYOUT_DEFAULTS.cardWidth);
  const requestedAlign = src.cardAlign as CardAlign;
  const cardAlign: CardAlign =
    requestedAlign === "top" || requestedAlign === "bottom" || requestedAlign === "center"
      ? requestedAlign
      : LAYOUT_DEFAULTS.cardAlign;
  const cardRadius = clampInt(src.cardRadius, 0, 40, LAYOUT_DEFAULTS.cardRadius);
  const cardPadding = clampInt(src.cardPadding, 8, 40, LAYOUT_DEFAULTS.cardPadding);
  const contentScale = clampInt(src.contentScale, 80, 130, LAYOUT_DEFAULTS.contentScale);

  // Full custom (fond, couleurs, carte, avatar) : seulement si le plan l'autorise.
  const hex = (v: unknown, fallback?: string): string | undefined => {
    return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
  };
  const fc: Record<string, unknown> = limits.fullCustom
    ? { ...body.theme }
    : {};
  const fcClampInt = (v: unknown, min: number, max: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? Math.round(Math.min(max, Math.max(min, n))) : undefined;
  };
  const bgTypeReq = fc.bgType;
  const bgType: BgType | undefined =
    bgTypeReq === "solid" || bgTypeReq === "gradient" || bgTypeReq === "image"
      ? bgTypeReq
      : bgTypeReq === "accent"
        ? "accent"
        : undefined;
  const bgColor = hex(fc.bgColor);
  const bgColor2 = hex(fc.bgColor2);
  const bgAngle = fcClampInt(fc.bgAngle, 0, 360);
  const bgDim = fcClampInt(fc.bgDim, 0, 85);
  const cardBg = hex(fc.cardBg);
  const cardBgOpacity = fcClampInt(fc.cardBgOpacity, 0, 100);
  const cardBlur = fcClampInt(fc.cardBlur, 0, 24);
  const nameColor = hex(fc.nameColor);
  const bioColor = hex(fc.bioColor);
  const avShapeReq = fc.avatarShape;
  const avatarShape: AvatarShape | undefined =
    avShapeReq === "circle" || avShapeReq === "rounded" || avShapeReq === "square"
      ? avShapeReq
      : undefined;
  const avatarSize = fcClampInt(fc.avatarSize, 64, 140);
  const cardBorderColor = hex(fc.cardBorderColor);
  const cardBorderWidth = fcClampInt(fc.cardBorderWidth, 0, 6);
  const buttonTextColor = hex(fc.buttonTextColor);
  const neReq = fc.nameEffect;
  const nameEffect: NameEffect | undefined =
    typeof neReq === "string" && neReq in NAME_EFFECT_LABELS
      ? (neReq as NameEffect)
      : undefined;
  const ciReq = fc.cardIntro;
  const cardIntro: CardIntro | undefined =
    ciReq === "none" || ciReq === "fade" || ciReq === "zoom" || ciReq === "slide"
      ? ciReq
      : undefined;
  const fullCustomFields = limits.fullCustom
    ? {
        ...(bgType ? { bgType } : {}),
        ...(bgColor ? { bgColor } : {}),
        ...(bgColor2 ? { bgColor2 } : {}),
        ...(bgAngle !== undefined ? { bgAngle } : {}),
        ...(bgDim !== undefined ? { bgDim } : {}),
        ...(cardBg ? { cardBg } : {}),
        ...(cardBgOpacity !== undefined ? { cardBgOpacity } : {}),
        ...(cardBlur !== undefined ? { cardBlur } : {}),
        ...(nameColor ? { nameColor } : {}),
        ...(bioColor ? { bioColor } : {}),
        ...(avatarShape ? { avatarShape } : {}),
        ...(avatarSize !== undefined ? { avatarSize } : {}),
        ...(cardBorderColor ? { cardBorderColor } : {}),
        ...(cardBorderWidth !== undefined ? { cardBorderWidth } : {}),
        ...(buttonTextColor ? { buttonTextColor } : {}),
        ...(nameEffect ? { nameEffect } : {}),
        ...(cardIntro ? { cardIntro } : {}),
      }
    : {};

  // Emoji de l'effet "pluie d'emoji" (suit le droit à l'effet lui-même).
  const effectEmoji = limits.effects.includes("emoji")
    ? clampText(body.theme?.effectEmoji ?? current.theme.effectEmoji, 8)
    : "";

  // Statut Discord en direct : opt-in, ID numérique Discord (17-20 chiffres).
  const rawDiscordId = clampText(
    body.theme?.discordId ?? current.theme.discordId,
    24
  );
  const discordId =
    limits.discordPresence && /^\d{15,21}$/.test(rawDiscordId) ? rawDiscordId : "";

  // Musique de fond (URL audio), réservée aux plans qui l'autorisent.
  const musicUrl = limits.music
    ? clampText(body.theme?.musicUrl ?? current.theme.musicUrl, 500)
    : "";

  // Décorations superposées (limitées par plan). Compatible avec l'ancien
  // champ unique `decoration`.
  const clampNum2 = (v: unknown, min: number, max: number, fb: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fb;
  };
  const rawDecos = Array.isArray(body.decorations) ? body.decorations : [];
  const decorations: Decoration[] = limits.maxDecorations > 0
    ? rawDecos
        .slice(0, limits.maxDecorations)
        .map((d): Decoration | null => {
          const kind = d?.kind === "text" ? "text" : "image";
          const url = kind === "image" ? clampText(d?.url, 500) : "";
          const text = kind === "text" ? clampText(d?.text, 40) : "";
          if (!((kind === "image" && url) || (kind === "text" && text))) return null;
          let color = clampText(d?.color, 7);
          if (!/^#[0-9a-fA-F]{6}$/.test(color)) color = "#ffffff";
          return {
            kind,
            url,
            text,
            color,
            x: clampNum2(d?.x, 0, 100, 50),
            y: clampNum2(d?.y, 0, 100, 32),
            size: clampNum2(d?.size, 5, 160, kind === "text" ? 56 : 45),
            rotation: clampNum2(d?.rotation, -180, 180, 0),
            opacity: clampNum2(d?.opacity, 0, 100, kind === "text" ? 18 : 60),
          };
        })
        .filter((d): d is Decoration => d !== null)
    : [];

  const avatarUrl = clampText(body.avatarUrl, 500);
  const backgroundUrl = limits.customBackground
    ? clampText(body.backgroundUrl, 500)
    : "";
  const backgroundVideoUrl = limits.customBackground
    ? clampText(body.backgroundVideoUrl, 500)
    : "";

  // Calque décoration (logo/pseudo importable) : réservé aux plans payants.
  const clampNum = (v: unknown, min: number, max: number, fallback: number) => {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };
  let decoration: Decoration | null = null;
  if (limits.customDecoration && body.decoration) {
    const d = body.decoration;
    const kind = d.kind === "text" ? "text" : "image";
    const url = kind === "image" ? clampText(d.url, 500) : "";
    const text = kind === "text" ? clampText(d.text, 40) : "";
    // On ne conserve la décoration que si elle a un contenu.
    if ((kind === "image" && url) || (kind === "text" && text)) {
      let color = clampText(d.color, 7);
      if (!/^#[0-9a-fA-F]{6}$/.test(color)) color = "#ffffff";
      decoration = {
        kind,
        url,
        text,
        color,
        x: clampNum(d.x, 0, 100, 50),
        y: clampNum(d.y, 0, 100, 32),
        size: clampNum(d.size, 5, 160, kind === "text" ? 56 : 45),
        rotation: clampNum(d.rotation, -180, 180, 0),
        opacity: clampNum(d.opacity, 0, 100, kind === "text" ? 18 : 60),
      };
    }
  }

  // ─── Widgets & new profile features ─────────────────────────────────────
  const showViewCount = body.showViewCount === true;

  const countdown = (() => {
    if (!limits.countdown || !body.countdown) return null;
    const label = clampText(body.countdown.label, 80);
    const targetDate = clampText(body.countdown.targetDate, 30);
    if (!targetDate) return null;
    return { label, targetDate };
  })();

  const twitchChannel = limits.liveEmbed ? clampText(body.twitchChannel, 60) : "";
  const youtubeChannel = limits.liveEmbed ? clampText(body.youtubeChannel, 120) : "";
  const steamId = limits.steamStatus && /^\d{17}$/.test(body.steamId ?? "") ? body.steamId! : "";

  const supportButton = (() => {
    if (!limits.supportButton || !body.supportButton) return null;
    const label = clampText(body.supportButton.label, 60) || "Me soutenir";
    const url = sanitizeUrl(clampText(body.supportButton.url, 300));
    return url ? { label, url } : null;
  })();

  const streamSchedule = (() => {
    if (!body.streamSchedule) return null;
    const days = Array.isArray(body.streamSchedule.days)
      ? body.streamSchedule.days.filter((d): d is number => typeof d === "number" && d >= 0 && d <= 6)
      : [];
    const timeStart = clampText(body.streamSchedule.timeStart, 5);
    const timeEnd = clampText(body.streamSchedule.timeEnd, 5);
    return days.length ? { days, timeStart, ...(timeEnd ? { timeEnd } : {}) } : null;
  })();

  const clips: Profile["clips"] = limits.clips > 0 && Array.isArray(body.clips)
    ? body.clips.slice(0, limits.clips).map((c) => {
        const url = sanitizeUrl(clampText(c?.url, 300));
        const title = clampText(c?.title, 80);
        return url ? { url, ...(title ? { title } : {}) } : null;
      }).filter((c): c is { url: string; title?: string } => c !== null)
    : [];

  // ─── Advanced settings (all plans) ──────────────────────────────────────
  // pagePassword: use body value if the key is present (empty string = clear),
  // otherwise fall back to current stored value so autosaves don't wipe it.
  const pagePassword = ("pagePassword" in body)
    ? (clampText(body.pagePassword as string, 64) || undefined)
    : current.pagePassword;

  // linkGroups: same pattern — preserve existing value when key absent from body.
  const linkGroups: LinkGroup[] = Array.isArray(body.linkGroups)
    ? (body.linkGroups as unknown[])
        .filter((g): g is LinkGroup => !!g && typeof (g as LinkGroup).id === "string" && typeof (g as LinkGroup).label === "string")
        .slice(0, 50)
        .map((g) => ({ id: g.id.slice(0, 32), label: clampText(g.label, 40) }))
    : (current.linkGroups ?? []);

  // scheduledPagesEnabled: explicit boolean from body, else current, else true.
  const scheduledPagesEnabled = typeof body.scheduledPagesEnabled === "boolean"
    ? body.scheduledPagesEnabled
    : (current.scheduledPagesEnabled ?? true);

  const updated: Profile = {
    username: current.username,
    displayName: clampText(body.displayName, 50) || current.username,
    bio: clampText(body.bio, 300),
    avatarUrl,
    backgroundUrl,
    links,
    socials,
    games,
    theme: {
      accent,
      effect,
      layout,
      font,
      nameFont,
      buttonStyle,
      avatarFrame,
      cursor,
      cardWidth,
      cardAlign,
      cardRadius,
      cardPadding,
      contentScale,
      ...fullCustomFields,
      ...(musicUrl ? { musicUrl } : {}),
      ...(effectEmoji ? { effectEmoji } : {}),
      ...(discordId ? { discordId } : {}),
    },
    decoration,
    decorations,
    backgroundVideoUrl,
    showViewCount,
    ...(countdown ? { countdown } : {}),
    ...(twitchChannel ? { twitchChannel } : {}),
    ...(youtubeChannel ? { youtubeChannel } : {}),
    ...(steamId ? { steamId } : {}),
    ...(supportButton ? { supportButton } : {}),
    ...(streamSchedule ? { streamSchedule } : {}),
    ...(clips?.length ? { clips } : {}),
    ...(pagePassword ? { pagePassword } : {}),
    ...(linkGroups.length ? { linkGroups } : {}),
    ...(!scheduledPagesEnabled ? { scheduledPagesEnabled: false } : {}),
    updatedAt: new Date().toISOString(),
  };

  await saveProfile(updated);
  return NextResponse.json({ ok: true, profile: updated });
}
