import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getProfile, getUserById } from "./store";
import { Plan, User } from "./types";

const COOKIE_NAME = "ml_session";
const ACCOUNTS_COOKIE = "ml_accounts"; // multi-comptes : liste {id, token}
const MAX_ACCOUNTS = 6;
const SESSION_DAYS = 30;

function secret(): Uint8Array {
  const raw = process.env.AUTH_SECRET ?? "movalink-dev-secret-do-not-use-in-prod";
  return new TextEncoder().encode(raw);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

interface StoredAccount {
  id: string;
  token: string;
}

const cookieOpts = () =>
  ({
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: "/",
  });

async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

async function readAccounts(): Promise<StoredAccount[]> {
  const jar = await cookies();
  const raw = jar.get(ACCOUNTS_COOKIE)?.value;
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list)
      ? list.filter((a) => a && typeof a.id === "string" && typeof a.token === "string")
      : [];
  } catch {
    return [];
  }
}

async function writeAccounts(list: StoredAccount[]): Promise<void> {
  const jar = await cookies();
  if (list.length === 0) {
    jar.delete(ACCOUNTS_COOKIE);
    return;
  }
  jar.set(ACCOUNTS_COOKIE, JSON.stringify(list.slice(-MAX_ACCOUNTS)), cookieOpts());
}

// Ouvre une session. `add` conserve les comptes déjà connectés (façon
// Instagram) au lieu de les remplacer ; sinon la liste est réinitialisée.
export async function createSession(
  userId: string,
  opts: { add?: boolean } = {}
): Promise<void> {
  const token = await signToken(userId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, cookieOpts());

  const existing = opts.add ? await readAccounts() : [];
  const list = existing.filter((a) => a.id !== userId);
  list.push({ id: userId, token });
  await writeAccounts(list);
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  jar.delete(ACCOUNTS_COOKIE);
}

export interface AccountSummary {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  plan: Plan;
  active: boolean;
}

// Liste les comptes connectés (pour le sélecteur). Élague les jetons
// invalides/expirés au passage.
export async function listAccounts(): Promise<AccountSummary[]> {
  const jar = await cookies();
  const activeToken = jar.get(COOKIE_NAME)?.value;
  const stored = await readAccounts();
  const out: AccountSummary[] = [];
  const valid: StoredAccount[] = [];
  for (const a of stored) {
    try {
      await jwtVerify(a.token, secret());
    } catch {
      continue; // jeton expiré/invalide : on l'élague
    }
    const user = await getUserById(a.id);
    if (!user) continue;
    valid.push(a);
    const profile = await getProfile(user.username);
    out.push({
      id: user.id,
      username: user.username,
      name: profile?.displayName || user.username,
      avatarUrl: profile?.avatarUrl || null,
      plan: user.plan,
      active: a.token === activeToken,
    });
  }
  if (valid.length !== stored.length) await writeAccounts(valid);
  return out;
}

// Bascule le compte actif vers `userId` s'il fait partie des comptes connectés.
export async function switchAccount(userId: string): Promise<boolean> {
  const stored = await readAccounts();
  const target = stored.find((a) => a.id === userId);
  if (!target) return false;
  try {
    await jwtVerify(target.token, secret());
  } catch {
    return false;
  }
  const jar = await cookies();
  jar.set(COOKIE_NAME, target.token, cookieOpts());
  return true;
}

// Déconnecte le compte actif. S'il reste d'autres comptes, bascule vers l'un
// d'eux ; sinon efface tout. Retourne l'id basculé (ou null).
export async function logoutCurrent(): Promise<{ switchedTo: string | null }> {
  const jar = await cookies();
  const activeToken = jar.get(COOKIE_NAME)?.value;
  const remaining = (await readAccounts()).filter((a) => a.token !== activeToken);
  if (remaining.length > 0) {
    const next = remaining[remaining.length - 1];
    jar.set(COOKIE_NAME, next.token, cookieOpts());
    await writeAccounts(remaining);
    return { switchedTo: next.id };
  }
  jar.delete(COOKIE_NAME);
  jar.delete(ACCOUNTS_COOKIE);
  return { switchedTo: null };
}

export async function getSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const id = await getSessionUserId();
  return id ? getUserById(id) : null;
}
