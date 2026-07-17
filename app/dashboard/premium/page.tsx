"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BuyButton from "@/components/BuyButton";
import RedeemCode from "@/components/RedeemCode";
import { fetchMe, getCachedMe } from "@/lib/me-client";
import {
  cardClass,
  pageSubtitleClass,
  pageTitleClass,
} from "@/lib/ui";
import {
  PLAN_PRICES,
  Plan,
  PublicUser,
  formatCents,
  upgradePriceCents,
} from "@/lib/types";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const solidBtn =
  "w-full rounded-lg bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 transition-opacity hover:opacity-90 disabled:opacity-50";
const outlineBtn =
  "w-full rounded-lg border border-gray-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-zinc-500 disabled:opacity-50";

const PLAN_FEATURES: Record<Exclude<Plan, "free">, string[]> = {
  pro: [
    "15 liens · 15 jeux · emoji par lien",
    "9 effets + 8 styles de boutons + 13 polices",
    "Full custom : fond, carte, bordure, avatar, couleurs",
    "Fond vidéo + animation d'entrée de la carte",
    "Musique de fond + curseur image importés",
    "Thèmes prêts à l'emploi Pro + filigranes superposés (×3)",
    "Sans badge Movalink · Stats 30 jours",
  ],
  elite: [
    "50 liens · 50 jeux",
    "21 effets dont pluie d'emoji au choix (orage, glitch, synthwave…)",
    "Statut Discord en direct sur ta page",
    "Thèmes exclusifs Elite · jusqu'à 5 décorations",
    "Filigrane movalink.vercel.app retiré",
    "Statistiques sur 1 an · Support prioritaire",
  ],
};

export default function PremiumPage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(
    getCachedMe()?.user ?? null
  );

  useEffect(() => {
    let alive = true;
    fetchMe().then(({ me, unauthorized }) => {
      if (!alive) return;
      if (unauthorized) {
        router.push("/login");
        return;
      }
      if (me) setUser(me.user);
    });
    return () => {
      alive = false;
    };
  }, [router]);

  const plan = user?.plan ?? "free";

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={pageTitleClass}>Premium</h1>
          <p className={pageSubtitleClass}>
            Paie une fois, garde tout à vie. Aucun abonnement.
          </p>
        </motion.div>

        {plan !== "free" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardClass} mb-4 border-zinc-900 dark:border-white`}
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Tu es sur le plan {plan === "elite" ? "Elite" : "Pro"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
              {plan === "elite"
                ? "Tu as déjà tout débloqué. Merci pour ton soutien."
                : "Passe Elite pour les effets exclusifs et les statistiques sur 1 an."}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          className={`${cardClass} mb-4`}
        >
          <RedeemCode />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className={`${cardClass} flex flex-col`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Pro
              </h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {PLAN_PRICES.pro.label}
                <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                  {" "}
                  une fois
                </span>
              </p>
            </div>
            <ul className="mt-4 flex flex-1 flex-col gap-2.5 text-sm text-gray-600 dark:text-zinc-300">
              {PLAN_FEATURES.pro.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              {plan === "free" ? (
                <BuyButton plan="pro" className={solidBtn}>
                  Passer Pro — {PLAN_PRICES.pro.label}
                </BuyButton>
              ) : (
                <p className="text-center text-xs text-gray-400 dark:text-zinc-500">
                  {plan === "pro" ? "Ton plan actuel" : "Inclus dans Elite"}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className={`${cardClass} flex flex-col`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Elite
              </h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan === "pro" ? (
                  <>
                    {formatCents(upgradePriceCents("pro", "elite"))}
                    <span className="ml-1.5 text-xs font-normal text-gray-400 line-through dark:text-zinc-500">
                      {PLAN_PRICES.elite.label}
                    </span>
                  </>
                ) : (
                  <>
                    {PLAN_PRICES.elite.label}
                    <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                      {" "}
                      une fois
                    </span>
                  </>
                )}
              </p>
            </div>
            {plan === "pro" && (
              <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Prix de mise à niveau : tu ne paies que la différence.
              </p>
            )}
            <ul className="mt-4 flex flex-1 flex-col gap-2.5 text-sm text-gray-600 dark:text-zinc-300">
              <li className="flex items-center gap-2.5">
                <Check /> Tout le plan Pro
              </li>
              {PLAN_FEATURES.elite.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              {plan !== "elite" ? (
                <BuyButton plan="elite" className={plan === "free" ? outlineBtn : solidBtn}>
                  {plan === "pro"
                    ? `Passer Elite — ${formatCents(upgradePriceCents("pro", "elite"))}`
                    : `Passer Elite — ${PLAN_PRICES.elite.label}`}
                </BuyButton>
              ) : (
                <p className="text-center text-xs text-gray-400 dark:text-zinc-500">
                  Ton plan actuel
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-zinc-500">
          Paiement sécurisé par Stripe. Droit de rétractation de 14 jours (art.
          L221-18 du Code de la consommation), sauf renonciation expresse pour
          accès immédiat. Détails dans les CGU/CGV.
        </p>
      </div>
    </div>
  );
}
