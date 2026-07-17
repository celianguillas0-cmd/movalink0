import { promises as fs } from "fs";
import path from "path";
import { createHmac } from "crypto";
import { Redis } from "@upstash/redis";
import { put, del as blobDelete } from "@vercel/blob";
import {
  User,
  Profile,
  Stats,
  Plan,
  Report,
  LeaderboardEntry,
  SavedProfileSlot,
  emptyStats,
} from "./types";

export interface UserStats {
  total: number;
  free: number;
  pro: number;
  elite: number;
}

interface KV {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(...keys: string[]): Promise<void>;
}

class UpstashKV implements KV {
  private redis: Redis;
  constructor(url: string, token: string) {
    this.redis = new Redis({ url, token });
  }
  async get<T>(key: string): Promise<T | null> {
    return (await this.redis.get<T>(key)) ?? null;
  }
  async set(key: string, value: unknown): Promise<void> {
    await this.redis.set(key, value);
  }
  async del(...keys: string[]): Promise<void> {
    if (keys.length) await this.redis.del(...keys);
  }
}

// KV persistant basé sur Vercel Blob : chaque clé est stockée dans un blob
// JSON dont le chemin est un HMAC de la clé (impossible à deviner sans
// AUTH_SECRET, car les blobs sont publiquement lisibles par URL). Les
// lectures utilisent un cache-buster pour obtenir la version fraîche.
class BlobKV implements KV {
  private base: string;
  private prefix: string;
  // Cache mémoire des écritures récentes : couvre la fenêtre de propagation
  // (~2 s) du blob vers les autres points de lecture, pour que "inscription
  // puis lecture immédiate" fonctionne toujours sur la même instance.
  private recent = new Map<string, { value: unknown; at: number }>();
  private static RECENT_TTL_MS = 30_000;
  // Cache mémoire des lectures : une navigation dans le dashboard relit les
  // mêmes clés (user/profile/stats) à chaque clic — on évite de retaper le
  // blob pendant quelques secondes. La staleness maximale (3 s) reste dans
  // l'ordre de grandeur de la propagation blob déjà tolérée, et les
  // écritures locales passent par `recent` qui a priorité.
  private reads = new Map<string, { value: unknown; at: number }>();
  private static READ_TTL_MS = 3_000;

  constructor(private token: string) {
    const storeId = token.split("_")[3] ?? "";
    this.base = `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
    this.prefix = process.env.VERCEL_ENV === "production" ? "kv" : "kv-preview";
  }

  private pathFor(key: string): string {
    const secret =
      process.env.AUTH_SECRET ?? "movalink-dev-secret-do-not-use-in-prod";
    const digest = createHmac("sha256", secret).update(key).digest("hex");
    return `${this.prefix}/${digest}.json`;
  }

  private fromRecent(key: string): unknown | undefined {
    const entry = this.recent.get(key);
    if (!entry) return undefined;
    if (Date.now() - entry.at > BlobKV.RECENT_TTL_MS) {
      this.recent.delete(key);
      return undefined;
    }
    return entry.value;
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = this.fromRecent(key);
    if (cached !== undefined) {
      return structuredClone(cached) as T;
    }
    const read = this.reads.get(key);
    if (read && Date.now() - read.at <= BlobKV.READ_TTL_MS) {
      return structuredClone(read.value) as T;
    }
    const buster = `${Date.now()}${Math.random().toString(36).slice(2)}`;
    const res = await fetch(`${this.base}/${this.pathFor(key)}?nc=${buster}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`BlobKV get: ${res.status}`);
    const value = (await res.json()) as T;
    // On ne met en cache que les valeurs existantes : cacher les 404
    // retarderait la visibilité d'un compte fraîchement créé ailleurs.
    this.reads.set(key, { value: structuredClone(value), at: Date.now() });
    if (this.reads.size > 500) {
      const cutoff = Date.now() - BlobKV.READ_TTL_MS;
      for (const [k, v] of this.reads) {
        if (v.at < cutoff) this.reads.delete(k);
      }
    }
    return value;
  }

  async set(key: string, value: unknown): Promise<void> {
    await put(this.pathFor(key), JSON.stringify(value), {
      access: "public",
      token: this.token,
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    this.recent.set(key, { value: structuredClone(value), at: Date.now() });
    this.reads.delete(key);
    // Évite une croissance illimitée sur une instance très active.
    if (this.recent.size > 500) {
      const cutoff = Date.now() - BlobKV.RECENT_TTL_MS;
      for (const [k, v] of this.recent) {
        if (v.at < cutoff) this.recent.delete(k);
      }
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (!keys.length) return;
    for (const k of keys) {
      this.recent.delete(k);
      this.reads.delete(k);
    }
    await blobDelete(
      keys.map((k) => `${this.base}/${this.pathFor(k)}`),
      { token: this.token }
    );
  }
}

class FileKV implements KV {
  private data: Record<string, unknown> | null = null;
  private writing: Promise<void> = Promise.resolve();
  constructor(private file: string) {}

  private async load(): Promise<Record<string, unknown>> {
    if (this.data) return this.data;
    try {
      this.data = JSON.parse(await fs.readFile(this.file, "utf8"));
    } catch {
      this.data = {};
    }
    return this.data!;
  }

  private persist(): Promise<void> {
    const snapshot = JSON.stringify(this.data);
    this.writing = this.writing
      .then(() => fs.mkdir(path.dirname(this.file), { recursive: true }))
      .then(() => fs.writeFile(this.file, snapshot, "utf8"))
      .catch(() => {});
    return this.writing;
  }

  async get<T>(key: string): Promise<T | null> {
    const d = await this.load();
    return (d[key] as T) ?? null;
  }
  async set(key: string, value: unknown): Promise<void> {
    const d = await this.load();
    d[key] = value;
    await this.persist();
  }
  async del(...keys: string[]): Promise<void> {
    const d = await this.load();
    for (const k of keys) delete d[k];
    await this.persist();
  }
}

function createKV(): KV {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) return new UpstashKV(url, token);
  // Sur Vercel, sans Redis : Vercel Blob sert de stockage persistant partagé
  // entre toutes les instances (indispensable, /tmp est éphémère et local).
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    return new BlobKV(process.env.BLOB_READ_WRITE_TOKEN);
  }
  const file = process.env.VERCEL
    ? "/tmp/movalink-db.json"
    : path.join(process.cwd(), ".data", "db.json");
  return new FileKV(file);
}

const globalStore = globalThis as unknown as { __movalinkKV?: KV };
export const kv: KV = globalStore.__movalinkKV ?? (globalStore.__movalinkKV = createKV());

export function usingPersistentStore(): boolean {
  const hasRedis = Boolean(
    (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN)
  );
  const hasBlob = Boolean(
    process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN
  );
  return hasRedis || hasBlob || !process.env.VERCEL;
}

const userKey = (id: string) => `user:${id}`;
const emailKey = (email: string) => `email:${email.toLowerCase()}`;
const usernameKey = (username: string) => `uname:${username.toLowerCase()}`;
const profileKey = (username: string) => `profile:${username.toLowerCase()}`;
const statsKey = (username: string) => `stats:${username.toLowerCase()}`;
const reportKey = (id: string) => `report:${id}`;
const referralKey = (code: string) => `referral:${code}`;
const LEADERBOARD_KEY = "global:leaderboard";

export async function getUserById(id: string): Promise<User | null> {
  return kv.get<User>(userKey(id));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await kv.get<string>(emailKey(email));
  return id ? getUserById(id) : null;
}

export async function getUserIdByUsername(username: string): Promise<string | null> {
  return kv.get<string>(usernameKey(username));
}

export async function saveUser(user: User): Promise<void> {
  await kv.set(userKey(user.id), user);
}

export async function createUserRecords(user: User, profile: Profile): Promise<void> {
  await Promise.all([
    kv.set(userKey(user.id), user),
    kv.set(emailKey(user.email), user.id),
    kv.set(usernameKey(user.username), user.id),
    kv.set(profileKey(user.username), profile),
    kv.set(statsKey(user.username), emptyStats()),
  ]);
}

export async function deleteUserRecords(user: User): Promise<void> {
  await kv.del(
    userKey(user.id),
    emailKey(user.email),
    usernameKey(user.username),
    profileKey(user.username),
    statsKey(user.username)
  );
}

export async function getProfile(username: string): Promise<Profile | null> {
  return kv.get<Profile>(profileKey(username));
}

export async function saveProfile(profile: Profile): Promise<void> {
  await kv.set(profileKey(profile.username), profile);
}

export async function getStats(username: string): Promise<Stats> {
  return (await kv.get<Stats>(statsKey(username))) ?? emptyStats();
}

const MAX_DAY_ENTRIES = 400;

export async function bumpStats(
  username: string,
  type: "view" | "click",
  linkId?: string
): Promise<void> {
  const stats = await getStats(username);
  const day = new Date().toISOString().slice(0, 10);
  const dayStats = stats.byDay[day] ?? { views: 0, clicks: 0 };
  if (type === "view") {
    stats.totalViews += 1;
    dayStats.views += 1;
  } else {
    stats.totalClicks += 1;
    dayStats.clicks += 1;
    if (linkId) stats.byLink[linkId] = (stats.byLink[linkId] ?? 0) + 1;
  }
  stats.byDay[day] = dayStats;
  const days = Object.keys(stats.byDay).sort();
  while (days.length > MAX_DAY_ENTRIES) {
    delete stats.byDay[days.shift()!];
  }
  await kv.set(statsKey(username), stats);
}

export async function saveReport(report: Report): Promise<void> {
  await kv.set(reportKey(report.id), report);
  const ids = (await kv.get<string[]>("reports:index")) ?? [];
  ids.unshift(report.id);
  await kv.set("reports:index", ids.slice(0, 500));
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return (await kv.get<LeaderboardEntry[]>(LEADERBOARD_KEY)) ?? [];
}

export async function updateLeaderboard(entry: LeaderboardEntry): Promise<void> {
  const board = await getLeaderboard();
  const idx = board.findIndex((e) => e.username === entry.username);
  if (idx >= 0) {
    board[idx] = entry;
  } else {
    board.push(entry);
  }
  board.sort((a, b) => b.totalViews - a.totalViews);
  await kv.set(LEADERBOARD_KEY, board.slice(0, 100));
}

// ─── Referral ────────────────────────────────────────────────────────────────

export async function getReferralUserId(code: string): Promise<string | null> {
  return kv.get<string>(referralKey(code));
}

export async function saveReferralCode(code: string, userId: string): Promise<void> {
  await kv.set(referralKey(code), userId);
}

// ─── Saved profile slots ──────────────────────────────────────────────────────

const savedSlotsKey = (userId: string) => `savedslots:${userId}`;

export async function getSavedSlots(userId: string): Promise<SavedProfileSlot[]> {
  return (await kv.get<SavedProfileSlot[]>(savedSlotsKey(userId))) ?? [];
}

export async function setSavedSlots(userId: string, slots: SavedProfileSlot[]): Promise<void> {
  await kv.set(savedSlotsKey(userId), slots);
}

export async function incrementReferralCount(userId: string): Promise<void> {
  const user = await getUserById(userId);
  if (!user) return;
  const updated = { ...user, referralCount: (user.referralCount ?? 0) + 1 };
  await kv.set(userKey(userId), updated);
}

// ─── Global user stats ────────────────────────────────────────────────────────

const USER_STATS_KEY = "users:stats";

export async function getUserStats(): Promise<UserStats> {
  return (await kv.get<UserStats>(USER_STATS_KEY)) ?? { total: 0, free: 0, pro: 0, elite: 0 };
}

export async function incrementUserStats(plan: Plan): Promise<void> {
  const s = await getUserStats();
  s.total += 1;
  s[plan] += 1;
  await kv.set(USER_STATS_KEY, s);
}

export async function updateUserStatsPlan(oldPlan: Plan, newPlan: Plan): Promise<void> {
  if (oldPlan === newPlan) return;
  const s = await getUserStats();
  s[oldPlan] = Math.max(0, s[oldPlan] - 1);
  s[newPlan] += 1;
  await kv.set(USER_STATS_KEY, s);
}

export async function decrementUserStats(plan: Plan): Promise<void> {
  const s = await getUserStats();
  s.total = Math.max(0, s.total - 1);
  s[plan] = Math.max(0, s[plan] - 1);
  await kv.set(USER_STATS_KEY, s);
}
