// Aperçu statique d'une page Movalink, affiché sur l'accueil.
//
// Volontairement autonome plutôt que branché sur ProfileView : la page
// d'accueil doit rester légère et rendue côté serveur, alors que ProfileView
// est un composant client qui embarque effets, LED et suivi de curseur. On
// reproduit donc l'apparence, pas la mécanique.

const LINKS = [
  { label: "Ma chaîne Twitch", icon: "🎬" },
  { label: "Discord de la commu", icon: "💬" },
  { label: "Mes setups & config", icon: "🖥️" },
];

const SOCIALS = ["TikTok", "Twitch", "YouTube", "Discord"];

export default function ProfilePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Halo coloré : donne de la profondeur sans motif chargé. */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, var(--accent), transparent 68%)",
        }}
      />

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 p-5 shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col items-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{
              background: "linear-gradient(140deg, var(--accent), #0ea5e9)",
            }}
          >
            AQ
          </div>
          <p className="mt-3 text-lg font-bold text-white">Aquox</p>
          <p className="text-xs text-white/60">@aquox</p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            En direct
          </span>

          <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
            Créateur gaming · FPS &amp; chill
            <br />
            Stream tous les soirs à 21 h
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {SOCIALS.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/70"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 flex w-full flex-col gap-2">
            {LINKS.map((l) => (
              <div
                key={l.label}
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium text-white"
                style={{
                  borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                }}
              >
                <span aria-hidden>{l.icon}</span>
                {l.label}
              </div>
            ))}
          </div>

          <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2">
            <span className="text-[10px] text-white/60">Vues cette semaine</span>
            <span className="text-xs font-bold text-white">12 480</span>
          </div>
        </div>
      </div>
    </div>
  );
}
