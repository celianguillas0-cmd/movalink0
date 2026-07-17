"use client";

import { PlanLimits, Profile, PublicUser, Stats } from "./types";

export interface MeData {
  user: PublicUser;
  profile: Profile;
  stats: Stats;
  limits: PlanLimits;
}

export interface MeResult {
  me: MeData | null;
  unauthorized: boolean;
}

// Cache client partagé de /api/me : les pages du dashboard s'affichent
// instantanément avec les dernières données connues pendant qu'une
// revalidation silencieuse tourne en arrière-plan. Les appels simultanés
// (sidebar + page) partagent la même requête réseau.
let cache: MeData | null = null;
let inflight: Promise<MeResult> | null = null;

export function getCachedMe(): MeData | null {
  return cache;
}

export function setCachedMe(patch: Partial<MeData>): void {
  if (cache) cache = { ...cache, ...patch };
}

export function clearCachedMe(): void {
  cache = null;
  inflight = null;
}

export function fetchMe(): Promise<MeResult> {
  if (!inflight) {
    inflight = fetch("/api/me")
      .then(async (r) => {
        if (r.status === 401) {
          cache = null;
          return { me: null, unauthorized: true };
        }
        if (!r.ok) return { me: null, unauthorized: false };
        cache = (await r.json()) as MeData;
        return { me: cache, unauthorized: false };
      })
      .catch(() => ({ me: null, unauthorized: false }))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}
