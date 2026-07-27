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
  LIFETIME_PRICE,
  MONTHLY_PRICES,
  Plan,
  PublicUser,
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
    "10 effets + 8 styles de boutons + 13 polices",
    "Full custom : couleurs, dégradé, carte, bordure, avatar",
    "Animation d'entrée de la carte",
    "Musique de fond + curseur image importés",
    "Thèmes prêts à l'emploi Pro + filigranes superposés (×3)",
    "Sans badge Movalink · Stats 30 jours",
  ],
  elite: [
    "50 liens · 50 jeux",
    "39 effets animés très travaillés (feux d'artifice, hyperespace, éclairs, papillons, lanternes…)",
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
  const [discountCode, setDiscountCode] = useState("");
  const [waiver, setWaiver] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  const openBillingPortal = async () => {
    setPortalLoading(true);
    setPortalError("");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error ?? "Impossible d'ouvrir la gestion.");
      }
    } catch {
      setPortalError("Connexion impossible. Réessaie.");
    } finally {
      setPortalLoading(false);
    }
  };

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
            Abonne-toi au mois, ou débloque tout à vie en un seul paiement.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Sans engagement",
              "Résiliable en 1 clic",
              "14 jours satisfait ou remboursé",
              "Paiement sécurisé Stripe",
            ].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <span className="text-emerald-500">✓</span> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {plan !== "free" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardClass} mb-4 border-zinc-900 dark:border-white`}
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.lifetime
                ? "Accès à vie — plan Elite"
                : `Tu es sur le plan ${plan === "elite" ? "Elite" : "Pro"}`}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
              {user?.lifetime
                ? "Tu as tout débloqué pour toujours. Merci pour ton soutien."
                : user?.billing === "monthly"
                  ? `Abonnement mensuel ${
                      user.subscriptionStatus === "past_due"
                        ? "— paiement en attente"
                        : "actif"
                    }${
                      user.currentPeriodEnd
                        ? ` · prochaine échéance le ${new Date(
                            user.currentPeriodEnd
                          ).toLocaleDateString("fr-FR")}`
                        : ""
                    }`
                  : plan === "elite"
                    ? "Tu as déjà tout débloqué. Merci pour ton soutien."
                    : "Passe Elite pour les effets exclusifs et les stats sur 1 an."}
            </p>
            {user?.billing === "monthly" && user?.hasBillingAccount && (
              <>
                <button
                  type="button"
                  onClick={openBillingPortal}
                  disabled={portalLoading}
                  className="mt-3 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:border-gray-400 disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500"
                >
                  {portalLoading ? "Ouverture..." : "Gérer mon abonnement"}
                </button>
                {portalError && (
                  <p className="mt-2 text-xs text-red-500">{portalError}</p>
                )}
              </>
            )}
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

        {!user?.lifetime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className={`${cardClass} mb-4`}
          >
            <label
              htmlFor="discountCode"
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Code de réduction
            </label>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
              Applique une remise sur l&apos;offre à vie au moment du paiement.
            </p>
            <input
              id="discountCode"
              type="text"
              autoComplete="off"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="Ton code"
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm uppercase tracking-wide text-gray-900 placeholder:normal-case placeholder:tracking-normal dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </motion.div>
        )}

        {!user?.lifetime && (
          <>
            <label className="mb-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3.5 text-xs leading-relaxed text-gray-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={waiver}
                onChange={(e) => setWaiver(e.target.checked)}
                className="mt-0.5 shrink-0"
              />
              <span>
                Je demande l&apos;exécution immédiate du service et reconnais
                renoncer à mon droit de rétractation une fois les
                fonctionnalités payantes pleinement fournies (art. L221-28 1° du
                Code de la consommation).
              </span>
            </label>

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
                    {MONTHLY_PRICES.pro.label}
                    <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                      {" "}
                      /mois
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
                    <BuyButton plan="pro" billing="monthly" className={solidBtn} consent={waiver}>
                      S&apos;abonner Pro — {MONTHLY_PRICES.pro.label}/mois
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
                    {MONTHLY_PRICES.elite.label}
                    <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                      {" "}
                      /mois
                    </span>
                  </p>
                </div>
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
                    <BuyButton
                      plan="elite"
                      billing="monthly"
                      className={plan === "free" ? outlineBtn : solidBtn}
                      consent={waiver}
                    >
                      S&apos;abonner Elite — {MONTHLY_PRICES.elite.label}/mois
                    </BuyButton>
                  ) : (
                    <p className="text-center text-xs text-gray-400 dark:text-zinc-500">
                      Ton plan actuel
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-900 bg-white p-5 dark:border-white dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    À vie
                  </h2>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    Meilleure offre
                  </span>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {LIFETIME_PRICE.label}
                    <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                      {" "}
                      une fois
                    </span>
                  </p>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                  Tout le plan Elite, pour toujours. Rentabilisé en ~6 mois, puis
                  plus jamais de paiement — aucun abonnement, aucun
                  renouvellement.
                </p>
              </div>
              <div className="shrink-0 sm:w-56">
                <BuyButton
                  plan="elite"
                  billing="lifetime"
                  className={solidBtn}
                  discountCode={discountCode}
                  consent={waiver}
                >
                  Débloquer à vie — {LIFETIME_PRICE.label}
                </BuyButton>
              </div>
            </motion.div>
          </>
        )}

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-zinc-500">
          Paiement sécurisé par Stripe. Abonnement résiliable à tout moment.
          Droit de rétractation de 14 jours (art. L221-18 du Code de la
          consommation), sauf renonciation expresse pour accès immédiat. Détails
          dans les CGU/CGV.
        </p>
      </div>
    </div>
  );
}
