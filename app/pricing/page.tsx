import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import BuyButton from "@/components/BuyButton";
import { FREE_LAUNCH } from "@/lib/config";
import { LIFETIME_PRICE, MONTHLY_PRICES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Movalink est gratuit pour toujours. Passe Pro (4,90 €/mois) ou Elite (9,90 €/mois), ou débloque tout à vie en un seul paiement.",
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
    price: MONTHLY_PRICES.pro.label,
    priceNote: "/mois",
    tagline: "Pour te démarquer",
    popular: true,
    features: [
      "Tout le plan Gratuit",
      "15 liens · 15 jeux",
      "6 effets + 13 polices (pseudo à part)",
      "Full custom : couleurs, dégradé, carte, avatar",
      "Animation d'entrée personnalisée",
      "Couleur par bouton + curseur importé",
      "Logo/pseudo en filigrane déplaçable",
      "Sans badge · Stats 30 jours",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: MONTHLY_PRICES.elite.label,
    priceNote: "/mois",
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

// Les objections propres au paiement, qui n'ont pas leur place sur la FAQ
// générale. Chaque réponse décrit le comportement réel du produit : à la fin
// du lancement, `resolvePlan` cesse de renvoyer « elite » et chaque compte
// retrouve son plan enregistré — dire que les comptes créés aujourd'hui
// gardent Elite serait faux.
const PRICING_FAQ = [
  {
    q: "Je dois donner une carte bancaire ?",
    a: "Non. Pendant le lancement, aucun moyen de paiement n'est demandé : tu crées ton compte et tout est débloqué immédiatement.",
  },
  {
    q: "Que se passe-t-il à la fin du lancement ?",
    a: "Ta page, ton pseudo, tes liens et tes statistiques restent en place. Les fonctionnalités Elite ouvertes pendant le lancement repassent sur le plan Gratuit, utilisable sans limite de durée — et tu pourras passer Pro ou Elite si tu veux les garder.",
  },
  {
    q: "Le plan Gratuit a-t-il une date de fin ?",
    a: "Non. Il n'a aucune durée limitée et ne demande jamais de carte bancaire.",
  },
  {
    q: "Comment fonctionnera le paiement ?",
    a: "Les abonnements ne sont pas encore ouverts. Ils arriveront après le lancement, en mensuel sans engagement et résiliable à tout moment, avec une option à vie en un seul paiement.",
  },
  {
    q: "Mes données restent-elles les miennes ?",
    a: "Oui. Tu peux exporter l'intégralité de ton compte en un clic depuis tes réglages, et le supprimer définitivement quand tu veux.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px] opacity-[0.16] dark:opacity-25"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, var(--accent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Tarifs
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {FREE_LAUNCH ? "Tout est gratuit, tout de suite" : "Un prix simple, sans surprise"}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-zinc-400">
            {FREE_LAUNCH
              ? "C'est le lancement de Movalink : chaque compte débloque le plan Elite gratuitement, sans carte bancaire. Les tarifs ci-dessous s'appliqueront plus tard."
              : `Abonnement mensuel résiliable à tout moment, ou ${LIFETIME_PRICE.label} à vie pour tout débloquer sans renouvellement.`}
          </p>
        </div>
      </section>

      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-2xl border bg-white p-7 dark:bg-zinc-900/40 ${
                  plan.popular
                    ? "border-zinc-900 shadow-lg dark:border-indigo-500/40 dark:shadow-[0_0_0_1px_rgba(99,102,241,0.25),0_8px_40px_rgba(99,102,241,0.14)]"
                    : "border-gray-100 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold">{plan.name}</p>
                  {plan.popular && (
                    // Teintes fixes plutôt que var(--accent) : en thème sombre
                    // l'accent vaut indigo-400, sur lequel le texte blanc
                    // tombait à 2,98 de contraste. L'encre s'inverse avec le
                    // fond pour rester au-dessus de 4,5 dans les deux thèmes.
                    <span className="shrink-0 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-semibold text-white dark:bg-indigo-400 dark:text-zinc-900">
                      Populaire
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                  {plan.tagline}
                </p>

                {/* Pendant le lancement, le prix affiché n'est pas celui qu'on
                    paie : le barrer évite de laisser croire à une facturation
                    immédiate, sans effacer le tarif à venir. Barré ne veut pas
                    dire illisible — c'est une information tarifaire, gray-400
                    la laissait à 2,61 de contraste sur blanc. */}
                <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                  {FREE_LAUNCH && plan.id !== "free" && (
                    <span className="text-lg font-medium text-gray-500 line-through dark:text-zinc-400">
                      {plan.price}
                    </span>
                  )}
                  <span className="text-3xl font-bold tracking-tight">
                    {FREE_LAUNCH ? "0 €" : plan.price}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-zinc-400">
                    {FREE_LAUNCH ? "pendant le lancement" : plan.priceNote}
                  </span>
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-gray-600 dark:text-zinc-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--accent)" }}
                      >
                        <Check />
                      </span>
                      <span className="min-w-0">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  {FREE_LAUNCH ? (
                    <Link
                      href="/signup"
                      className={plan.popular ? solidBtn : outlineBtn}
                    >
                      {plan.id === "free" ? "Commencer" : "Débloquer gratuitement"}
                    </Link>
                  ) : plan.id === "free" ? (
                    <Link href="/signup" className={outlineBtn}>
                      Commencer
                    </Link>
                  ) : (
                    <BuyButton
                      plan={plan.id}
                      billing="monthly"
                      requireConsent
                      className={plan.popular ? solidBtn : outlineBtn}
                    >
                      S&apos;abonner {plan.name}
                    </BuyButton>
                  )}
                </div>
              </div>
            ))}
          </div>

          {FREE_LAUNCH ? (
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-zinc-400">
              Aucun paiement pendant le lancement. Crée ta page et débloque tout
              gratuitement.
            </p>
          ) : (
            <>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Paiement sécurisé Stripe
                </span>
                <span aria-hidden>·</span>
                <span>Résiliable à tout moment · option à vie {LIFETIME_PRICE.label}</span>
                <span aria-hidden>·</span>
                <span>14 jours satisfait ou remboursé</span>
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-gray-500 dark:text-zinc-400">
                Droit de rétractation (art. L221-18 du Code de la consommation), sauf renonciation
                expresse pour accès immédiat. Détails dans nos{" "}
                <Link
                  href="/legal/cgu"
                  className="font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
                >
                  CGU / CGV
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </section>

      {/* ─── Questions propres au paiement ──────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Les questions sur les tarifs
          </h2>
          <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200 dark:divide-zinc-800 dark:border-zinc-800">
            {PRICING_FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:content-['']">
                  {f.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-xl leading-none text-gray-400 transition-transform group-open:rotate-45 dark:text-zinc-500"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              Créer ma page gratuitement
            </Link>
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
