export type Plan = "free" | "pro" | "elite";

export type EffectId =
  | "none"
  | "snow"
  | "rain"
  | "stars"
  | "sakura"
  | "aurora"
  | "plasma"
  | "matrix"
  | "bubbles"
  | "leaves"
  | "hearts"
  // Ultra premium (Elite uniquement)
  | "fireflies"
  | "embers"
  | "confetti"
  | "nebula"
  | "meteors"
  | "storm"
  | "glitch"
  | "vhs"
  | "synthwave"
  | "emoji";

export type LayoutId = "card" | "clean";

export type FontId =
  | "classic"
  | "poppins"
  | "playfair"
  | "dancing"
  | "caveat"
  | "satisfy"
  | "pixel"
  | "bebas"
  | "orbitron"
  | "bungee"
  | "monoton"
  | "pirata"
  | "typewriter"
  | "fredoka"
  | "marker"
  | "stencil"
  | "bangers"
  | "creepster";

export type ButtonStyleId =
  | "rounded"
  | "pill"
  | "square"
  | "outline"
  | "glass"
  | "neon"
  | "gradient"
  | "shadow"
  | "underline"
  | "bevel";

export type AvatarFrameId =
  | "none"
  | "ring"
  | "double"
  | "glow"
  | "animated"
  | "dashed"
  | "gradientRing"
  | "pulse";

export type CursorId = "default" | "crosshair" | "neon";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  plan: Plan;
  isAdmin?: boolean;
  redeemedCodes?: string[];
  referralCode?: string;
  referralCount?: number;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  plan: Plan;
  isAdmin?: boolean;
  referralCode?: string;
  referralCount?: number;
  createdAt: string;
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  color?: string;      // couleur personnalisée du bouton (hex), défaut = accent
  icon?: string;       // emoji ou 1-4 caractères affichés avant le libellé
  expiresAt?: string;  // ISO date — le lien disparaît après cette date
}

export interface LeaderboardEntry {
  username: string;
  displayName: string;
  avatarUrl: string;
  plan: Plan;
  totalViews: number;
}

export interface SocialLinks {
  discord?: string;
  twitch?: string;
  youtube?: string;
  x?: string;
  tiktok?: string;
  instagram?: string;
  snapchat?: string;
  telegram?: string;
  reddit?: string;
  skool?: string;
  whatsapp?: string;
  threads?: string;
  facebook?: string;
  pinterest?: string;
  linkedin?: string;
  spotify?: string;
  soundcloud?: string;
  patreon?: string;
  github?: string;
  steam?: string;
  kick?: string;
}

export interface GameEntry {
  id: string;
  game: string;
  pseudo: string;
}

export interface Theme {
  accent: string;
  effect: EffectId;
  layout: LayoutId;
  // Optionnels car absents des profils créés avant leur introduction.
  font?: FontId; // police globale de la page
  nameFont?: FontId; // police spécifique du pseudo (défaut = police globale)
  buttonStyle?: ButtonStyleId;
  avatarFrame?: AvatarFrameId;
  cursor?: CursorId;
  // Mise en page libre de la carte (optionnels : défauts = apparence historique).
  cardWidth?: number; // largeur max de la carte en px (300-560)
  cardAlign?: "top" | "center" | "bottom"; // position verticale
  cardRadius?: number; // arrondi du cadre en px (0-40)
  cardPadding?: number; // marge intérieure en px (8-40)
  contentScale?: number; // taille des infos en % (80-130)
  // Full custom (Pro/Elite). Absents = apparence par défaut.
  bgType?: BgType; // type de fond
  bgColor?: string; // fond uni / 1re couleur du dégradé
  bgColor2?: string; // 2e couleur du dégradé
  bgAngle?: number; // angle du dégradé (0-360)
  bgDim?: number; // assombrissement du fond en % (0-85)
  cardBg?: string; // couleur de la carte
  cardBgOpacity?: number; // opacité de la carte (0-100)
  cardBlur?: number; // flou d'arrière-plan de la carte (0-24)
  nameColor?: string; // couleur du pseudo
  bioColor?: string; // couleur de la bio
  avatarShape?: AvatarShape; // forme de l'avatar
  avatarSize?: number; // taille de l'avatar en px (64-140)
  cardBorderColor?: string; // couleur de la bordure de carte
  cardBorderWidth?: number; // épaisseur de la bordure (0-6)
  buttonTextColor?: string; // couleur du texte des boutons de liens
  nameEffect?: NameEffect; // effet animé sur le pseudo
  musicUrl?: string; // musique de fond (URL audio)
  effectEmoji?: string; // emoji utilisé par l'effet "emoji" (pluie d'emoji)
  discordId?: string; // ID Discord pour le statut en direct (opt-in, Elite)
  cardIntro?: CardIntro; // animation d'entrée de la carte
}

export type CardIntro = "none" | "fade" | "zoom" | "slide";

export const CARD_INTRO_LABELS: Record<CardIntro, string> = {
  none: "Aucune",
  fade: "Fondu",
  zoom: "Zoom",
  slide: "Glissée",
};

export type CardAlign = "top" | "center" | "bottom";

export type BgType = "accent" | "solid" | "gradient" | "image";

export type AvatarShape = "circle" | "rounded" | "square";

export type NameEffect =
  | "none"
  | "gradient"
  | "glow"
  | "rainbow"
  | "type"
  | "wave"
  | "glitch"
  | "fire";

export const NAME_EFFECT_LABELS: Record<NameEffect, string> = {
  none: "Aucun",
  gradient: "Dégradé",
  glow: "Halo",
  rainbow: "Arc-en-ciel",
  type: "Machine",
  wave: "Vague",
  glitch: "Glitch",
  fire: "Feu",
};

export const BG_TYPE_LABELS: Record<BgType, string> = {
  accent: "Auto",
  solid: "Couleur unie",
  gradient: "Dégradé",
  image: "Image",
};

export const AVATAR_SHAPE_LABELS: Record<AvatarShape, string> = {
  circle: "Rond",
  rounded: "Arrondi",
  square: "Carré",
};

export const FULLCUSTOM_DEFAULTS = {
  bgType: "accent" as BgType,
  bgColor: "#6366f1",
  bgColor2: "#0ea5e9",
  bgAngle: 135,
  bgDim: 0,
  cardBgOpacity: 35,
  cardBlur: 12,
  avatarShape: "circle" as AvatarShape,
  avatarSize: 96,
};

export const LAYOUT_DEFAULTS = {
  cardWidth: 448,
  cardAlign: "center" as CardAlign,
  cardRadius: 24,
  cardPadding: 20,
  contentScale: 100,
};

export const CARD_ALIGN_LABELS: Record<CardAlign, string> = {
  top: "Haut",
  center: "Centre",
  bottom: "Bas",
};

// Calque décoratif (logo importé OU pseudo texte) posé en filigrane,
// librement déplaçable et redimensionnable par l'utilisateur.
export interface Decoration {
  kind: "image" | "text";
  url: string; // pour kind="image"
  text: string; // pour kind="text"
  color: string; // pour kind="text"
  x: number; // centre X, 0-100 (% de la largeur)
  y: number; // centre Y, 0-100 (% de la hauteur)
  size: number; // image : % largeur (5-120) ; texte : taille px (12-160)
  rotation: number; // -180 à 180
  opacity: number; // 0-100
}

export function defaultDecoration(kind: "image" | "text"): Decoration {
  return {
    kind,
    url: "",
    text: kind === "text" ? "PSEUDO" : "",
    color: "#ffffff",
    x: 50,
    y: 32,
    size: kind === "text" ? 56 : 45,
    rotation: 0,
    opacity: kind === "text" ? 18 : 60,
  };
}

export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  backgroundUrl: string;
  links: ProfileLink[];
  socials: SocialLinks;
  games: GameEntry[];
  theme: Theme;
  decoration?: Decoration | null; // legacy : décoration unique
  decorations?: Decoration[]; // décorations superposées (Pro/Elite)
  backgroundVideoUrl?: string; // vidéo de fond en boucle (prioritaire sur l'image)
  showViewCount?: boolean;
  countdown?: { label: string; targetDate: string } | null;
  twitchChannel?: string;
  youtubeChannel?: string;
  steamId?: string;
  supportButton?: { label: string; url: string } | null;
  streamSchedule?: { days: number[]; timeStart: string; timeEnd?: string } | null;
  clips?: { url: string; title?: string }[];
  updatedAt: string;
}

export interface DayStats {
  views: number;
  clicks: number;
}

export interface Stats {
  totalViews: number;
  totalClicks: number;
  byDay: Record<string, DayStats>;
  byLink: Record<string, number>;
}

export interface SavedProfileSlot {
  id: string;
  name: string;
  savedAt: string;
  profile: Profile;
}

export interface Report {
  id: string;
  username: string;
  reason: string;
  details: string;
  email: string;
  createdAt: string;
  status: "open" | "resolved";
}

export interface PlanLimits {
  links: number;
  games: number;
  effects: EffectId[];
  fonts: FontId[];
  buttonStyles: ButtonStyleId[];
  avatarFrames: AvatarFrameId[];
  cursors: CursorId[];
  statsDays: number;
  branding: boolean;
  watermark: boolean; // filigrane "made with movalink.vercel.app" (retiré en Elite)
  customBackground: boolean;
  customDecoration: boolean;
  customLayout: boolean;
  perLinkColor: boolean; // couleur individuelle par bouton
  fullCustom: boolean; // fond, couleurs de texte, carte, avatar
  music: boolean; // musique de fond
  maxDecorations: number; // nombre de décorations superposées
  discordPresence: boolean; // statut Discord en direct (Lanyard, opt-in)
  countdown: boolean;      // widget compte à rebours
  liveEmbed: boolean;      // embed Twitch / lien YouTube live
  steamStatus: boolean;    // statut Steam (jeu en cours)
  supportButton: boolean;  // bouton "me soutenir" (Ko-fi / PayPal)
  clips: number;           // galerie de clips (0 = désactivé)
  savedProfiles: number;   // emplacements de pages sauvegardées (0 = désactivé)
}

// Toutes les polices, dans l'ordre d'affichage (regroupées par famille visuelle).
export const ALL_FONTS: FontId[] = [
  "classic",
  "poppins",
  "fredoka",
  "playfair",
  "bebas",
  "dancing",
  "caveat",
  "satisfy",
  "marker",
  "orbitron",
  "bungee",
  "stencil",
  "bangers",
  "monoton",
  "pirata",
  "creepster",
  "typewriter",
  "pixel",
];

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    links: 5,
    games: 5,
    effects: ["none"],
    fonts: ["classic"],
    buttonStyles: ["rounded"],
    avatarFrames: ["none"],
    cursors: ["default"],
    statsDays: 7,
    branding: true,
    watermark: true,
    customBackground: false,
    customDecoration: false,
    customLayout: false,
    perLinkColor: false,
    fullCustom: false,
    music: false,
    maxDecorations: 0,
    discordPresence: false,
    countdown: false,
    liveEmbed: false,
    steamStatus: false,
    supportButton: false,
    clips: 0,
    savedProfiles: 1,
  },
  pro: {
    links: 15,
    games: 15,
    effects: [
      "none",
      "snow",
      "rain",
      "stars",
      "sakura",
      "aurora",
      "bubbles",
      "leaves",
      "hearts",
      "emoji",
    ],
    fonts: ALL_FONTS,
    buttonStyles: [
      "rounded",
      "pill",
      "square",
      "outline",
      "glass",
      "gradient",
      "shadow",
      "underline",
    ],
    avatarFrames: ["none", "ring", "double", "glow", "dashed", "gradientRing"],
    cursors: ["default", "crosshair"],
    statsDays: 30,
    branding: false,
    watermark: true,
    customBackground: true,
    customDecoration: true,
    customLayout: true,
    perLinkColor: true,
    fullCustom: true,
    music: true,
    maxDecorations: 3,
    discordPresence: false,
    countdown: true,
    liveEmbed: true,
    steamStatus: false,
    supportButton: true,
    clips: 4,
    savedProfiles: 3,
  },
  elite: {
    links: 50,
    games: 50,
    effects: [
      "none",
      "snow",
      "rain",
      "stars",
      "sakura",
      "aurora",
      "plasma",
      "matrix",
      "bubbles",
      "leaves",
      "hearts",
      "fireflies",
      "embers",
      "confetti",
      "nebula",
      "meteors",
      "storm",
      "glitch",
      "vhs",
      "synthwave",
      "emoji",
    ],
    fonts: ALL_FONTS,
    buttonStyles: [
      "rounded",
      "pill",
      "square",
      "outline",
      "glass",
      "neon",
      "gradient",
      "shadow",
      "underline",
      "bevel",
    ],
    avatarFrames: [
      "none",
      "ring",
      "double",
      "glow",
      "animated",
      "dashed",
      "gradientRing",
      "pulse",
    ],
    cursors: ["default", "crosshair", "neon"],
    statsDays: 365,
    branding: false,
    watermark: false,
    customBackground: true,
    customDecoration: true,
    customLayout: true,
    perLinkColor: true,
    fullCustom: true,
    music: true,
    maxDecorations: 5,
    discordPresence: true,
    countdown: true,
    liveEmbed: true,
    steamStatus: true,
    supportButton: true,
    clips: 8,
    savedProfiles: 10,
  },
};

export const PLAN_PRICES: Record<Exclude<Plan, "free">, { amountCents: number; label: string }> = {
  pro: { amountCents: 349, label: "3,49 €" },
  elite: { amountCents: 599, label: "5,99 €" },
};

export function formatCents(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

// Montant réellement dû pour passer du plan actuel au plan cible.
// Un client Pro qui passe Elite ne paie que la différence (pas de double paiement).
export function upgradePriceCents(
  current: Plan,
  target: Exclude<Plan, "free">
): number {
  const base = PLAN_PRICES[target].amountCents;
  if (current === "pro" && target === "elite") {
    return base - PLAN_PRICES.pro.amountCents;
  }
  return base;
}

export const EFFECT_LABELS: Record<EffectId, string> = {
  none: "Aucun",
  snow: "Neige",
  rain: "Pluie",
  stars: "Étoiles",
  sakura: "Sakura",
  aurora: "Aurore",
  plasma: "Plasma",
  matrix: "Matrix",
  bubbles: "Bulles",
  leaves: "Feuilles",
  hearts: "Cœurs",
  fireflies: "Lucioles",
  embers: "Braises",
  confetti: "Confettis",
  nebula: "Nébuleuse",
  meteors: "Météores",
  storm: "Orage",
  glitch: "Glitch",
  vhs: "VHS",
  synthwave: "Synthwave",
  emoji: "Pluie d'emoji",
};

export const FONT_META: Record<
  FontId,
  { label: string; family: string; google: string | null; spacing?: string }
> = {
  classic: {
    label: "Classique",
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    google: null,
  },
  poppins: {
    // "Minimaliste" = police du wordmark Movalink : géométrique façon Futura,
    // avec un espacement des lettres pour coller au logo.
    label: "Minimaliste",
    family: "'Jost', sans-serif",
    google: "Jost:wght@400;500",
    spacing: "0.12em",
  },
  playfair: {
    label: "Élégant",
    family: "'Playfair Display', serif",
    google: "Playfair+Display:wght@500;700",
  },
  dancing: {
    label: "Calligraphie",
    family: "'Dancing Script', cursive",
    google: "Dancing+Script:wght@500;700",
  },
  caveat: {
    label: "Manuscrit",
    family: "'Caveat', cursive",
    google: "Caveat:wght@500;700",
  },
  satisfy: {
    label: "Script",
    family: "'Satisfy', cursive",
    google: "Satisfy",
  },
  pixel: {
    label: "Pixel",
    family: "'Press Start 2P', monospace",
    google: "Press+Start+2P",
  },
  bebas: {
    label: "Condensé",
    family: "'Bebas Neue', sans-serif",
    google: "Bebas+Neue",
  },
  orbitron: {
    label: "Futuriste",
    family: "'Orbitron', sans-serif",
    google: "Orbitron:wght@500;700",
  },
  bungee: {
    label: "Bloc",
    family: "'Bungee', cursive",
    google: "Bungee",
  },
  monoton: {
    label: "Néon rétro",
    family: "'Monoton', cursive",
    google: "Monoton",
  },
  pirata: {
    label: "Gothique",
    family: "'Pirata One', system-ui, cursive",
    google: "Pirata+One",
  },
  typewriter: {
    label: "Machine à écrire",
    family: "'Special Elite', monospace",
    google: "Special+Elite",
  },
  fredoka: {
    label: "Arrondi",
    family: "'Fredoka', sans-serif",
    google: "Fredoka:wght@500;600",
  },
  marker: {
    label: "Marqueur",
    family: "'Permanent Marker', cursive",
    google: "Permanent+Marker",
  },
  stencil: {
    label: "Pochoir",
    family: "'Black Ops One', system-ui, sans-serif",
    google: "Black+Ops+One",
  },
  bangers: {
    label: "Comics",
    family: "'Bangers', system-ui, cursive",
    google: "Bangers",
  },
  creepster: {
    label: "Horreur",
    family: "'Creepster', system-ui, cursive",
    google: "Creepster",
  },
};

export const BUTTON_STYLE_LABELS: Record<ButtonStyleId, string> = {
  rounded: "Arrondi",
  pill: "Pilule",
  square: "Carré",
  outline: "Contour",
  glass: "Verre",
  neon: "Néon",
  gradient: "Dégradé",
  shadow: "Ombre",
  underline: "Souligné",
  bevel: "Relief 3D",
};

export const AVATAR_FRAME_LABELS: Record<AvatarFrameId, string> = {
  none: "Aucun",
  ring: "Anneau",
  double: "Double",
  glow: "Halo",
  animated: "Animé",
  dashed: "Pointillé",
  gradientRing: "Dégradé",
  pulse: "Pulsation",
};

export const CURSOR_LABELS: Record<CursorId, string> = {
  default: "Défaut",
  crosshair: "Viseur",
  neon: "Point néon",
};

export const THEME_DEFAULTS = {
  font: "classic" as FontId,
  buttonStyle: "rounded" as ButtonStyleId,
  avatarFrame: "ring" as AvatarFrameId,
  cursor: "default" as CursorId,
};

export const ACCENT_PRESETS = [
  "#18181b",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
];

export function emptyProfile(username: string): Profile {
  return {
    username,
    displayName: username,
    bio: "",
    avatarUrl: "",
    backgroundUrl: "",
    links: [],
    socials: {},
    games: [],
    theme: {
      accent: "#6366f1",
      effect: "none",
      layout: "card",
      font: THEME_DEFAULTS.font,
      buttonStyle: THEME_DEFAULTS.buttonStyle,
      avatarFrame: THEME_DEFAULTS.avatarFrame,
      cursor: THEME_DEFAULTS.cursor,
    },
    decoration: null,
    updatedAt: new Date().toISOString(),
  };
}

export function emptyStats(): Stats {
  return { totalViews: 0, totalClicks: 0, byDay: {}, byLink: {} };
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    plan: user.plan,
    isAdmin: user.isAdmin,
    referralCode: user.referralCode,
    referralCount: user.referralCount ?? 0,
    createdAt: user.createdAt,
  };
}
