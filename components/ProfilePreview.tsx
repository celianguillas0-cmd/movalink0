"use client";

import ProfileView from "./ProfileView";
import { Profile } from "@/lib/types";

// Aperçu produit du hero.
//
// C'est le composant de rendu réel du site (ProfileView) qui dessine cette
// carte, alimenté par un profil de démonstration. Une imitation dessinée à la
// main donnerait une image que le produit ne sait pas reproduire — autrement
// dit une promesse fausse. Ici, tout ce qui est affiché est exactement ce que
// Movalink génère pour ces réglages.
//
// `interactive={false}` : pas de bouton de partage flottant, et surtout aucun
// enregistrement de vue ni de clic — l'accueil ne doit pas gonfler les
// statistiques d'un profil.
//
// Le profil de démonstration est Movalink lui-même : aucune donnée personnelle
// réelle n'a à figurer sur une page publique.

const DEMO: Profile = {
  username: "movalink",
  displayName: "Movalink",
  bio: "Tout ton univers gaming, réuni derrière un seul lien.",
  avatarUrl: "",
  backgroundUrl: "",
  links: [
    { id: "d1", label: "Voir les 56 effets", url: "https://movalink.vercel.app/fonctionnalites", icon: "✨" },
    { id: "d2", label: "Rejoindre le Discord", url: "https://movalink.vercel.app", icon: "💬" },
    { id: "d3", label: "Créer ma page", url: "https://movalink.vercel.app/signup", icon: "🚀" },
  ],
  socials: {
    tiktok: "movalink",
    twitch: "movalink",
    youtube: "@movalink",
    discord: "movalink",
  },
  games: [
    { id: "g1", game: "Valorant", pseudo: "Movalink#EUW" },
    { id: "g2", game: "Rocket League", pseudo: "movalink_rl" },
  ],
  // Réglages choisis après comparaison de quatre configurations rendues côte
  // à côte : l'effet Aurore et le fond noir uni ne se voyaient pas à cette
  // taille. Le violet/rose tranche aussi avec l'indigo de la page, donc la
  // carte se détache au lieu de s'y fondre.
  theme: {
    accent: "#f472b6",
    effect: "synthwave",
    layout: "card",
    font: "classic",
    buttonStyle: "neon",
    avatarFrame: "gradientRing",
    cursor: "default",
    nameEffect: "glow",
    tilt3d: true,
    ledMode: "comet",
    ledColor: "#f472b6",
    ledSpeed: 25,
    ledPower: 75,
    bgType: "gradient",
    bgColor: "#2e1065",
    bgColor2: "#0f172a",
    bgAngle: 160,
    cardIntro: "none",
  },
  decorations: [],
  showViewCount: true,
  updatedAt: "",
};

export default function ProfilePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* Halo extérieur : détache la carte du fond clair de la page. */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, #a855f7, transparent 68%)",
        }}
      />

      {/* Le rendu est réduit au zoom, comme l'aperçu du tableau de bord. */}
      <div className="relative h-[560px] overflow-hidden rounded-[26px] border border-white/10 shadow-2xl">
        <div style={{ zoom: 0.72 }}>
          <ProfileView
            profile={DEMO}
            branding={false}
            watermark={false}
            interactive={false}
            viewCount={12480}
          />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500 dark:text-zinc-400">
        Page de démonstration, rendue par Movalink — effet Synthwave, boutons
        néon, bande LED.
      </p>
    </div>
  );
}
