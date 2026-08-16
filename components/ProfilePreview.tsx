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
  theme: {
    accent: "#6366f1",
    effect: "aurora",
    layout: "card",
    font: "classic",
    buttonStyle: "glass",
    avatarFrame: "animated",
    cursor: "default",
    nameEffect: "gradient",
    tilt3d: true,
    ledMode: "chase",
    ledColor: "#22d3ee",
    ledSpeed: 30,
    ledPower: 60,
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
            "radial-gradient(circle at 50% 35%, var(--accent), transparent 68%)",
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
        Page de démonstration, rendue par Movalink — effet Aurore, bande LED,
        boutons 3D.
      </p>
    </div>
  );
}
