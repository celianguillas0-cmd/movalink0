import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import BuyButton from "@/components/BuyButton";
import { PLAN_PRICES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Movalink est gratuit pour toujours. Les plans Pro et Elite sont des paiements uniques, sans abonnement.",
};

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
  "block w-full rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900";
const outlineBtn =
  "block w-full rounded-lg border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500";

const PLANS: {
  id: "free" | "pro" | "elite";
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  popular?: boolean;
  features: string[];
}[] = [
  {
    id: "free",
    name: "Gratuit",
    price: "0 €",
    priceNote: "pour toujours",
    tagline: "Pour lancer ta page",
    features: [
      "URL personnalisée",
      "5 liens · 5 jeux",
      "9 réseaux sociaux",
      "3 effets animés",
      "4 polices, 3 styles de boutons",
      "Statistiques sur 7 jours",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: PLAN_PRICES.pro.label,
    priceNote: "en une fois",
    tagline: "Pour te démarquer",
    popular: true,
    features: [
      "Tout le plan Gratuit",
      "15 liens · 15 jeux",
      "6 effets + 13 polices (pseudo à part)",
      "Full custom : fond, couleurs, carte, avatar",
      "Fond vidéo + animation d'entrée",
      "Couleur par bouton + curseur importé",
      "Logo/pseudo en filigrane déplaçable",
      "Image de fond · Sans badge · Stats 30 jours",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: PLAN_PRICES.elite.label,
    priceNote: "en une fois",
    tagline: "Pour tout débloquer",
    features: [
      "Tout le plan Pro",
      "50 liens · 50 jeux",
      "Tous les effets, dont pluie d'emoji au choix",
      "Statut Discord en direct sur ta page",
      "Filigrane movalink.vercel.app retiré",
      "Statistiques sur 1 an · Support prioritaire",
    ],
  },
];

export default function PricingPage() {
  return (
    <PublicShell>
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-3xl py-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Tarifs
          </h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">
            Paie une fois, garde tout à vie. Aucun abonnement.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-xl border bg-white p-5 dark:bg-zinc-900 ${
                  plan.popular
                    ? "border-zinc-900 shadow-lg dark:border-indigo-500/40 dark:shadow-[0_0_0_1px_rgba(99,102,241,0.25),0_8px_40px_rgba(99,102,241,0.14)]"
                    : "border-gray-100 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </p>
                  {plan.popular && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: "var(--accent)" }}>
                      Populaire
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
                  {plan.tagline}
                </p>
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                  <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                    {" "}
                    {plan.priceNote}
                  </span>
                </p>
                <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-gray-600 dark:text-zinc-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {plan.id === "free" ? (
                    <Link href="/signup" className={outlineBtn}>
                      Commencer
                    </Link>
                  ) : (
                    <BuyButton
                      plan={plan.id}
                      className={plan.popular ? solidBtn : outlineBtn}
                    >
                      Passer {plan.name}
                    </BuyButton>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Paiement sécurisé Stripe
            </span>
            <span aria-hidden>·</span>
            <span>Paiement unique, pas d'abonnement</span>
            <span aria-hidden>·</span>
            <span>14 jours satisfait ou remboursé</span>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-zinc-500">
            Droit de rétractation (art. L221-18 du Code de la consommation), sauf renonciation
            expresse pour accès immédiat. Détails dans nos{" "}
            <Link
              href="/legal/cgu"
              className="text-gray-600 hover:underline dark:text-zinc-300"
            >
              CGU / CGV
            </Link>
            .
          </p>
        </div>
      </main>
    </PublicShell>
  );
}
