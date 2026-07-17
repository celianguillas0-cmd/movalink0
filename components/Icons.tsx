import { SocialLinks } from "@/lib/types";

interface IconProps {
  className?: string;
}

export function LogoMark({ className }: IconProps) {
  // Le M Movalink : chevron central + deux piliers coupés en biseau.
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden>
      <path d="M0 0L26 0L50 32L74 0L100 0L50 66Z" />
      <path d="M0 8L26 42L26 100L0 100Z" />
      <path d="M100 8L74 42L74 100L100 100Z" />
    </svg>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function TwitchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 4l16 16M20 4L4 20"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DiscordIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8.5 4.5C6.5 5 5 5.8 4.3 6.3 2.7 9.2 2 12.6 2.3 16c1.4 1.2 3.2 2.1 4.7 2.5l1-1.7c-.6-.2-1.4-.6-2-1l.5-.4c2.2 1 4.8 1.1 5.5 1.1s3.3-.1 5.5-1.1l.5.4c-.6.4-1.4.8-2 1l1 1.7c1.5-.4 3.3-1.3 4.7-2.5.3-3.4-.4-6.8-2-9.7-.7-.5-2.2-1.3-4.2-1.8l-.6 1.1c-1.2-.2-2.6-.2-3.8 0l-.6-1.1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function SteamIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="15.5" cy="8.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="15.5" r="1.9" fill="currentColor" />
      <path
        d="M9.6 14.4l4.1-4.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KickIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M5 3h5v6l4-4h5l-6 7 6 7h-5l-4-4v6H5z" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.5 1.5M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GamepadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 7h10a5 5 0 015 5v2.5a2.5 2.5 0 01-4.4 1.6L15.5 14h-7l-2.1 2.1A2.5 2.5 0 012 14.5V12a5 5 0 015-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 10v3M6.5 11.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="10.6" r="1" fill="currentColor" />
      <circle cx="18.2" cy="12.4" r="1" fill="currentColor" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 20V4M4 20h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 16v-5M12 16V8M16 16v-3M20 16V6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PaletteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3a9 9 0 100 18c1.5 0 2-.8 2-1.7 0-.8-.5-1.3-.5-2.1 0-1 .8-1.7 1.8-1.7H17a5 5 0 005-5c0-4.2-4.5-7.5-10-7.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="10" r="1.2" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="16" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 15V6a2 2 0 012-2h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SnapchatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.2c2.3 0 3.7 1.7 3.8 4 0 .6-.1 1.4-.1 2 .3.2.7.2 1 .1.9-.4 1.6.9.5 1.4-.6.3-1.5.4-1.6 1-.1.7 1.4 2.4 3.1 2.9.4.1.4.5.1.7-.6.4-1.6.4-1.9.8-.2.3.1.9-.4 1.1-.5.2-1.3-.3-2.3-.1-.9.2-1.5 1.4-3.2 1.4s-2.3-1.2-3.2-1.4c-1-.2-1.8.3-2.3.1-.5-.2-.2-.8-.4-1.1-.3-.4-1.3-.4-1.9-.8-.3-.2-.3-.6.1-.7C6.6 15.1 8.1 13.4 8 12.7c-.1-.6-1-.7-1.6-1-1.1-.5-.4-1.8.5-1.4.3.1.7.1 1-.1 0-.6-.1-1.4-.1-2 .1-2.3 1.5-4 3.8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.9 4.3 18.7 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13 1.7 11.5c-1-.3-1-1 .2-1.5L20.6 2.8c.9-.3 1.6.2 1.3 1.5z" />
    </svg>
  );
}

export function RedditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.7" cy="12.8" r="1.1" fill="currentColor" />
      <circle cx="15.3" cy="12.8" r="1.1" fill="currentColor" />
      <path d="M9 16c.8.7 1.9 1 3 1s2.2-.3 3-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="19.5" cy="9" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 5.5 14 3l3 .8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="3" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function SkoolIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 5 3 9l9 4 9-4-9-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 11v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 20l1.3-4A8 8 0 1120 12a8 8 0 01-14 5.3L4 20z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 9c0 3 3 6 6 6 .6 0 1-.6 1-1l-1.5-1-1 .8c-1-.4-1.9-1.3-2.3-2.3l.8-1L11 9c0-.6-.5-1-1-1s-1 .4-1 1z" fill="currentColor" />
    </svg>
  );
}

export function ThreadsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M16 12c0-2.5-1.7-4-4-4-2 0-3.3 1.2-3.5 2.8M12 20c-4 0-6.5-2.8-6.5-8S8 4 12 4c2.6 0 4.6 1.1 5.6 3M11 12.5c-1.2 0-2 .6-2 1.6s.9 1.6 2 1.6c1.6 0 2.5-1 2.5-3.2 0-.5 0-.9-.1-1.2 1.5.4 2.4 1.6 2.4 3.3 0 2.2-1.6 3.9-4.3 3.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M14 8.5V7c0-.8.4-1.2 1.2-1.2H16.5V3h-2.3C11.9 3 11 4.3 11 6.4v2.1H9V11h2v10h3V11h2.2l.4-2.5H14z" fill="currentColor" />
    </svg>
  );
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 20c-.4-1.4 0-3 .4-4.5l.9-3.6M9.2 10.5c0-1.9 1.5-3.4 3.6-3.4 1.9 0 3.2 1.2 3.2 3 0 2.3-1.2 4-2.9 4-.9 0-1.6-.7-1.4-1.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpotifyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 9.5c3-1 6-.7 8.5.8M8 12.5c2.5-.8 4.8-.5 6.8.7M8.5 15.3c2-.6 3.6-.4 5 .5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SoundCloudIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 16v-4M7 16v-6M10 16v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 16V8.5a4 4 0 017.9.8H21a2.5 2.5 0 010 5h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PatreonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="15" cy="9.5" r="5.5" />
      <rect x="4" y="4" width="2.8" height="16" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<keyof SocialLinks, (props: IconProps) => React.ReactElement> = {
  discord: DiscordIcon,
  twitch: TwitchIcon,
  youtube: YouTubeIcon,
  x: XIcon,
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  snapchat: SnapchatIcon,
  telegram: TelegramIcon,
  reddit: RedditIcon,
  skool: SkoolIcon,
  whatsapp: WhatsAppIcon,
  threads: ThreadsIcon,
  facebook: FacebookIcon,
  pinterest: PinterestIcon,
  linkedin: LinkedInIcon,
  spotify: SpotifyIcon,
  soundcloud: SoundCloudIcon,
  patreon: PatreonIcon,
  github: GithubIcon,
  steam: SteamIcon,
  kick: KickIcon,
};

export const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  discord: "Discord",
  twitch: "Twitch",
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
  instagram: "Instagram",
  snapchat: "Snapchat",
  telegram: "Telegram",
  reddit: "Reddit",
  skool: "Skool",
  whatsapp: "WhatsApp",
  threads: "Threads",
  facebook: "Facebook",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  patreon: "Patreon",
  github: "GitHub",
  steam: "Steam",
  kick: "Kick",
};

export function socialHref(key: keyof SocialLinks, value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const clean = v.replace(/^@/, "");
  switch (key) {
    case "twitch":
      return `https://twitch.tv/${clean}`;
    case "youtube":
      return `https://youtube.com/@${clean}`;
    case "x":
      return `https://x.com/${clean}`;
    case "tiktok":
      return `https://tiktok.com/@${clean}`;
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "github":
      return `https://github.com/${clean}`;
    case "steam":
      return `https://steamcommunity.com/id/${clean}`;
    case "kick":
      return `https://kick.com/${clean}`;
    case "snapchat":
      return `https://snapchat.com/add/${clean}`;
    case "telegram":
      return `https://t.me/${clean}`;
    case "reddit":
      return `https://reddit.com/user/${clean}`;
    case "skool":
      return `https://skool.com/${clean}`;
    case "whatsapp":
      return `https://wa.me/${v.replace(/[^0-9]/g, "")}`;
    case "threads":
      return `https://threads.net/@${clean}`;
    case "facebook":
      return `https://facebook.com/${clean}`;
    case "pinterest":
      return `https://pinterest.com/${clean}`;
    case "linkedin":
      return `https://linkedin.com/in/${clean}`;
    case "spotify":
      return `https://open.spotify.com/user/${clean}`;
    case "soundcloud":
      return `https://soundcloud.com/${clean}`;
    case "patreon":
      return `https://patreon.com/${clean}`;
    case "discord":
      return null;
  }
}
