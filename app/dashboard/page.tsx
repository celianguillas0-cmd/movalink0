"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import {
  cardClass,
  pageSubtitleClass,
  pageTitleClass,
  smallBtnClass,
} from "@/lib/ui";
import InstallButton from "@/components/InstallButton";
import { SOCIAL_LABELS } from "@/components/Icons";
import { fetchMe, getCachedMe } from "@/lib/me-client";
import {
  PlanLimits,
  Profile,
  PublicUser,
  SocialLinks,
  Stats,
} from "@/lib/types";

export default function DashboardHomePage() {
  const router = useRouter();
  const cached = getCachedMe();
  const [user, setUser] = useState<PublicUser | null>(cached?.user ?? null);
  const [profile, setProfile] = useState<Profile | null>(cached?.profile ?? null);
  const [stats, setStats] = useState<Stats | null>(cached?.stats ?? null);
  const [limits, setLimits] = useState<PlanLimits | null>(cached?.limits ?? null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    let alive = true;
    fetchMe().then(({ me, unauthorized }) => {
      if (!alive) return;
      if (unauthorized) {
        router.push("/login");
        return;
      }
      if (me) {
        setUser(me.user);
        setProfile(me.profile);
        setStats(me.stats);
        setLimits(me.limits);
      }
    });
    return () => {
      alive = false;
    };
  }, [router]);

  const days = useMemo(() => {
    if (!stats || !limits) return [];
    const shown = Math.min(limits.statsDays, 30);
    const out: { date: string; views: number; clicks: number }[] = [];
    for (let i = shown - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const s = stats.byDay[key];
      out.push({ date: key.slice(5), views: s?.views ?? 0, clicks: s?.clicks ?? 0 });
    }
    return out;
  }, [stats, limits]);

  const maxViews = Math.max(1, ...days.map((d) => d.views));

  const topLinks = useMemo(() => {
    if (!stats || !profile) return [];
    const labelOf = (id: string) => {
      if (id.startsWith("social-")) {
        const key = id.replace("social-", "") as keyof SocialLinks;
        return SOCIAL_LABELS[key] ?? id;
      }
      return profile.links.find((l) => l.id === id)?.label ?? "Lien supprimé";
    };
    return Object.entries(stats.byLink)
      .map(([id, count]) => ({ id, label: labelOf(id), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [stats, profile]);

  if (!user || !profile || !stats || !limits) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-6 w-40 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          <div className="h-40 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const publicUrl = `movalink.vercel.app/${user.username}`;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className={pageTitleClass}>Accueil</h1>
              <p className={pageSubtitleClass}>
                Vue d'ensemble de ta page et de ton audience.
              </p>
            </div>
            <InstallButton className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className={`${cardClass} mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {publicUrl}
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Ton lien public — colle-le dans toutes tes bios.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              className={smallBtnClass}
              onClick={() => {
                navigator.clipboard?.writeText(`https://${publicUrl}`).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copié" : "Copier le lien"}
            </button>
            <Link href={`/${user.username}`} target="_blank" className={smallBtnClass}>
              Voir ma page
            </Link>
            <button
              type="button"
              className={smallBtnClass}
              onClick={() => {
                if (qrDataUrl) {
                  setQrDataUrl("");
                  return;
                }
                QRCode.toDataURL(`https://${publicUrl}`, {
                  width: 480,
                  margin: 2,
                  color: { dark: "#09090b", light: "#ffffff" },
                })
                  .then(setQrDataUrl)
                  .catch(() => {});
              }}
            >
              {qrDataUrl ? "Masquer le QR" : "QR code"}
            </button>
            <Link
              href="/dashboard/mapage"
              className="rounded-lg bg-zinc-900 dark:bg-white px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 transition-opacity hover:opacity-90"
            >
              Modifier
            </Link>
          </div>
        </motion.div>

        {qrDataUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardClass} mb-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR code vers ${publicUrl}`}
              className="h-40 w-40 rounded-lg border border-gray-100 dark:border-zinc-800"
            />
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <p className="text-sm text-gray-600 dark:text-zinc-300">
                Scanne ou imprime ce QR code : il mène directement vers ta page.
                Parfait pour les stories, cartes de visite ou setups de stream.
              </p>
              <a
                href={qrDataUrl}
                download={`movalink-${user.username}-qr.png`}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                Télécharger le PNG
              </a>
            </div>
          </motion.div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className={cardClass}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-gray-400 dark:text-zinc-500">Vues totales</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalViews}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className={cardClass}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-gray-400 dark:text-zinc-500">Clics totaux</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalClicks}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={`${cardClass} mb-4`}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Vues des {Math.min(limits.statsDays, 30)} derniers jours
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
            Ton plan conserve {limits.statsDays} jours d'historique.
          </p>
          <div className="mt-4 flex h-32 items-end gap-1">
            {days.map((d) => (
              <div
                key={d.date}
                className="flex-1 rounded-t transition-opacity hover:opacity-70"
                style={{
                  height: `${Math.max(3, (d.views / maxViews) * 100)}%`,
                  background: "var(--accent)",
                  opacity: 0.75,
                }}
                title={`${d.date} : ${d.views} vues, ${d.clicks} clics`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-zinc-500">
            <span>{days[0]?.date}</span>
            <span>{days[days.length - 1]?.date}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className={cardClass}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Liens les plus cliqués
          </p>
          {topLinks.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400 dark:text-zinc-500">
              Pas encore de clics. Partage ta page pour voir les premiers
              résultats.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {topLinks.map((l) => {
                const pct = Math.max(3, (l.count / topLinks[0].count) * 100);
                return (
                  <div key={l.id}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-gray-700 dark:text-zinc-200">{l.label}</span>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-500 dark:text-zinc-400">{l.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-zinc-900 transition-all dark:bg-white"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Parrainage */}
        {user.referralCode && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardClass} mt-4`}
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Parrainage</p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
              Partage ton lien de parrainage. Chaque inscription via ton lien compte pour toi.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-mono text-gray-700 dark:bg-zinc-800 dark:text-zinc-200">
                movalink.vercel.app/signup?ref={user.referralCode}
              </code>
              <button
                type="button"
                className={smallBtnClass}
                onClick={() => navigator.clipboard?.writeText(`https://movalink.vercel.app/signup?ref=${user.referralCode}`).catch(() => {})}
              >
                Copier
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
              {user.referralCount ?? 0} {(user.referralCount ?? 0) > 1 ? "personnes parrainées" : "personne parrainée"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
