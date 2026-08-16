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
  // Noir et blanc électrique : accent blanc pur, boutons néon sur fond noir.
  //
  // Effet Éclairs, dont la cadence a été revue dans Effects.tsx : la foudre
  // n'était visible que 5,8 % du temps, invisible sur une vignette qu'on
  // regarde trois secondes.
  //
  // Deux pièges écartés en cours de route :
  //   — le style « Relief 3D » remplit le bouton avec la couleur d'accent :
  //     avec un accent blanc, le libellé devient blanc sur blanc, illisible ;
  //   — la LED « Clignotant » éteint les boutons une image sur deux.
  theme: {
    accent: "#ffffff",
    effect: "lightning",
    layout: "card",
    font: "classic",
    buttonStyle: "neon",
    avatarFrame: "double",
    cursor: "default",
    nameEffect: "glow",
    tilt3d: true,
    ledMode: "comet",
    ledColor: "#ffffff",
    ledSpeed: 22,
    ledPower: 85,
    bgType: "solid",
    bgColor: "#000000",
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
            "radial-gradient(circle at 50% 35%, #94a3b8, transparent 68%)",
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
        Page de démonstration, rendue par Movalink — effet Éclairs, boutons
        néon, bande LED.
      </p>
    </div>
  );
}
