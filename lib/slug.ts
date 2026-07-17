export const RESERVED_USERNAMES = new Set([
  "api",
  "dashboard",
  "login",
  "signup",
  "logout",
  "pricing",
  "legal",
  "cgu",
  "confidentialite",
  "mentions-legales",
  "report",
  "upgrade",
  "admin",
  "settings",
  "account",
  "assets",
  "static",
  "public",
  "movalink",
  "support",
  "contact",
  "help",
  "about",
  "blog",
  "docs",
  "app",
  "www",
  "mail",
  "root",
  "moderation",
  "abuse",
]);

const USERNAME_RE = /^[a-z0-9][a-z0-9_-]{2,19}$/;

export function validateUsername(raw: string): { ok: true; username: string } | { ok: false; error: string } {
  const username = raw.trim().toLowerCase();
  if (!USERNAME_RE.test(username)) {
    return {
      ok: false,
      error:
        "Le pseudo doit faire 3 à 20 caractères (lettres minuscules, chiffres, tirets et underscores, il doit commencer par une lettre ou un chiffre).",
    };
  }
  if (RESERVED_USERNAMES.has(username)) {
    return { ok: false, error: "Ce pseudo est réservé." };
  }
  return { ok: true, username };
}

export function validateEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}

export function sanitizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProto);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}
