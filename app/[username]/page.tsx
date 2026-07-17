import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import { getProfile, getStats, getUserById, getUserIdByUsername } from "@/lib/store";
import { RESERVED_USERNAMES } from "@/lib/slug";
import { PLAN_LIMITS } from "@/lib/types";

// Pas de force-dynamic : ISR revalide toutes les 30 s (CDN cache entre-temps).
// Le tracking des vues reste côté client (sendBeacon), donc pas besoin de SSR live.
export const revalidate = 30;

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw).toLowerCase();
  const profile = RESERVED_USERNAMES.has(username)
    ? null
    : await getProfile(username);
  if (!profile) {
    return { title: "Profil introuvable" };
  }
  return {
    title: `${profile.displayName} (@${profile.username})`,
    description:
      profile.bio || `La page de ${profile.displayName} sur Movalink.`,
    twitter: { card: "summary_large_image" },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw).toLowerCase();
  if (RESERVED_USERNAMES.has(username)) notFound();

  const userId = await getUserIdByUsername(username);
  if (!userId) notFound();

  const [profile, owner, stats] = await Promise.all([
    getProfile(username),
    getUserById(userId),
    getStats(username),
  ]);
  if (!profile || !owner) notFound();

  const branding = PLAN_LIMITS[owner.plan].branding;
  const watermark = PLAN_LIMITS[owner.plan].watermark;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <div className="flex flex-1 flex-col">
        <ProfileView
          profile={profile}
          branding={branding}
          watermark={watermark}
          interactive
          viewCount={stats.totalViews}
        />
      </div>
      <div className="flex items-center justify-center gap-4 border-t border-white/10 bg-zinc-950 py-3 text-xs text-white/40">
        <Link
          href={`/report?u=${encodeURIComponent(profile.username)}`}
          className="transition-colors hover:text-white/80"
        >
          Signaler cette page
        </Link>
        <span aria-hidden>·</span>
        <Link href="/legal/cgu" className="transition-colors hover:text-white/80">
          CGU
        </Link>
      </div>
    </div>
  );
}
