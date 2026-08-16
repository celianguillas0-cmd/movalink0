import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import StyleGallery from "@/components/StyleGallery";
import {
  ChartIcon,
  GamepadIcon,
  LinkIcon,
  PaletteIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description:
    "Liens, réseaux, bibliothèque de jeux, statut en direct, 56 effets animés et statistiques par lien : tout ce que ta page Movalink sait faire.",
  alternates: { canonical: "/fonctionnalites" },
};

// Les quatre piliers, repris de la page d'accueil pour que l'arrivée depuis
// celle-ci soit continue.
const PILLARS = [
  {
    icon: LinkIcon,
    title: "Tous tes liens au même endroit",
    text: "Discord, Twitch, YouTube, TikTok, Steam et une vingtaine de réseaux — tu entres ton pseudo, le lien se construit tout seul. Une seule adresse pour toutes tes bios.",
  },
  {
    icon: GamepadIcon,
    title: "Ta bibliothèque de jeux",
    text: "Tes jeux avec tes pseudos in-game, pour que ta communauté te retrouve et te rejoigne en deux secondes.",
  },
  {
    icon: PaletteIcon,
    title: "Une page qui claque",
    text: "56 effets animés, bande LED, boutons 3D, traînée de fumée, polices gaming. Une page que personne d'autre n'a.",
  },
  {
    icon: ChartIcon,
    title: "Des statistiques claires",
    text: "Vues, clics par lien, évolution jour par jour. Sache ce qui marche — et toi seul le vois.",
  },
];

// Inventaire détaillé. Chaque ligne correspond à un réglage réellement présent
// dans l'éditeur : cette page est la page de référence du produit, elle ne doit
// contenir aucune fonctionnalité annoncée mais absente.
const GROUPS: { title: string; items: { name: string; text: string }[] }[] = [
  {
    title: "Tes liens",
    items: [
      {
        name: "Boutons personnalisés",
        text: "Une couleur et une icône par bouton, pour que les liens importants sautent aux yeux.",
      },
      {
        name: "Groupes de liens",
        text: "Range tes boutons par thème — sponsors, réseaux, boutique — au lieu d'une longue colonne.",
      },
      {
        name: "Liens à date d'expiration",
        text: "Un lien de giveaway ou de précommande disparaît tout seul à la date que tu fixes.",
      },
      {
        name: "Bouton de soutien",
        text: "Ko-fi, PayPal, Tipeee : un bouton à part, mis en avant, pour ceux qui veulent te soutenir.",
      },
      {
        name: "Codes promo",
        text: "Tes codes de partenariat affichés proprement, copiables en un clic.",
      },
    ],
  },
  {
    title: "Ta communauté gaming",
    items: [
      {
        name: "21 réseaux reconnus",
        text: "TikTok, Twitch, YouTube, Discord, Instagram, X, Steam, Kick, Spotify, Patreon… icône et lien automatiques.",
      },
      {
        name: "Tes jeux et tes pseudos",
        text: "La liste de tes jeux avec ton identifiant sur chacun, pour qu'on te rejoigne en jeu.",
      },
      {
        name: "Tes clips",
        text: "Tes meilleurs moments intégrés directement sur ta page, pas seulement un lien vers ailleurs.",
      },
      {
        name: "Planning de stream",
        text: "Tes jours et tes horaires affichés, pour que ta commu sache quand te retrouver.",
      },
      {
        name: "Questions fréquentes",
        text: "Ta config, tes réglages, tes partenariats : réponds une bonne fois, au lieu de retaper la même chose en privé.",
      },
    ],
  },
  {
    title: "Ta page vit avec toi",
    items: [
      {
        name: "Badge « en direct »",
        text: "Tu l'actives d'un clic quand tu lances ton live — TikTok, Kick, n'importe quelle plateforme — et un bouton mène droit au stream.",
      },
      {
        name: "Statut Discord",
        text: "En ligne, occupé, en jeu : ta présence Discord s'affiche en direct sur ta page, si tu l'actives.",
      },
      {
        name: "Jeu Steam en cours",
        text: "Le jeu auquel tu joues apparaît tout seul sur ta page.",
      },
      {
        name: "Twitch et YouTube intégrés",
        text: "Ton stream ou ta dernière vidéo se lisent sans quitter ta page.",
      },
      {
        name: "Compte à rebours",
        text: "Sortie de vidéo, début de stream, lancement d'un projet : le décompte tourne sur ta page.",
      },
    ],
  },
  {
    title: "L'apparence",
    items: [
      {
        name: "56 effets animés",
        text: "Aurore, Matrix, Éclairs, Synthwave, Nébuleuse, feux d'artifice… de vraies animations, pas une image de fond.",
      },
      {
        name: "Couleurs et fonds",
        text: "Couleur unie, dégradé réglable au degré près, image ou vidéo de fond en boucle.",
      },
      {
        name: "Styles de boutons",
        text: "Néon, verre, pilule, relief 3D, contour — plus le cadre d'avatar et l'effet de pseudo.",
      },
      {
        name: "Bande LED",
        text: "Un liseré lumineux autour de ta carte, dont tu règles la couleur, la vitesse et l'intensité.",
      },
      {
        name: "Curseur et traînée",
        text: "Viseur, point néon, traînée de fumée à la couleur de ton choix — sur ordinateur comme sur mobile.",
      },
      {
        name: "Musique de fond",
        text: "Une piste qui se lance sur ta page, à l'écoute du visiteur.",
      },
    ],
  },
  {
    title: "Tes chiffres et ton compte",
    items: [
      {
        name: "Statistiques par lien",
        text: "Vues et clics, lien par lien, jour par jour. Visibles par toi seul.",
      },
      {
        name: "Aucun traceur publicitaire",
        text: "Un seul cookie technique pour te garder connecté. Des totaux anonymes, rien sur tes visiteurs.",
      },
      {
        name: "Versions de ta page",
        text: "Enregistre plusieurs versions et programme celle qui doit passer en ligne, à la date que tu veux.",
      },
      {
        name: "Page protégée",
        text: "Un mot de passe sur ta page quand tu la prépares, ou pour un contenu réservé.",
      },
      {
        name: "Installable en application",
        text: "Ta page et tes stats à un clic depuis l'écran d'accueil de ton téléphone.",
      },
      {
        name: "Export et suppression",
        text: "L'intégralité de ton compte exportable en un clic, et supprimable définitivement quand tu veux.",
      },
    ],
  },
];

const STEPS = [
  { step: "1", text: "Réserve ton pseudo et crée ton compte gratuit, sans carte bancaire." },
  { step: "2", text: "Ajoute tes liens, réseaux et jeux, puis choisis ton style." },
  { step: "3", text: "Colle ton lien Movalink dans toutes tes bios. C'est tout." },
];

export default function FonctionnalitesPage() {
  return (
    <MarketingShell>
      {/* ─── Titre ────────────────────────────────────────────────────────── */}
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
            Fonctionnalités
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Pas une liste de liens. Une vraie page de joueur.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-zinc-400">
            Tout ce que tu peux mettre sur ta page et tous les réglages qui la
            rendent unique, en détail.
          </p>
        </div>
      </section>

      {/* ─── Les quatre piliers ───────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {PILLARS.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                {/* IconProps n'accepte pas `style` : la couleur passe par un
                    conteneur, l'icône héritant de currentColor. */}
                <span
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--accent)" }}
                >
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold">{f.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trois pages réelles ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Le même produit, trois pages différentes
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-zinc-400">
            Chaque réglage ci-dessous se change en un clic, et l&apos;aperçu suit
            en direct pendant que tu composes.
          </p>
          <div className="mt-10">
            <StyleGallery />
          </div>
        </div>
      </section>

      {/* ─── Inventaire détaillé ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-14">
            {GROUPS.map((g) => (
              <div key={g.title} className="grid gap-8 lg:grid-cols-[210px_1fr]">
                <h2 className="text-xl font-bold tracking-tight">{g.title}</h2>
                <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                  {g.items.map((it) => (
                    <div key={it.name} className="min-w-0">
                      <h3 className="text-sm font-semibold">{it.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                        {it.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-14 text-sm text-gray-500 dark:text-zinc-400">
            Le détail de ce qui est inclus dans chaque plan est sur la{" "}
            <Link
              href="/pricing"
              className="font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
            >
              page des tarifs
            </Link>
            . Pendant le lancement, tout est débloqué.
          </p>
        </div>
      </section>

      {/* ─── Trois étapes + appel à l'action ──────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ta page en ligne en trois étapes
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((s) => (
              <div key={s.step}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {s.step}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              Réserver mon pseudo
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
