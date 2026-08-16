import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import ContactEmail from "@/components/ContactEmail";
import { FREE_LAUNCH, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les réponses aux questions les plus fréquentes sur Movalink.",
  alternates: { canonical: "/faq" },
};

// Questions regroupées par thème : la liste à plat obligeait à tout parcourir
// pour trouver la seule question qu'on se pose.
const SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Prix et comptes",
    items: [
      {
        q: "C'est vraiment gratuit ?",
        a: "Oui. Le plan Gratuit est sans limite de durée : adresse personnalisée, liens, réseaux, bibliothèque de jeux, effets de base et statistiques sur 7 jours. Aucune carte bancaire n'est demandée pour commencer.",
      },
      {
        q: "Combien ça coûte pour débloquer plus ?",
        a:
          (FREE_LAUNCH
            ? "Rien pour l'instant : c'est le lancement, tout est offert. Chaque compte débloque gratuitement toutes les fonctionnalités Elite, sans carte bancaire. Voici les tarifs qui s'appliqueront plus tard. "
            : "") +
          "Deux abonnements, résiliables à tout moment : Pro à 4,90 €/mois (15 liens, personnalisation complète, 10 effets, sans badge) et Elite à 9,90 €/mois (50 liens, les 56 effets animés, statut Discord en direct, statistiques sur 1 an). Tu préfères ne payer qu'une fois ? L'offre à vie à 54,90 € débloque tout l'Elite pour toujours, sans abonnement.",
      },
      {
        q: FREE_LAUNCH
          ? "Que se passe-t-il à la fin du lancement ?"
          : "Je peux annuler mon abonnement ?",
        a: FREE_LAUNCH
          ? "Ta page, ton pseudo, tes liens et tes statistiques restent en place. Les fonctionnalités Elite ouvertes pendant le lancement repassent sur le plan Gratuit, utilisable sans limite de durée — et tu pourras t'abonner si tu veux les garder. Les paiements ne sont pas encore ouverts."
          : "Oui, en un clic depuis ton compte : le portail de facturation Stripe te permet de résilier ou de changer de carte quand tu veux. Tu gardes l'accès jusqu'à la fin de la période déjà payée. L'offre à vie, elle, ne s'annule jamais : c'est acquis pour toujours.",
      },
      {
        q: "Je peux changer de pseudo ?",
        a: "Oui, directement depuis ton compte : Compte → Changer de pseudo. Ton profil, tes statistiques et ton classement suivent automatiquement, et ta nouvelle adresse est active aussitôt.",
      },
    ],
  },
  {
    title: "Ta page",
    items: [
      {
        q: "Quels réseaux sont reconnus ?",
        a: "Une vingtaine : Discord, Twitch, YouTube, X, TikTok, Instagram, Snapchat, Telegram, Reddit, WhatsApp, Threads, Facebook, Pinterest, LinkedIn, Spotify, SoundCloud, Patreon, GitHub, Steam, Kick et Skool — plus autant de liens personnalisés que ton plan le permet, vers n'importe quel site. Tu entres ton pseudo, le lien se construit tout seul.",
      },
      {
        q: "Comment marche le badge « en direct » ?",
        a: "Tu l'actives d'un clic depuis ton tableau de bord quand tu lances ton live, en collant le lien de ton stream — TikTok, Kick, Twitch, n'importe quelle plateforme. Un bandeau apparaît alors sur ta page et mène droit au direct. Tu le désactives quand tu as fini.",
      },
      {
        q: "Je peux masquer ma page le temps de la préparer ?",
        a: "Oui : tu peux la protéger par un mot de passe depuis les réglages avancés. Tu peux aussi enregistrer plusieurs versions de ta page et programmer celle qui doit passer en ligne à la date de ton choix.",
      },
      {
        q: "Les effets ralentissent-ils ma page ?",
        a: "Les animations se mettent en pause dès que l'onglet passe en arrière-plan, et ne consomment donc rien quand ta page n'est pas regardée. Et si le visiteur a réglé son système sur « animations réduites », elles ne se lancent pas du tout : il voit ta page avec ses couleurs et sa mise en page, simplement sans animation.",
      },
    ],
  },
  {
    title: "Données et sécurité",
    items: [
      {
        q: "Mes statistiques sont-elles privées ?",
        a: "Oui. Toi seul vois les statistiques de ta page. Nous ne comptons que des totaux anonymes (vues et clics), sans collecter de données personnelles sur tes visiteurs et sans traceur publicitaire.",
      },
      {
        q: "Je peux récupérer ou supprimer mes données ?",
        a: "Oui. Depuis ton compte, tu exportes l'intégralité de tes données en un clic, et tu peux supprimer ton compte définitivement quand tu veux.",
      },
      {
        q: "Comment signaler un profil qui pose problème ?",
        a: "Chaque page publique contient un lien de signalement, et une page dédiée est accessible depuis le pied de page. Les signalements sont traités rapidement, conformément à nos CGU.",
      },
    ],
  },
  {
    title: "Installation",
    items: [
      {
        q: "Je peux installer Movalink comme une appli ?",
        a: "Oui. Sur Chrome (ordinateur ou Android), un bouton « Installer l'application » apparaît sur le site : Movalink s'installe alors comme une vraie appli, avec son icône et sa propre fenêtre. Sur iPhone : Partager, puis « Sur l'écran d'accueil ».",
      },
    ],
  },
];

const ALL = SECTIONS.flatMap((s) => s.items);

// Balisage généré depuis la liste affichée : Google exige que les données
// structurées correspondent au contenu visible, et deux listes séparées
// finiraient par diverger.
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    mainEntity: ALL.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function FaqPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[340px] opacity-[0.16] dark:opacity-25"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, var(--accent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Questions fréquentes
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Tout ce qu&apos;il faut savoir
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500 dark:text-zinc-400">
            Les réponses aux questions qu&apos;on nous pose avant de créer une
            page.
          </p>
        </div>
      </section>

      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6 lg:pb-24">
          <div className="flex flex-col gap-12">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {s.title}
                </h2>
                {/* <details> natif : accessible au clavier et sans JavaScript. */}
                <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100 dark:divide-zinc-900 dark:border-zinc-900">
                  {s.items.map((item) => (
                    <details key={item.q} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:content-['']">
                        {item.q}
                        <span
                          aria-hidden
                          className="shrink-0 text-xl leading-none text-gray-300 transition-transform group-open:rotate-45 dark:text-zinc-400"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 pr-8 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50/60 p-7 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-base font-semibold">Ta question n&apos;y est pas ?</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Écris-nous à{" "}
              <ContactEmail className="inline font-medium text-gray-900 underline decoration-dotted underline-offset-2 dark:text-white" />
              , on répond.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              Créer ma page gratuitement
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
