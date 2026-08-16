import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import ClaimForm from "@/components/ClaimForm";
import ProfilePreview from "@/components/ProfilePreview";
import StyleGallery from "@/components/StyleGallery";
import { FREE_LAUNCH, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Ta page gaming, un seul lien`,
  description:
    "Réunis tes liens, tes réseaux, tes jeux et tes stats sur une page à ton image, avec 56 effets animés. Gratuit, prêt en deux minutes, sans carte bancaire.",
  alternates: { canonical: "/" },
};

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
    title: "Tes questions fréquentes",
    text: "Ta config, tes réglages, tes partenariats : réponds une bonne fois sur ta page, au lieu de retaper la même chose en message privé.",
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

// Les objections qui reviennent avant l'inscription. Réponses alignées sur la
// page FAQ complète, à laquelle la section renvoie.
const FAQ = [
  {
    q: "C'est vraiment gratuit ?",
    a: "Oui. Pendant le lancement, chaque compte débloque toutes les fonctionnalités sans payer et sans carte bancaire. Ensuite, le plan Gratuit restera complet et sans limite de durée.",
  },
  {
    q: "Je peux changer de pseudo plus tard ?",
    a: "Oui, depuis ton compte. Ton profil, tes statistiques et ton classement suivent automatiquement, et ta nouvelle adresse est active aussitôt.",
  },
  {
    q: "Quels réseaux sont reconnus ?",
    a: "Une vingtaine : TikTok, Twitch, YouTube, Discord, Instagram, X, Snapchat, Telegram, Reddit, WhatsApp, Threads, Facebook, Pinterest, LinkedIn, Spotify, SoundCloud, Patreon, GitHub, Steam, Kick et Skool. Tu entres ton pseudo, le lien se construit tout seul.",
  },
  {
    q: "Mes statistiques sont-elles privées ?",
    a: "Oui. Toi seul vois les statistiques de ta page, et nous ne comptons que des totaux anonymes — aucune donnée personnelle sur tes visiteurs, aucun traceur publicitaire.",
  },
  {
    q: "Je peux l'installer comme une application ?",
    a: "Oui. Sur Chrome (ordinateur ou Android), un bouton « Installer l'application » apparaît. Sur iPhone : Partager, puis « Sur l'écran d'accueil ».",
  },
];

// Huit aperçus animés, recréés en CSS (classes .lp-fx-* dans globals.css).
const EFFECT_TILES = [
  { label: "Aurore", fx: "lp-fx-aurora" },
  { label: "Matrix", fx: "lp-fx-matrix" },
  { label: "Neige", fx: "lp-fx-snow" },
  { label: "Feux d'artifice", fx: "lp-fx-fireworks" },
  { label: "Synthwave", fx: "lp-fx-synthwave" },
  { label: "Tubes néon", fx: "lp-fx-neon" },
  { label: "Étoiles", fx: "lp-fx-stars" },
  { label: "Pluie", fx: "lp-fx-rain" },
];

const EFFECTS = [
  "Neige", "Matrix", "Feux d'artifice", "Hyperespace", "Aurore", "Papillons",
  "Éclairs", "Synthwave", "Lanternes", "Poussière d'or", "Méduses", "Vortex",
  "Nébuleuse", "Braises", "Tubes néon", "Sakura",
];

// Données structurées. La FAQ balisée est générée depuis le tableau affiché
// juste au-dessus : Google exige que le balisage corresponde au contenu
// visible, et deux listes séparées finiraient par diverger.
// Aucune note ni avis n'est déclaré : il n'y en a pas, et en inventer serait
// à la fois une faute de référencement et une pratique commerciale trompeuse.
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "fr-FR",
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description:
          "Page de profil pour créateurs gaming : liens, réseaux, jeux, statistiques et effets animés, réunis derrière une seule adresse.",
        ...(FREE_LAUNCH
          ? {
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export default function HomePage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
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
              <span className="text-gray-500 dark:text-zinc-400">
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

            <p className="mt-3 text-xs text-gray-500 dark:text-zinc-400">
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
                {/* indigo-600 fixe : var(--accent) vaut indigo-400 en thème
                    sombre, où le texte blanc tombait à 2,98 de contraste. */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
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
                <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                  Une page de liens classique
                </p>
              </div>
              <div
                className="px-6 py-4"
                style={{ background: "var(--accent-muted)" }}
              >
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
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
                    className="mt-0.5 shrink-0 text-gray-300 dark:text-zinc-400"
                  >
                    ✕
                  </span>
                  <span className="text-sm text-gray-500 dark:text-zinc-400">
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
          {/* Aperçus animés plutôt qu'une liste de noms : l'argument est
              visuel, autant le montrer. Recréés en CSS — la page d'accueil
              n'embarque pas le moteur d'effets. */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EFFECT_TILES.map((t) => (
              <div
                key={t.label}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-black/5 dark:ring-white/10"
              >
                <div className={`lp-fx ${t.fx}`} aria-hidden />
                <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          {/* Trois pages entières, pour montrer que l'effet n'est qu'un
              réglage parmi d'autres — et que deux pages peuvent n'avoir
              visuellement rien en commun. */}
          <div className="mt-14">
            <h3 className="text-lg font-semibold">
              Le même produit, trois pages différentes
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Effet, couleurs, style de boutons, cadre d&apos;avatar, bande LED :
              chaque réglage se change en un clic, et l&apos;aperçu suit en direct.
            </p>
            <div className="mt-6">
              <StyleGallery />
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-2">
            {EFFECTS.map((e) => (
              <span
                key={e}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 dark:border-zinc-800 dark:text-zinc-300"
              >
                {e}
              </span>
            ))}
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              +40 autres
            </span>
          </div>
        </div>
      </section>

      {/* ─── Questions fréquentes ─────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle kicker="Avant de te lancer" title="Les questions qu'on nous pose" />
          {/* <details> natif : accessible au clavier et sans JavaScript. */}
          <div className="mt-10 divide-y divide-gray-100 border-y border-gray-100 dark:divide-zinc-900 dark:border-zinc-900">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:content-['']">
                  {f.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-xl leading-none text-gray-300 transition-transform group-open:rotate-45 dark:text-zinc-400"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-zinc-400">
            D&apos;autres questions ?{" "}
            <Link
              href="/faq"
              className="font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
            >
              Voir la FAQ complète
            </Link>
          </p>
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
          <p className="mt-6 text-sm text-gray-500 dark:text-zinc-400">
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
      {/* indigo-600/400 plutôt que var(--accent) : l'indigo-500 tombait à
          4,47 sur blanc, juste sous le seuil AA de 4,5. */}
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
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
