import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import {
  ChartIcon,
  GamepadIcon,
  LinkIcon,
  PaletteIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description:
    "Liens, réseaux, bibliothèque de jeux, 56 effets animés très travaillés et statistiques en direct : tout ce que ta page Movalink sait faire.",
};

const FEATURES = [
  {
    icon: LinkIcon,
    title: "Tous tes liens au même endroit",
    text: "Discord, Twitch, YouTube, TikTok, Steam et une vingtaine de réseaux — tu entres juste ton pseudo, le lien se construit tout seul. Une seule URL pour toutes tes bios.",
  },
  {
    icon: GamepadIcon,
    title: "Ta bibliothèque de jeux",
    text: "Tes jeux avec tes pseudos in-game, pour que ta communauté te retrouve et te rejoigne en deux secondes.",
  },
  {
    icon: PaletteIcon,
    title: "Une page qui claque, pas un simple lien",
    text: "56 effets animés très travaillés — feux d'artifice, hyperespace, éclairs, aurore, papillons — plus couleurs, dégradés, polices gaming et thèmes exclusifs. Une page que personne d'autre n'a.",
  },
  {
    icon: ChartIcon,
    title: "Des statistiques claires",
    text: "Vues, clics par lien, évolution jour par jour. Sache ce qui marche, visible par toi seul.",
  },
];

const STEPS = [
  { step: "1", text: "Réserve ton pseudo et crée ton compte gratuit, sans carte bancaire." },
  { step: "2", text: "Ajoute tes liens, réseaux et jeux, puis choisis ton thème." },
  { step: "3", text: "Colle ton lien Movalink dans toutes tes bios. C'est tout." },
];

export default function FonctionnalitesPage() {
  return (
    <PublicShell>
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-xl py-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Fonctionnalités
          </h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">
            Pas juste une liste de liens : une vraie page de joueur.
          </p>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden mb-6">
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-3.5 px-5 py-4">
                  <f.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-400 dark:text-zinc-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-zinc-400">
                      {f.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Comment ça marche
          </h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden mb-8">
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {STEPS.map((s) => (
                <div key={s.step} className="flex items-center gap-3.5 px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 text-xs font-bold text-gray-900 dark:border-zinc-700 dark:text-white">
                    {s.step}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/"
            className="block w-full rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            Réserver mon pseudo
          </Link>
        </div>
      </main>
    </PublicShell>
  );
}
