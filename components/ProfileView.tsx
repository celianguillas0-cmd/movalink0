"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import EffectLayer from "./Effects";
import {
  CopyIcon,
  GamepadIcon,
  LinkIcon,
  LogoMark,
  SOCIAL_ICONS,
  SOCIAL_LABELS,
  socialHref,
} from "./Icons";
import {
  AvatarFrameId,
  ButtonStyleId,
  CursorId,
  Decoration,
  FONT_META,
  FontId,
  FULLCUSTOM_DEFAULTS,
  LAYOUT_DEFAULTS,
  Profile,
  SocialLinks,
  THEME_DEFAULTS,
} from "@/lib/types";

// Calque décoratif (logo importé ou pseudo texte) posé en filigrane.
export function DecorationLayer({
  decoration,
  fontFamily,
}: {
  decoration: Decoration;
  fontFamily?: string;
}) {
  const transform = `translate(-50%, -50%) rotate(${decoration.rotation}deg)`;
  return (
    <div
      className="pointer-events-none absolute z-0"
      style={{
        left: `${decoration.x}%`,
        top: `${decoration.y}%`,
        transform,
        opacity: decoration.opacity / 100,
      }}
      aria-hidden
    >
      {decoration.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={decoration.url}
          alt=""
          style={{ width: `${decoration.size * 4}px`, height: "auto", maxWidth: "none" }}
          draggable={false}
        />
      ) : (
        <span
          style={{
            fontSize: `${decoration.size}px`,
            color: decoration.color,
            fontFamily,
            fontWeight: 800,
            whiteSpace: "nowrap",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {decoration.text}
        </span>
      )}
    </div>
  );
}

// Effet vague : chaque lettre ondule avec un léger décalage.
function WaveText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {[...text].map((c, i) => (
        <span
          key={i}
          className="ml-wavechar"
          style={{ animationDelay: `${i * 0.09}s` }}
          aria-hidden
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

// Effet machine à écrire : tape le texte lettre par lettre, puis boucle.
function TypewriterText({ text, animate }: { text: string; animate: boolean }) {
  const [shown, setShown] = useState(animate ? "" : text);
  const ref = useRef<{ i: number; dir: 1 | -1 }>({ i: 0, dir: 1 });

  useEffect(() => {
    if (!animate) {
      setShown(text);
      return;
    }
    ref.current = { i: 0, dir: 1 };
    const id = setInterval(() => {
      const s = ref.current;
      s.i += s.dir;
      if (s.i >= text.length) {
        s.dir = -1;
        s.i = text.length;
      } else if (s.i <= 0) {
        s.dir = 1;
        s.i = 0;
      }
      setShown(text.slice(0, s.i));
    }, 220);
    return () => clearInterval(id);
  }, [text, animate]);

  return (
    <span>
      {shown}
      <span className="ml-typecaret">|</span>
    </span>
  );
}

// Statut Discord en direct via l'API publique Lanyard (opt-in : l'utilisateur
// a saisi lui-même son ID ; nécessite d'avoir rejoint le serveur Lanyard).
function DiscordPresence({ discordId }: { discordId: string }) {
  const [data, setData] = useState<{
    status: string;
    activity: string | null;
  } | null>(null);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${encodeURIComponent(discordId)}`
        );
        if (!res.ok) return;
        const json = await res.json();
        if (stop || !json?.success) return;
        const d = json.data;
        const game = Array.isArray(d.activities)
          ? d.activities.find((a: { type: number }) => a.type === 0)
          : null;
        setData({
          status: d.discord_status ?? "offline",
          activity: game?.name ?? null,
        });
      } catch {
        // Lanyard indisponible : on n'affiche simplement rien.
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [discordId]);

  if (!data) return null;

  const dot =
    data.status === "online"
      ? "#23a55a"
      : data.status === "idle"
        ? "#f0b232"
        : data.status === "dnd"
          ? "#f23f43"
          : "#80848e";
  const label =
    data.status === "online"
      ? "En ligne"
      : data.status === "idle"
        ? "Absent"
        : data.status === "dnd"
          ? "Ne pas déranger"
          : "Hors ligne";

  return (
    <div className="mt-2 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/80">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
      />
      {data.activity ? `Joue à ${data.activity}` : label}
    </div>
  );
}

// Lecteur de musique de fond : bouton flottant play/pause (l'autoplay avec
// son est bloqué par les navigateurs tant que le visiteur n'a pas interagi).
function MusicPlayer({ url, accent }: { url: string; accent: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Couper la musique" : "Jouer la musique"}
        className="pointer-events-auto fixed bottom-3 left-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur transition-transform hover:scale-110"
        style={{ boxShadow: `0 0 14px ${accent}66` }}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
}

function track(username: string, type: "view" | "click", linkId?: string) {
  const payload = JSON.stringify({ username, type, linkId });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" })
      );
      return;
    }
  } catch {
    // sendBeacon indisponible : fallback fetch ci-dessous
  }
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

// Style des boutons de liens selon le choix du profil.
function linkButtonProps(
  style: ButtonStyleId,
  accent: string
): { className: string; style: React.CSSProperties } {
  const base =
    "group flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-all hover:translate-y-[-2px]";
  switch (style) {
    case "pill":
      return {
        className: `${base} rounded-full border bg-white/5 backdrop-blur hover:bg-white/10`,
        style: { borderColor: `${accent}55` },
      };
    case "square":
      return {
        className: `${base} rounded-none border bg-white/5 backdrop-blur hover:bg-white/10`,
        style: { borderColor: `${accent}55` },
      };
    case "outline":
      return {
        className: `${base} rounded-xl border-2 bg-transparent hover:bg-white/5`,
        style: { borderColor: accent },
      };
    case "glass":
      return {
        className: `${base} rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20`,
        style: { borderColor: `${accent}66` },
      };
    case "neon":
      return {
        className: `${base} rounded-xl border-2 bg-black/30 hover:bg-black/50`,
        style: {
          borderColor: accent,
          boxShadow: `0 0 12px ${accent}88, inset 0 0 8px ${accent}44`,
        },
      };
    case "gradient":
      return {
        className: `${base} rounded-xl border-0 hover:brightness-110`,
        style: {
          background: `linear-gradient(135deg, ${accent}, ${accent}55)`,
        },
      };
    case "shadow":
      return {
        className: `${base} rounded-lg border-2 border-white/90 bg-black/40 hover:bg-black/60`,
        style: { boxShadow: `5px 5px 0 ${accent}` },
      };
    case "underline":
      return {
        className: `${base} rounded-none border-0 bg-transparent hover:bg-white/5`,
        style: { borderBottom: `2px solid ${accent}` },
      };
    case "bevel":
      return {
        className: `${base} rounded-xl border-0 active:translate-y-[2px]`,
        style: {
          background: accent,
          boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
        },
      };
    case "rounded":
    default:
      return {
        className: `${base} rounded-xl border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10`,
        style: { borderColor: `${accent}55` },
      };
  }
}

// Classe/style du cadre d'avatar.
function avatarFrameProps(
  frame: AvatarFrameId,
  accent: string
): { className: string; style: React.CSSProperties } {
  switch (frame) {
    case "none":
      return { className: "", style: {} };
    case "double":
      return {
        className: "border-2",
        style: {
          borderColor: accent,
          boxShadow: `0 0 0 4px rgba(0,0,0,0.4), 0 0 0 6px ${accent}`,
        },
      };
    case "glow":
      return {
        className: "border-2",
        style: { borderColor: accent, boxShadow: `0 0 24px 4px ${accent}` },
      };
    case "animated":
      // Anneau dégradé qui tourne (voir keyframes ml-spin dans globals.css).
      return {
        className: "border-2",
        style: {
          borderColor: "transparent",
          background: `linear-gradient(#000, #000) padding-box, conic-gradient(from 0deg, ${accent}, #ffffff, ${accent}) border-box`,
          animation: "ml-spin 4s linear infinite",
        },
      };
    case "dashed":
      return {
        className: "",
        style: { border: `2px dashed ${accent}` },
      };
    case "gradientRing":
      return {
        className: "border-2",
        style: {
          borderColor: "transparent",
          background: `linear-gradient(#000, #000) padding-box, conic-gradient(from 45deg, ${accent}, #ffffff, ${accent}) border-box`,
        },
      };
    case "pulse":
      return {
        className: "border-2",
        style: {
          borderColor: accent,
          animation: "ml-pulse 2s ease-out infinite",
          ["--ml-pulse-color" as string]: `${accent}88`,
        },
      };
    case "ring":
    default:
      return { className: "border-2", style: { borderColor: accent } };
  }
}

function cursorValue(cursor: CursorId, accent: string): string | undefined {
  if (cursor === "crosshair") return "crosshair";
  if (cursor === "neon") {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='6' fill='${accent}'/><circle cx='12' cy='12' r='9' fill='none' stroke='${accent}' stroke-opacity='0.5' stroke-width='2'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 12 12, auto`;
  }
  return undefined;
}

function SocialButton({
  socialKey,
  value,
  accent,
  interactive,
  username,
}: {
  socialKey: keyof SocialLinks;
  value: string;
  accent: string;
  interactive: boolean;
  username: string;
}) {
  const [copied, setCopied] = useState(false);
  const Icon = SOCIAL_ICONS[socialKey];
  const href = socialHref(socialKey, value);

  const baseClass =
    "flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-transform hover:scale-110";

  if (!href) {
    return (
      <button
        type="button"
        title={copied ? "Copié" : `${SOCIAL_LABELS[socialKey]} : ${value} (cliquer pour copier)`}
        className={baseClass}
        onClick={() => {
          navigator.clipboard?.writeText(value).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
          if (interactive) track(username, "click", `social-${socialKey}`);
        }}
        style={{ borderColor: `${accent}44` }}
      >
        {copied ? <CopyIcon className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={SOCIAL_LABELS[socialKey]}
      className={baseClass}
      style={{ borderColor: `${accent}44` }}
      onClick={() => {
        if (interactive) track(username, "click", `social-${socialKey}`);
      }}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

// ─── Support button ──────────────────────────────────────────────────────────
function SupportButton({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-yellow-900 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <span>☕</span>
      {label}
    </a>
  );
}

// ─── Stream schedule ─────────────────────────────────────────────────────────
const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
function StreamSchedule({ days, timeStart, timeEnd }: { days: number[]; timeStart: string; timeEnd?: string }) {
  const today = new Date().getDay();
  return (
    <div className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">🎮 Planning de stream</p>
      <div className="mb-2 flex gap-1.5">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
              days.includes(i)
                ? i === today
                  ? "bg-white text-zinc-900"
                  : "bg-white/20 text-white"
                : "text-white/20"
            }`}
          >
            {d[0]}
          </div>
        ))}
      </div>
      {timeStart && (
        <p className="text-xs text-white/50">
          {timeStart}{timeEnd ? ` → ${timeEnd}` : ""}
        </p>
      )}
    </div>
  );
}

// ─── Clips grid ──────────────────────────────────────────────────────────────
function ClipsGrid({ clips }: { clips: NonNullable<Profile["clips"]> }) {
  return (
    <div className="mt-6 w-full">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">🎬 Clips</p>
      <div className="grid grid-cols-2 gap-2">
        {clips.map((clip, i) => (
          <a
            key={i}
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="truncate text-center">{clip.title || `Clip ${i + 1}`}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Countdown widget ───────────────────────────────────────────────────────
function CountdownWidget({ label, targetDate }: { label: string; targetDate: string }) {
  const calc = () => {
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, done: diff === 0 };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return (
    <div className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
      {label && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{label}</p>}
      {t.done ? (
        <p className="text-sm font-bold text-white/80">C'est parti !</p>
      ) : (
        <div className="flex justify-center gap-3">
          {[{ v: t.d, u: "j" }, { v: t.h, u: "h" }, { v: t.m, u: "m" }, { v: t.s, u: "s" }].map(({ v, u }) => (
            <div key={u} className="flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums text-white">{String(v).padStart(2, "0")}</span>
              <span className="text-[10px] text-white/40">{u}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Steam status ────────────────────────────────────────────────────────────
function SteamStatus({ steamId }: { steamId: string }) {
  const [game, setGame] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch(`/api/steam?id=${encodeURIComponent(steamId)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setGame(d?.gameName ?? null); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [steamId]);
  if (!loaded || !game) return null;
  return (
    <div className="mt-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      En jeu : {game}
    </div>
  );
}

// ─── Twitch embed ────────────────────────────────────────────────────────────
function TwitchEmbed({ channel }: { channel: string }) {
  const clean = channel.replace(/^https?:\/\/(?:www\.)?twitch\.tv\//i, "").replace(/\/$/, "");
  const parent = typeof window !== "undefined" ? window.location.hostname : "movalink.vercel.app";
  return (
    <div className="mt-6 w-full overflow-hidden rounded-xl border border-white/10">
      <iframe
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(clean)}&parent=${parent}&autoplay=false&muted=true`}
        className="aspect-video w-full"
        allowFullScreen
        title={`Stream Twitch de ${clean}`}
      />
    </div>
  );
}

// ─── Share panel ─────────────────────────────────────────────────────────────
function ShareButton({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const url = `https://movalink.vercel.app/${username}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `@${username} sur Movalink`, url }); return; } catch { /* noop */ }
    }
    copy();
  };

  const toggleQr = () => {
    if (qrUrl) { setQrUrl(""); return; }
    QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: "#09090b", light: "#ffffff" } })
      .then(setQrUrl).catch(() => {});
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 shadow-lg backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-105"
        aria-label="Partager cette page"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-64 rounded-2xl border border-white/15 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">Partager</p>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={copy}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              {copied ? "Copié !" : "Copier le lien"}
            </button>
            <button type="button" onClick={share}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Partager via…
            </button>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Retrouve moi sur Movalink 👇`)}&url=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.844L1.254 2.25H8.08l4.259 5.623 5.905-5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Partager sur X
            </a>
            <button type="button" onClick={toggleQr}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
                <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
                <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
                <line x1="14" y1="14" x2="14" y2="14"/><line x1="17" y1="14" x2="21" y2="14"/>
                <line x1="14" y1="17" x2="14" y2="21"/><line x1="17" y1="17" x2="21" y2="21"/>
              </svg>
              {qrUrl ? "Masquer le QR" : "QR code"}
            </button>
          </div>
          {qrUrl && (
            <div className="mt-3 flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR code" className="h-32 w-32 rounded-lg" />
              <a href={qrUrl} download={`movalink-${username}.png`}
                className="text-xs text-white/50 underline hover:text-white/80">
                Télécharger
              </a>
            </div>
          )}
          <button type="button" onClick={() => setOpen(false)}
            className="absolute right-3 top-3 text-white/40 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export default function ProfileView({
  profile,
  branding,
  watermark = false,
  interactive = false,
  viewCount,
}: {
  profile: Profile;
  branding: boolean;
  watermark?: boolean;
  interactive?: boolean;
  viewCount?: number;
}) {
  const { theme } = profile;
  const accent = theme.accent;
  const font: FontId = theme.font ?? THEME_DEFAULTS.font;
  // Police du pseudo : par défaut la même que la page.
  const nameFont: FontId = theme.nameFont ?? font;
  const buttonStyle: ButtonStyleId = theme.buttonStyle ?? THEME_DEFAULTS.buttonStyle;
  const avatarFrame: AvatarFrameId = theme.avatarFrame ?? THEME_DEFAULTS.avatarFrame;
  const cursor: CursorId = theme.cursor ?? THEME_DEFAULTS.cursor;

  // Repli sur "classic" si une police a été retirée depuis (ancien profil).
  const fontMeta = FONT_META[font] ?? FONT_META.classic;
  const nameFontMeta = FONT_META[nameFont] ?? FONT_META.classic;
  const frame = avatarFrameProps(avatarFrame, accent);
  const btn = linkButtonProps(buttonStyle, accent);
  const cursorCss = cursorValue(cursor, accent);

  const cardWidth = theme.cardWidth ?? LAYOUT_DEFAULTS.cardWidth;
  const cardAlign = theme.cardAlign ?? LAYOUT_DEFAULTS.cardAlign;
  const cardRadius = theme.cardRadius ?? LAYOUT_DEFAULTS.cardRadius;
  const cardPadding = theme.cardPadding ?? LAYOUT_DEFAULTS.cardPadding;
  const contentScale = theme.contentScale ?? LAYOUT_DEFAULTS.contentScale;

  const alignStyle: React.CSSProperties =
    cardAlign === "top"
      ? { marginTop: 0, marginBottom: "auto" }
      : cardAlign === "bottom"
        ? { marginTop: "auto", marginBottom: 0 }
        : { marginTop: "auto", marginBottom: "auto" };

  // --- Full custom : fond, carte, avatar, couleurs de texte ---
  const hexToRgba = (hexColor: string, opacityPct: number): string => {
    const h = hexColor.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacityPct / 100})`;
  };

  const bgType = theme.bgType ?? FULLCUSTOM_DEFAULTS.bgType;
  const bgColor = theme.bgColor ?? FULLCUSTOM_DEFAULTS.bgColor;
  const bgColor2 = theme.bgColor2 ?? FULLCUSTOM_DEFAULTS.bgColor2;
  const bgAngle = theme.bgAngle ?? FULLCUSTOM_DEFAULTS.bgAngle;
  const bgDim = theme.bgDim ?? FULLCUSTOM_DEFAULTS.bgDim;

  // Image/vidéo de fond : les champs existants OU bgType "image".
  const useVideoBg =
    Boolean(profile.backgroundVideoUrl) && bgType !== "solid" && bgType !== "gradient";
  const useImageBg =
    !useVideoBg &&
    Boolean(profile.backgroundUrl) &&
    bgType !== "solid" &&
    bgType !== "gradient";

  let backgroundStyle: React.CSSProperties;
  if (useImageBg) {
    backgroundStyle = {
      backgroundImage: `url(${profile.backgroundUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  } else if (bgType === "solid") {
    backgroundStyle = { background: bgColor };
  } else if (bgType === "gradient") {
    backgroundStyle = {
      background: `linear-gradient(${bgAngle}deg, ${bgColor}, ${bgColor2})`,
    };
  } else {
    // "accent" par défaut : dégradé radial teinté d'accent (apparence historique).
    backgroundStyle = {
      backgroundImage: `radial-gradient(ellipse at top, ${accent}22, transparent 55%), radial-gradient(ellipse at bottom right, ${accent}11, transparent 50%)`,
    };
  }
  // Assombrissement : par défaut 55% sur une image, sinon la valeur bgDim.
  const dimPct =
    useImageBg || useVideoBg
      ? Math.max(bgDim, theme.bgDim === undefined ? 55 : bgDim)
      : bgDim;

  const cardStyle: React.CSSProperties = {
    borderRadius: cardRadius,
    background: theme.cardBg
      ? hexToRgba(theme.cardBg, theme.cardBgOpacity ?? FULLCUSTOM_DEFAULTS.cardBgOpacity)
      : `rgba(0,0,0,${(theme.cardBgOpacity ?? FULLCUSTOM_DEFAULTS.cardBgOpacity) / 100})`,
    backdropFilter: `blur(${theme.cardBlur ?? FULLCUSTOM_DEFAULTS.cardBlur}px)`,
    WebkitBackdropFilter: `blur(${theme.cardBlur ?? FULLCUSTOM_DEFAULTS.cardBlur}px)`,
    border: `${theme.cardBorderWidth ?? 1}px solid ${
      theme.cardBorderColor ?? "rgba(255,255,255,0.1)"
    }`,
  };

  const avatarShape = theme.avatarShape ?? FULLCUSTOM_DEFAULTS.avatarShape;
  const avatarSize = theme.avatarSize ?? FULLCUSTOM_DEFAULTS.avatarSize;
  const avatarRadius =
    avatarShape === "square" ? "14%" : avatarShape === "rounded" ? "28%" : "9999px";
  const nameColor = theme.nameColor;
  const bioColor = theme.bioColor;
  const buttonTextColor = theme.buttonTextColor;
  const nameEffect = theme.nameEffect ?? "none";

  // Style du pseudo selon l'effet choisi.
  const nameEffectStyle: React.CSSProperties = {};
  let nameEffectClass = "";
  if (nameEffect === "glow") {
    nameEffectStyle.textShadow = `0 0 12px ${accent}, 0 0 24px ${accent}`;
  } else if (nameEffect === "gradient") {
    // backgroundImage (pas le shorthand background) évite que le navigateur
    // recombine background + backgroundSize + backgroundClip en un seul
    // shorthand qui casse le rendu "clip text" dans certains moteurs CSS.
    (nameEffectStyle as Record<string, string>).backgroundImage =
      `linear-gradient(90deg, ${accent}, #ffffff, ${accent})`;
    nameEffectStyle.backgroundSize = "200% auto";
    (nameEffectStyle as Record<string, string>).WebkitBackgroundClip = "text";
    nameEffectStyle.backgroundClip = "text";
    nameEffectStyle.color = "transparent";
    nameEffectClass = "ml-name-gradient";
  } else if (nameEffect === "rainbow") {
    (nameEffectStyle as Record<string, string>).backgroundImage =
      "linear-gradient(90deg,#ff5f6d,#ffc371,#47e891,#3fa7ff,#a06bff,#ff5f6d)";
    nameEffectStyle.backgroundSize = "200% auto";
    (nameEffectStyle as Record<string, string>).WebkitBackgroundClip = "text";
    nameEffectStyle.backgroundClip = "text";
    nameEffectStyle.color = "transparent";
    nameEffectClass = "ml-name-gradient";
  } else if (nameEffect === "fire") {
    (nameEffectStyle as Record<string, string>).backgroundImage =
      "linear-gradient(0deg, #ff3d00 15%, #ff9800 55%, #ffd54f 90%)";
    (nameEffectStyle as Record<string, string>).WebkitBackgroundClip = "text";
    nameEffectStyle.backgroundClip = "text";
    nameEffectStyle.color = "transparent";
    nameEffectClass = "ml-name-fire";
  } else if (nameEffect === "glitch") {
    nameEffectClass = "ml-name-glitch";
  }

  const decorations: Decoration[] =
    profile.decorations && profile.decorations.length > 0
      ? profile.decorations
      : profile.decoration
        ? [profile.decoration]
        : [];

  const cardIntro = theme.cardIntro ?? "none";
  const introClass =
    cardIntro === "fade"
      ? "ml-intro-fade"
      : cardIntro === "zoom"
        ? "ml-intro-zoom"
        : cardIntro === "slide"
          ? "ml-intro-slide"
          : "";

  useEffect(() => {
    if (interactive) track(profile.username, "view");
    // Une vue par affichage de la page publique.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, profile.username]);

  // Charge les polices Google choisies (page + pseudo), y compris dans
  // l'aperçu de l'éditeur pour que le rendu soit fidèle.
  useEffect(() => {
    for (const g of [fontMeta.google, nameFontMeta.google]) {
      if (!g) continue;
      const id = `ml-font-${g}`;
      if (document.getElementById(id)) continue;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${g}&display=swap`;
      document.head.appendChild(link);
    }
  }, [interactive, fontMeta.google, nameFontMeta.google]);

  const socialEntries = (
    Object.entries(profile.socials) as [keyof SocialLinks, string][]
  ).filter(([, v]) => v);

  const inner = (
    <div
      className="relative z-10 flex w-full flex-col items-center text-white"
      style={{
        padding: `${cardPadding * 2}px ${cardPadding}px`,
        zoom: contentScale / 100,
      }}
    >
      <div
        className={`overflow-hidden ${frame.className}`}
        style={{
          ...frame.style,
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarRadius,
        }}
      >
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="h-full w-full object-cover"
            style={{ borderRadius: avatarRadius }}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-white/10 text-3xl font-bold"
            style={{ borderRadius: avatarRadius }}
          >
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <h1
        className={`mt-4 text-2xl font-bold ${nameEffectClass}`}
        style={{
          fontFamily: nameFontMeta.family,
          letterSpacing: nameFontMeta.spacing,
          color: nameColor,
          ...nameEffectStyle,
        }}
      >
        {nameEffect === "type" ? (
          <TypewriterText text={profile.displayName} animate={interactive} />
        ) : nameEffect === "wave" ? (
          <WaveText text={profile.displayName} />
        ) : (
          profile.displayName
        )}
      </h1>
      <p
        className="text-sm text-white/60"
        style={{ fontFamily: nameFontMeta.family, letterSpacing: nameFontMeta.spacing }}
      >
        @{profile.username}
      </p>
      {theme.discordId && <DiscordPresence discordId={theme.discordId} />}
      {profile.bio && (
        <p
          className="mt-3 max-w-sm text-center text-sm leading-relaxed text-white/80"
          style={{ color: bioColor }}
        >
          {profile.bio}
        </p>
      )}

      {socialEntries.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {socialEntries.map(([key, value]) => (
            <SocialButton
              key={key}
              socialKey={key}
              value={value}
              accent={accent}
              interactive={interactive}
              username={profile.username}
            />
          ))}
        </div>
      )}

      {profile.supportButton?.url && (
        <SupportButton label={profile.supportButton.label} url={profile.supportButton.url} />
      )}

      {profile.links.length > 0 && (
        <div className="mt-7 flex w-full flex-col gap-3">
          {profile.links.filter((link) => !link.expiresAt || new Date(link.expiresAt) > new Date()).map((link) => {
            // Couleur propre au bouton si définie, sinon la couleur d'accent.
            const lbtn = link.color
              ? linkButtonProps(buttonStyle, link.color)
              : btn;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={lbtn.className}
                style={{ ...lbtn.style, color: buttonTextColor }}
                onClick={() => {
                  if (interactive) track(profile.username, "click", link.id);
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {link.icon && (
                    <span className="shrink-0 text-base leading-none">{link.icon}</span>
                  )}
                  <span className="truncate">{link.label}</span>
                </span>
                <LinkIcon className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
              </a>
            );
          })}
        </div>
      )}

      {profile.games.length > 0 && (
        <div className="mt-8 w-full">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
            <GamepadIcon className="h-4 w-4" />
            Mes jeux
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {profile.games.map((game) => (
              <div
                key={game.id}
                className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5"
              >
                <p className="truncate text-sm font-semibold">{game.game}</p>
                {game.pseudo && (
                  <p className="truncate text-xs text-white/60">{game.pseudo}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stream schedule */}
      {profile.streamSchedule?.days?.length ? (
        <StreamSchedule
          days={profile.streamSchedule.days}
          timeStart={profile.streamSchedule.timeStart}
          timeEnd={profile.streamSchedule.timeEnd}
        />
      ) : null}

      {/* Clips */}
      {profile.clips?.length ? <ClipsGrid clips={profile.clips} /> : null}

      {/* Countdown widget */}
      {profile.countdown?.targetDate && (
        <CountdownWidget label={profile.countdown.label} targetDate={profile.countdown.targetDate} />
      )}

      {/* Twitch embed */}
      {profile.twitchChannel && <TwitchEmbed channel={profile.twitchChannel} />}

      {/* YouTube live link */}
      {profile.youtubeChannel && (
        <a
          href={profile.youtubeChannel.startsWith("http") ? profile.youtubeChannel : `https://youtube.com/${profile.youtubeChannel.startsWith("@") ? profile.youtubeChannel : `@${profile.youtubeChannel}`}/live`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Regarder en direct
        </a>
      )}

      {/* Steam status */}
      {profile.steamId && <SteamStatus steamId={profile.steamId} />}

      {/* View counter */}
      {profile.showViewCount && typeof viewCount === "number" && viewCount > 0 && (
        <p className="mt-6 text-xs text-white/30">
          {viewCount.toLocaleString("fr-FR")} vue{viewCount > 1 ? "s" : ""}
        </p>
      )}

      {branding && (
        <Link
          href="/"
          className="mt-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-colors hover:text-white"
        >
          <LogoMark className="h-3.5 w-3.5" />
          Créé avec Movalink
        </Link>
      )}
    </div>
  );

  return (
    <div
      className="relative flex min-h-full w-full flex-1 flex-col items-center overflow-hidden bg-zinc-950"
      style={{
        fontFamily: fontMeta.family,
        letterSpacing: fontMeta.spacing,
        cursor: cursorCss,
        ...backgroundStyle,
      }}
    >
      {useVideoBg && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={profile.backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      )}
      {dimPct > 0 && (
        <div
          className="absolute inset-0"
          style={{ background: `rgba(0,0,0,${dimPct / 100})` }}
          aria-hidden
        />
      )}
      {decorations.map((d, i) => (
        <DecorationLayer key={i} decoration={d} fontFamily={fontMeta.family} />
      ))}
      <EffectLayer
        effect={theme.effect}
        accent={accent}
        emojiChar={theme.effectEmoji || "🔥"}
      />
      {theme.layout === "card" ? (
        <div
          className="relative z-10 w-full px-4 py-8"
          style={{ maxWidth: cardWidth, ...alignStyle }}
        >
          <div
            className={`flex flex-col items-center overflow-hidden shadow-2xl ${introClass}`}
            style={cardStyle}
          >
            {inner}
          </div>
        </div>
      ) : (
        <div
          className="relative z-10 flex w-full justify-center px-4"
          style={alignStyle}
        >
          <div className={`w-full ${introClass}`} style={{ maxWidth: cardWidth }}>
            {inner}
          </div>
        </div>
      )}

      {watermark && (
        <a
          href="https://movalink.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto fixed bottom-2 right-3 z-20 select-none text-[10px] font-medium tracking-wide text-white/35 transition-colors hover:text-white/70"
          style={{ fontFamily: "-apple-system, sans-serif", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          made with movalink.vercel.app
        </a>
      )}

      {theme.musicUrl && <MusicPlayer url={theme.musicUrl} accent={accent} />}
      {interactive && <ShareButton username={profile.username} />}
    </div>
  );
}
