"use client";

import Link from "next/link";
import { LogoMark } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import { SITE_NAME } from "@/lib/config";

// Coquille de la page d'accueil : en-tête et pied de page classiques d'un site
// vitrine. Volontairement distincte de PublicShell, qui affiche la navigation
// de l'application (Ma page, Compte…) : un visiteur qui découvre Movalink n'a
// pas encore de compte, lui montrer une interface d'appli le désoriente et
// mange l'espace utile à la présentation du produit.

const NAV = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/explore", label: "Explorer" },
  { href: "/faq", label: "FAQ" },
];

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="text-base font-semibold tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block dark:text-zinc-300 dark:hover:text-white"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              Créer ma page
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-100 dark:border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <LogoMark className="h-6 w-6" />
                <span className="text-sm font-semibold">{SITE_NAME}</span>
              </div>
              <p className="mt-2 max-w-xs text-sm text-gray-400 dark:text-zinc-500">
                Tout ton univers gaming, réuni derrière un seul lien.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-sm sm:grid-cols-3">
              <FooterCol
                title="Produit"
                links={[
                  { href: "/fonctionnalites", label: "Fonctionnalités" },
                  { href: "/pricing", label: "Tarifs" },
                  { href: "/explore", label: "Explorer" },
                ]}
              />
              <FooterCol
                title="Aide"
                links={[
                  { href: "/faq", label: "FAQ" },
                  { href: "/status", label: "Statut" },
                  { href: "/report", label: "Signaler" },
                ]}
              />
              <FooterCol
                title="Légal"
                links={[
                  { href: "/legal/cgu", label: "CGU / CGV" },
                  { href: "/legal/confidentialite", label: "Confidentialité" },
                  { href: "/legal/mentions-legales", label: "Mentions légales" },
                ]}
              />
            </div>
          </div>
          <p className="mt-10 text-xs text-gray-400 dark:text-zinc-600">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-gray-500 transition-colors hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
