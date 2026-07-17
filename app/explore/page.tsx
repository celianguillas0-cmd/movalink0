import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/store";
import { PLAN_LIMITS } from "@/lib/types";

export const metadata: Metadata = { title: "Explorer — Movalink" };
export const revalidate = 120;

const PLAN_BADGE: Record<string, string> = {
  elite: "Elite",
  pro: "Pro",
};

export default async function ExplorePage() {
  const board = await getLeaderboard();

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Explorer</h1>
          <p className="mt-2 text-sm text-white/50">
            Les profils Movalink les plus consultés.
          </p>
        </div>

        {board.length === 0 ? (
          <p className="text-center text-sm text-white/40">
            Aucun profil public pour l'instant. Partage le tien !
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {board.map((entry, i) => (
              <Link
                key={entry.username}
                href={`/${entry.username}`}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10"
              >
                <span className="w-6 shrink-0 text-center text-sm font-bold text-white/30">
                  {i + 1}
                </span>
                <div className="relative h-10 w-10 shrink-0">
                  {entry.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.avatarUrl}
                      alt={entry.displayName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
                      {entry.displayName[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  {!PLAN_LIMITS[entry.plan].branding && (
                    <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                      {PLAN_BADGE[entry.plan] ?? ""}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{entry.displayName}</p>
                  <p className="text-xs text-white/40">@{entry.username}</p>
                </div>
                <span className="shrink-0 text-xs text-white/30">
                  {entry.totalViews.toLocaleString("fr-FR")} vues
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-white/30 underline hover:text-white/60"
          >
            Créer mon profil →
          </Link>
        </div>
      </div>
    </div>
  );
}
