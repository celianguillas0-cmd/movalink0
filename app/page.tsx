import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import ClaimForm from "@/components/ClaimForm";
import ProfilePreview from "@/components/ProfilePreview";

const STEPS = [
  {
    n: "1",
    title: "Réserve ton pseudo",
    text: "movalink.vercel.app/tonpseudo est à toi. Aucune carte bancaire, aucune installation.",
  },
  {
    n: "2",
    title: "Compose ta page",
    text: "Liens, réseaux, jeux, clips, codes promo, planning de stream — tu ajoutes ce que tu veux, tu vois le résultat en direct.",
  },
  {
    n: "3",
    title: "Partage-le partout",
    text: "Un seul lien dans toutes tes bios. Tu changes le contenu quand tu veux, l'adresse ne bouge jamais.",
  },
];

const BLOCKS = [
  {
    title: "Tes liens, sans limite de plateforme",
    text: "Chaîne, Discord, boutique, dons… avec une couleur et une icône par bouton, et des liens qui expirent tout seuls si besoin.",
  },
  {
    title: "21 réseaux reconnus",
    text: "TikTok, Twitch, YouTube, Discord, Instagram, Steam, Kick… l'icône et le lien se mettent en place automatiquement.",
  },
  {
    title: "Ton statut en direct",
    text: "Badge « en direct » quand tu lances ton live, présence Discord, jeu Steam en cours, embed Twitch : ta page vit avec toi.",
  },
  {
    title: "Tes stats, sans espionner personne",
    text: "Vues et clics par lien, jour par jour. De quoi savoir ce qui marche — sans cookie publicitaire ni pistage.",
  },
  {
    title: "Tes jeux et tes pseudos",
    text: "La liste de tes jeux avec ton pseudo sur chacun, pour que ta commu te retrouve en jeu en un coup d'œil.",
  },
  {
    title: "Une page qui te ressemble",
    text: "Couleurs, dégradés, polices, cadre d'avatar, boutons 3D, bande LED, musique de fond, filigrane à ton logo.",
  },
];

// Comparaison volontairement faite avec la catégorie générique, sans citer
// aucun concurrent : la publicité comparative nominative (art. L122-1 et s. du
// Code de la consommation) exige des affirmations objectives et vérifiables sur
// des services équivalents, et expose à un contentieux dès qu'une ligne devient
// discutable. Chaque point de la colonne Movalink est une fonctionnalité
// réellement présente dans le produit.
// La colonne de gauche décrit ce qu'une page de liens *est* par nature, sans
// jamais affirmer de fait sur les pratiques d'un tiers (traceurs, revente de
// données, tarifs) : invérifiable et assimilable à du dénigrement, même sans
// citer de nom. Toute la charge de preuve reste sur la colonne de droite, qui
// n'énonce que des fonctionnalités réellement présentes dans Movalink.
const COMPARISON = [
  { generic: "Une liste de boutons", us: "56 effets animés, bande LED, boutons 3D, traînée de fumée" },
  { generic: "Un même modèle pour tous les métiers", us: "Faite pour le gaming : tes jeux, tes pseudos, tes clips" },
  { generic: "Une page figée, à mettre à jour à la main", us: "Statut en direct, présence Discord, jeu Steam, embed Twitch" },
  { generic: "Un compteur de clics, sans le détail", us: "Vues et clics par lien, jour par jour" },
  { generic: "Une politique de confidentialité à éplucher", us: "Un seul cookie technique, zéro traceur publicitaire" },
  { generic: "Récupérer ses données : pas toujours prévu", us: "Export complet de ton compte en un clic" },
];

const PILLARS = [
  {
    title: "On se souvient de ta page",
    text: "Un profil qui bouge, qui brille et qui réagit au curseur, ça se remarque et ça se partage. C'est toute la différence entre une page qu'on quitte et une page qu'on montre à ses potes.",
  },
  {
    title: "Pensée pour les créateurs gaming",
    text: "Tes jeux et tes pseudos, ton planning de stream, tes clips, ton statut Discord et Steam, tes codes promo de partenariat. Des blocs qui n'existent pas ailleurs parce qu'ils ne servent qu'à toi.",
  },
  {
    title: "Sans te pister, ni te retenir",
    text: "Un seul cookie technique pour te garder connecté, aucun traceur publicitaire, des statistiques anonymes, et l'export complet de tes données quand tu veux.",
  },
];

const EFFECTS = [
  "Neige", "Matrix", "Feux d'artifice", "Hyperespace", "Aurore", "Papillons",
  "Éclairs", "Synthwave", "Lanternes", "Poussière d'or", "Méduses", "Vortex",
  "Nébuleuse", "Braises", "Tubes néon", "Sakura",
];

export default function HomePage() {
  return (
    <MarketingShell>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Fond : une seule lueur diffuse. Remplace le motif hexagonal, qui
            passait derrière le texte et nuisait à la lisibilité. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.16] dark:opacity-25"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, var(--accent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-zinc-800 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
              Tout est gratuit pendant le lancement
            </span>

            {/* Coupure explicite : laissée libre, « lien. » se retrouvait
                seul sur une troisième ligne. */}
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Tout ton univers gaming.
              <br />
              <span className="text-gray-400 dark:text-zinc-500">
                Un seul lien.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-gray-500 lg:mx-0 dark:text-zinc-400">
              La page qui transforme tes visiteurs en communauté : tes liens, tes
              réseaux, tes jeux et tes stats — sublimés par 56 effets animés que
              personne d&apos;autre n&apos;a.
            </p>

            <div className="mx-auto mt-8 max-w-md lg:mx-0">
              <ClaimForm />
            </div>

            <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
              Prêt en deux minutes · Sans carte bancaire
            </p>
          </div>

          <div className="lg:pl-6">
            <ProfilePreview />
          </div>
        </div>
      </section>

      {/* ─── Comment ça marche ────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle
            kicker="Comment ça marche"
            title="Ta page en ligne en trois étapes"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {s.n}
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ce que la page contient ──────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle
            kicker="Ce que tu peux y mettre"
            title="Bien plus qu'une liste de liens"
          />
          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {BLOCKS.map((b) => (
              <div key={b.title}>
                <h3 className="text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pourquoi Movalink ────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle
            kicker="Pourquoi Movalink"
            title="Ta page mérite mieux qu'une liste de liens"
            text="Les outils de page de liens sont faits pour tout le monde : un restaurant, un photographe, un label. Movalink est fait pour toi."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {p.text}
                </p>
              </div>
            ))}
          </div>

          {/* Tableau comparatif : catégorie générique vs Movalink. */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-b border-gray-200 px-6 py-4 sm:border-b-0 sm:border-r dark:border-zinc-800">
                <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500">
                  Une page de liens classique
                </p>
              </div>
              <div
                className="px-6 py-4"
                style={{ background: "var(--accent-muted)" }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  Avec Movalink
                </p>
              </div>
            </div>

            {COMPARISON.map((row) => (
              <div
                key={row.us}
                className="grid grid-cols-1 border-t border-gray-200 sm:grid-cols-2 dark:border-zinc-800"
              >
                <div className="flex items-start gap-3 px-6 py-4 sm:border-r dark:border-zinc-800">
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-gray-300 dark:text-zinc-600"
                  >
                    ✕
                  </span>
                  <span className="text-sm text-gray-400 dark:text-zinc-500">
                    {row.generic}
                  </span>
                </div>
                <div className="flex items-start gap-3 border-t border-gray-200 px-6 py-4 sm:border-t-0 dark:border-zinc-800">
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    ✓
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {row.us}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Effets ───────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle
            kicker="Le détail qui change tout"
            title="56 effets animés"
            text="Des vraies animations en arrière-plan de ta page, pas un filtre posé sur une image. C'est ce qui fait qu'on se souvient de ton profil."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {EFFECTS.map((e) => (
              <span
                key={e}
                className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm text-gray-600 dark:border-zinc-800 dark:text-zinc-300"
              >
                {e}
              </span>
            ))}
            <span
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white"
              style={{ background: "var(--accent)" }}
            >
              +40 autres
            </span>
          </div>
        </div>
      </section>

      {/* ─── CTA final ────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Réserve ton pseudo avant qu&apos;il ne parte
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500 dark:text-zinc-400">
            Chaque pseudo est unique et attribué au premier arrivé. Tout est
            gratuit pendant le lancement.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <ClaimForm />
          </div>
          <p className="mt-6 text-sm text-gray-400 dark:text-zinc-500">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

function SectionTitle({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--accent)" }}
      >
        {kicker}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {text && (
        <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-zinc-400">
          {text}
        </p>
      )}
    </div>
  );
}
