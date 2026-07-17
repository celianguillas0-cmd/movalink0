"use client";

import Link from "next/link";
import NavShell, {
  DASHBOARD_ITEMS,
  DASHBOARD_MOBILE,
  NavItem,
  UserCardFooter,
  navIcons,
  useMe,
} from "./NavShell";
import AppBanner from "./AppBanner";
import { SITE_NAME } from "@/lib/config";

// Menu identique au dashboard, même quand on n'est pas connecté.
// Les entrées d'appli (Ma page, Compte) renvoient vers la connexion/inscription.
const PUBLIC_ITEMS: NavItem[] = [
  { id: "accueil", label: "Accueil", href: "/", exact: true, icon: navIcons.home(18) },
  { id: "mapage", label: "Ma page", href: "/dashboard/mapage", exact: false, icon: navIcons.page(18) },
  { id: "premium", label: "Premium", href: "/pricing", exact: false, icon: navIcons.premium(18) },
  { id: "compte", label: "Compte", href: "/login", exact: false, icon: navIcons.account(18) },
];

const PUBLIC_MOBILE: NavItem[] = [
  { id: "accueil", label: "Accueil", href: "/", exact: true, icon: navIcons.home(20) },
  { id: "mapage", label: "Ma page", href: "/dashboard/mapage", exact: false, icon: navIcons.page(20) },
  { id: "creer", label: "Créer", href: "/signup", exact: false, center: true, icon: navIcons.plus },
  { id: "premium", label: "Premium", href: "/pricing", exact: false, icon: navIcons.premium(20) },
  { id: "compte", label: "Compte", href: "/login", exact: false, icon: navIcons.account(20) },
];

function PublicFooter() {
  return (
    <>
      <div className="mb-3 flex flex-col gap-2">
        <Link
          href="/signup"
          className="flex items-center justify-center rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
        >
          Créer mon profil
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          Connexion
        </Link>
      </div>
      <p style={{ textAlign: "center", fontSize: 10, color: "var(--nav-muted)", margin: 0, lineHeight: 1.8 }}>
        <Link href="/fonctionnalites" style={{ color: "inherit", textDecoration: "none" }}>Fonctionnalités</Link>
        {" · "}
        <Link href="/pricing" style={{ color: "inherit", textDecoration: "none" }}>Tarifs</Link>
        {" · "}
        <Link href="/faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</Link>
        <br />
        <Link href="/legal/cgu" style={{ color: "inherit", textDecoration: "none" }}>CGU</Link>
        {" · "}
        <Link href="/legal/confidentialite" style={{ color: "inherit", textDecoration: "none" }}>Confidentialité</Link>
        {" · "}
        <Link href="/legal/mentions-legales" style={{ color: "inherit", textDecoration: "none" }}>Mentions</Link>
        <br />
        <Link href="/report" style={{ color: "inherit", textDecoration: "none" }}>Signaler</Link>
        {" · "}
        <Link href="/status" style={{ color: "inherit", textDecoration: "none" }}>Statut</Link>
        {" · "}
        {`© ${new Date().getFullYear()} ${SITE_NAME}`}
      </p>
    </>
  );
}

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const me = useMe();
  const loggedIn = me.loggedIn === true;

  // Connecté : exactement le même menu que le dashboard, partout.
  // Déconnecté : menu marketing + boutons Créer/Connexion.
  return (
    <NavShell
      items={loggedIn ? DASHBOARD_ITEMS : PUBLIC_ITEMS}
      mobileItems={loggedIn ? DASHBOARD_MOBILE : PUBLIC_MOBILE}
      footer={loggedIn ? <UserCardFooter me={me} /> : <PublicFooter />}
      showAbout={loggedIn}
      aboutUsername={me.username}
      avatarUrl={me.avatarUrl}
    >
      <AppBanner />
      {children}
    </NavShell>
  );
}
