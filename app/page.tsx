import PublicShell from "@/components/PublicShell";
import ClaimForm from "@/components/ClaimForm";
import HexBackground from "@/components/HexBackground";
import InstallButton from "@/components/InstallButton";

const FEATURES = [
  {
    label: "Page gaming perso",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="13" rx="3" />
        <path d="M8 13h2m1-1v2M17 13h.01M15 15h.01" strokeLinecap="round" />
        <path d="M7 7V5a5 5 0 0110 0v2" />
      </svg>
    ),
  },
  {
    label: "Liens & réseaux",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.5 1.5M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.5-1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Stats en direct",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 20h18M5 20V13M9 20V9M13 20V5M17 20V11" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Effets & animations",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l2.4 6.2L21 9.3l-5 4.3 1.5 6.9L12 17l-5.5 3.5 1.5-6.9-5-4.3 6.6-1.1z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden lg:min-h-screen">
        <HexBackground />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-500 dark:border-zinc-700 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shrink-0" />
            Gratuit, sans carte bancaire
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            Tout ton univers gaming.
            <br />
            Un seul lien.
          </h1>
          <p className="mt-5 max-w-xl text-base text-gray-500 sm:text-lg dark:text-zinc-400">
            Crée ta page de profil personnalisée : liens, réseaux, jeux, effets
            animés et statistiques. Partage une seule URL, partout.
          </p>
          <div className="mt-8 w-full max-w-md">
            <ClaimForm />
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
            Deux minutes pour créer ta page. Gratuit pour toujours.
          </p>
          <div className="mt-4">
            <InstallButton />
          </div>

          <div className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2.5 rounded-xl border border-gray-100 bg-white/70 px-3 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                >
                  {f.icon}
                </div>
                <span className="text-center text-xs font-medium leading-snug text-gray-600 dark:text-zinc-300">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
