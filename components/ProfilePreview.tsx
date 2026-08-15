// Aperçu d'une page Movalink, affiché dans le hero de l'accueil.
//
// Il montre volontairement une page *poussée à fond* — effet de fond animé,
// anneau d'avatar tournant, pseudo en dégradé mouvant, bande LED autour des
// boutons, jeux et statut Discord. Un aperçu sobre ressemblerait à n'importe
// quelle page de liens et ne dirait rien de ce que le produit sait faire :
// c'est cette image qui doit donner envie de créer sa page.
//
// Autonome plutôt que branché sur ProfileView : la page d'accueil reste rendue
// côté serveur et n'embarque ni le moteur d'effets, ni LedFrame, ni le suivi de
// curseur. On reproduit l'apparence, pas la mécanique.

const LINKS = [
  { label: "Ma chaîne Twitch", icon: "🎬" },
  { label: "Discord de la commu", icon: "💬" },
  { label: "Mes setups & config", icon: "🖥️" },
];

const SOCIALS = ["TikTok", "Twitch", "YouTube", "Discord"];

const GAMES = [
  { game: "Valorant", pseudo: "Aquox#EUW" },
  { game: "Rocket League", pseudo: "aquox_rl" },
];

export default function ProfilePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[310px]">
      {/* Halo extérieur : détache la carte du fond clair de la page. */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, var(--accent), transparent 68%)",
        }}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950 shadow-2xl">
        {/* Deux couches d'effet : nappes colorées + poussière qui monte. */}
        <div className="lp-veil" aria-hidden />
        <div className="lp-dust" aria-hidden />

        <div className="relative flex flex-col items-center px-5 py-6">
          {/* Avatar : anneau dégradé en rotation. */}
          <div className="lp-ring relative h-[76px] w-[76px] rounded-full">
            <div
              className="absolute inset-0 grid place-items-center rounded-full text-xl font-bold text-white"
              style={{
                background: "linear-gradient(140deg, var(--accent), #0ea5e9)",
                margin: 3,
              }}
            >
              AQ
            </div>
          </div>

          <p className="lp-name mt-3 text-xl font-bold">Aquox</p>
          <p className="text-xs text-white/60">@aquox</p>

          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              En direct
            </span>
            {/* Statut Discord : l'un des blocs qui n'existent pas ailleurs. */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Sur Valorant
            </span>
          </div>

          <p className="mt-3 text-center text-xs leading-relaxed text-white/70">
            Créateur gaming · FPS &amp; chill
            <br />
            Stream tous les soirs à 21 h
          </p>

          <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
            {SOCIALS.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/70"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Boutons cerclés d'une bande LED qui tourne. */}
          <div className="mt-4 flex w-full flex-col gap-2">
            {LINKS.map((l) => (
              <div key={l.label} className="lp-led">
                <div className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-white">
                  <span aria-hidden>{l.icon}</span>
                  {l.label}
                </div>
              </div>
            ))}
          </div>

          {/* Jeux et pseudos : propre au gaming, absent des outils génériques. */}
          <div className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-2.5">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/50">
              Mes jeux
            </p>
            <div className="flex flex-col gap-1">
              {GAMES.map((g) => (
                <div
                  key={g.game}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-white/85">{g.game}</span>
                  <span className="font-medium text-white/55">{g.pseudo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2">
            <span className="text-[10px] text-white/60">Vues cette semaine</span>
            <span className="text-xs font-bold text-white">12 480</span>
          </div>
        </div>
      </div>

      {/* Légende : sans elle, le lecteur peut croire à une décoration. */}
      <p className="mt-4 text-center text-xs text-gray-500 dark:text-zinc-400">
        Une vraie page Movalink — effet animé, bande LED, statut en direct.
      </p>
    </div>
  );
}
