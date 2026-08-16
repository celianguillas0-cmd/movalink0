"use client";

import ProfileView from "./ProfileView";
import { Profile, Theme } from "@/lib/types";

// Trois pages de démonstration, rendues par le composant réel du site.
//
// La page d'accueil promet « une page qui te ressemble » et 56 effets, mais ne
// montrait qu'un seul exemple : l'affirmation restait à croire sur parole. Voir
// trois pages qui n'ont visiblement rien en commun la démontre en une image.
//
// Les trois effets retenus — Synthwave, Nébuleuse, Aurore — sont ceux que le
// moteur rend en CSS. Un effet sur canevas aurait ajouté trois animations
// permanentes à une page qui en fait déjà tourner une dans le hero.

const shared: Omit<Profile, "theme"> = {
  username: "movalink",
  displayName: "Movalink",
  bio: "Trois réglages, trois pages qui n'ont rien à voir.",
  avatarUrl: "",
  backgroundUrl: "",
  links: [
    { id: "l1", label: "Ma chaîne", url: "https://movalink.vercel.app", icon: "🎬" },
    { id: "l2", label: "Mon Discord", url: "https://movalink.vercel.app", icon: "💬" },
  ],
  socials: { tiktok: "movalink", twitch: "movalink", youtube: "@movalink" },
  games: [],
  decorations: [],
  showViewCount: false,
  updatedAt: "",
};

const STYLES: { name: string; recipe: string; theme: Theme }[] = [
  {
    name: "Synthwave",
    recipe: "Boutons néon · cadre dégradé · pseudo en halo",
    theme: {
      accent: "#f472b6", effect: "synthwave", layout: "card",
      buttonStyle: "neon", avatarFrame: "gradientRing", nameEffect: "glow",
      ledMode: "comet", ledColor: "#f472b6", ledSpeed: 25, ledPower: 70,
      bgType: "gradient", bgColor: "#2e1065", bgColor2: "#0f172a", bgAngle: 160,
    },
  },
  {
    name: "Nébuleuse",
    recipe: "Boutons verre · cadre animé · pseudo en dégradé",
    theme: {
      accent: "#a78bfa", effect: "nebula", layout: "card",
      buttonStyle: "glass", avatarFrame: "animated", nameEffect: "gradient",
      ledMode: "off",
      bgType: "gradient", bgColor: "#1e1b4b", bgColor2: "#020617", bgAngle: 145,
    },
  },
  {
    name: "Aurore",
    recipe: "Boutons pilule · cadre halo · sans LED",
    theme: {
      accent: "#22d3ee", effect: "aurora", layout: "card",
      buttonStyle: "pill", avatarFrame: "glow", nameEffect: "none",
      ledMode: "off",
      bgType: "gradient", bgColor: "#042f2e", bgColor2: "#020617", bgAngle: 150,
    },
  },
];

// La page est rendue à taille réelle puis réduite : c'est la vraie mise en
// page, pas une version « mobile » du composant.
const ZOOM = 0.52;
const CARD_H = 360;

export default function StyleGallery() {
  return (
    // Défilement horizontal sous sm : trois cartes empilées allongeraient la
    // page inutilement sur mobile.
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
      {STYLES.map((s) => (
        <figure key={s.name} className="w-[230px] shrink-0 snap-start sm:w-auto">
          <div
            className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg dark:border-zinc-800"
            style={{ height: CARD_H }}
          >
            {/* Hauteur en pixels et non en %, car une hauteur en pourcentage ne
                traverse pas la frontière du zoom : elle retombe sur la hauteur
                du contenu et laisse un vide blanc sous les boutons. */}
            <div style={{ zoom: ZOOM, height: CARD_H / ZOOM }}>
              <ProfileView
                profile={{ ...shared, theme: s.theme }}
                branding={false}
                watermark={false}
                interactive={false}
              />
            </div>
          </div>
          <figcaption className="mt-3">
            <p className="text-sm font-semibold">{s.name}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
              {s.recipe}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
