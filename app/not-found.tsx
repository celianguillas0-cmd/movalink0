import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import HexBackground from "@/components/HexBackground";

export default function NotFound() {
  return (
    <PublicShell>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        <HexBackground />
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-7xl font-bold text-gray-900 dark:text-white">404</p>
          <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Cette page n'existe pas
          </h1>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-zinc-400">
            Le profil que tu cherches n'existe pas ou a été supprimé. Et si ce
            pseudo était encore libre ?
          </p>
        </div>
        <Link
          href="/signup"
          className="relative z-10 mt-8 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
        >
          Réserver ce pseudo
        </Link>
      </main>
    </PublicShell>
  );
}
