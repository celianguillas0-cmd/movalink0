import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les réponses aux questions les plus fréquentes sur Movalink.",
};

const FAQ = [
  {
    q: "C'est vraiment gratuit ?",
    a: "Oui. Le plan gratuit est complet et sans limite de durée : URL personnalisée, liens, réseaux, bibliothèque de jeux, effets de base et statistiques sur 7 jours. Aucune carte bancaire n'est demandée.",
  },
  {
    q: "C'est quoi, un paiement « à vie » ?",
    a: "Les plans Pro et Elite sont des achats uniques : tu paies une seule fois et tu gardes les fonctionnalités pour toute la durée de vie du service. Pas d'abonnement, pas de facturation récurrente.",
  },
  {
    q: "Je peux installer Movalink comme une appli ?",
    a: "Oui. Sur Chrome (ordinateur ou Android), un bouton « Installer l'application » apparaît sur le site : Movalink s'installe alors comme une vraie appli, avec son icône et sa propre fenêtre. Sur iPhone : Partager puis « Sur l'écran d'accueil ».",
  },
  {
    q: "Je peux changer de pseudo ?",
    a: "Ton pseudo définit ton URL publique. Pour en changer, contacte le support : nous vérifions que le nouveau pseudo est libre avant de faire la bascule.",
  },
  {
    q: "Quels réseaux sont supportés ?",
    a: "Discord, Twitch, YouTube, X, TikTok, Instagram, GitHub, Steam et Kick, plus autant de liens personnalisés que ton plan le permet vers n'importe quel site.",
  },
  {
    q: "Mes statistiques sont-elles privées ?",
    a: "Oui. Seul toi peux voir les statistiques de ta page. Nous ne comptons que des totaux anonymes (vues et clics), sans collecter de données personnelles sur tes visiteurs.",
  },
  {
    q: "Comment signaler un profil qui pose problème ?",
    a: "Chaque page publique contient un lien de signalement, et une page dédiée est accessible depuis la navigation. Les signalements sont traités rapidement, conformément à nos CGU.",
  },
];

export default function FaqPage() {
  return (
    <PublicShell>
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-xl py-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Questions fréquentes
          </h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">
            Tout ce qu'il faut savoir avant de créer ta page.
          </p>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-gray-900 dark:text-white">
                    {item.q}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0 text-gray-400 transition-transform group-open:rotate-180 dark:text-zinc-500"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-zinc-500">
            Une autre question ?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-gray-600 hover:underline dark:text-zinc-300"
            >
              Écris-nous
            </a>{" "}
            ou{" "}
            <Link href="/" className="text-gray-600 hover:underline dark:text-zinc-300">
              lance-toi directement
            </Link>
            .
          </p>
        </div>
      </main>
    </PublicShell>
  );
}
