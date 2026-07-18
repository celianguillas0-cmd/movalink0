"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Icons";
import { MoonIcon, SunIcon, useTheme } from "./ThemeToggle";
import { SITE_NAME } from "@/lib/config";
import { fetchMe, getCachedMe, MeData } from "@/lib/me-client";
import { Plan } from "@/lib/types";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  exact: boolean;
  center?: boolean;
  icon: React.ReactNode;
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Gratuit",
  pro: "Pro",
  elite: "Elite",
};

// Jeu d'icônes partagé par les deux menus.
export const navIcons = {
  home: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  page: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.5 1.5M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.5-1.5" />
    </svg>
  ),
  premium: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  account: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  explore: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  house: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 21v-6h5v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  features: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l2.1 5.4L20 9.3l-4.3 3.6L17 19l-5-3.2L7 19l1.3-6.1L4 9.3l5.9-.9z" strokeLinejoin="round" />
    </svg>
  ),
  pricing: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
  faq: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.5 2.5 0 014.8.9c0 1.6-2.3 2.1-2.3 3.6" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.5" fill="currentColor" />
    </svg>
  ),
  plus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};

export interface MovalinkMe {
  loggedIn: boolean | null;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  plan: Plan;
  isAdmin?: boolean;
}

function toMovalinkMe(d: MeData): MovalinkMe {
  return {
    loggedIn: true,
    name: d.profile?.displayName ?? d.user.username,
    username: d.user.username,
    avatarUrl: d.profile?.avatarUrl || null,
    plan: d.user.plan ?? "free",
    isAdmin: d.user.isAdmin ?? false,
  };
}

export function useMe(): MovalinkMe {
  const cached = getCachedMe();
  const [me, setMe] = useState<MovalinkMe>(
    cached
      ? toMovalinkMe(cached)
      : {
          loggedIn: null,
          name: null,
          username: null,
          avatarUrl: null,
          plan: "free",
        }
  );

  useEffect(() => {
    let alive = true;
    fetchMe().then(({ me: d }) => {
      if (!alive) return;
      if (d) setMe(toMovalinkMe(d));
      else setMe((m) => ({ ...m, loggedIn: false }));
    });
    return () => {
      alive = false;
    };
  }, []);

  return me;
}

const btnSquare: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid var(--nav-border)",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--nav-muted)",
};

export default function NavShell({
  items,
  mobileItems,
  footer,
  showAbout = false,
  aboutUsername,
  avatarUrl,
  children,
}: {
  items: NavItem[];
  mobileItems: NavItem[];
  footer: React.ReactNode;
  showAbout?: boolean;
  aboutUsername?: string | null;
  avatarUrl?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, toggleTheme] = useTheme();
  const [aboutOpen, setAboutOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <aside
        id="ml-sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 240,
          height: "100vh",
          background: "var(--nav-bg)",
          borderRight: "1px solid var(--nav-border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
          boxShadow: "var(--nav-shadow)",
        }}
      >
        <div
          style={{
            height: 56,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--nav-border)",
            flexShrink: 0,
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "var(--nav-btn-bg)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--nav-btn-text)",
              }}
            >
              <LogoMark className="h-3.5 w-3.5" />
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--nav-text)",
                letterSpacing: "-0.01em",
              }}
            >
              {SITE_NAME}
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {showAbout && (
              <button onClick={() => setAboutOpen(true)} aria-label="À propos de Movalink" style={btnSquare}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
            )}
            <button onClick={toggleTheme} aria-label="Changer le thème" style={btnSquare}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          {items.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  paddingLeft: active ? 7 : 10,
                  marginBottom: 2,
                  borderRadius: 10,
                  borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--nav-text)" : "var(--nav-muted)",
                  background: active ? "var(--nav-active-bg)" : "transparent",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid var(--nav-border)", flexShrink: 0 }}>
          {footer}
        </div>
      </aside>

      <nav
        id="ml-mobile-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "var(--nav-bg)",
          borderTop: "1px solid var(--nav-border)",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 4px",
          zIndex: 40,
        }}
      >
        <button
          onClick={toggleTheme}
          aria-label="Changer le thème"
          style={{
            position: "absolute",
            top: -36,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--nav-border)",
            background: "var(--nav-bg)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--nav-muted)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
        {mobileItems.map((item) => {
          const active = isActive(item.href.split("?")[0], item.exact) && !item.center;
          if (item.center) {
            return (
              <div
                key={item.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: "translateY(-18px)",
                }}
              >
                <Link
                  href={item.href}
                  style={{
                    width: 52,
                    height: 52,
                    background: "var(--nav-btn-bg)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--nav-btn-text)",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  {item.icon}
                </Link>
                <span style={{ fontSize: 9, color: "var(--nav-muted)", marginTop: 5, fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
            );
          }
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                height: "100%",
                paddingBottom: 6,
                textDecoration: "none",
                color: active ? "var(--nav-text)" : "var(--nav-muted)",
                fontSize: 9,
                fontWeight: 500,
                position: "relative",
              }}
            >
              {item.id === "compte" && avatarUrl ? (
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `1.5px solid ${active ? "var(--nav-text)" : "var(--nav-muted)"}`,
                    display: "block",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
              ) : (
                item.icon
              )}
              {item.label}
              {active && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 4,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--nav-bar)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {aboutOpen && (
        <div
          onClick={() => setAboutOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(28,28,30,0.78)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 28,
              padding: "28px 28px 24px",
              maxWidth: 380,
              width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setAboutOpen(false)}
              aria-label="Fermer"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.06)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                <LogoMark className="h-4.5 w-4.5" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.95)", margin: 0 }}>
                  {SITE_NAME}
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  Ta page de profil gaming
                </p>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "0 0 16px" }}>
              Movalink regroupe tes liens, réseaux, jeux et statistiques sur une
              seule page publique personnalisable. Partage ton lien
              movalink.vercel.app/{aboutUsername ?? "pseudo"} partout.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href="/legal/cgu"
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 12,
                  padding: "8px 0",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                CGU
              </Link>
              <Link
                href="/status"
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 12,
                  padding: "8px 0",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                État du service
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-[240px] pb-20 lg:pb-0 min-h-screen">{children}</div>
    </>
  );
}

// Carte utilisateur affichée en bas de sidebar quand on est connecté.
export function UserCardFooter({ me }: { me: MovalinkMe }) {
  const initials = me.name
    ? me.name.slice(0, 2).toUpperCase()
    : me.username?.slice(0, 2).toUpperCase() ?? "?";
  return (
    <>
      <Link
        href="/dashboard/compte"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 8px",
          marginBottom: 6,
          borderRadius: 10,
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--nav-btn-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {me.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--nav-btn-text)" }}>
              {initials}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--nav-text)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {me.name ?? "Mon compte"}
          </p>
          <p style={{ fontSize: 10, color: "var(--nav-muted)", margin: 0 }}>
            {PLAN_LABELS[me.plan]}
          </p>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--nav-muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
      <p style={{ textAlign: "center", fontSize: 10, color: "var(--nav-muted)", margin: 0 }}>
        {`© ${new Date().getFullYear()} ${SITE_NAME}`}
      </p>
    </>
  );
}

// Menus du dashboard, partagés (utilisés dès qu'on est connecté, partout).
export const DASHBOARD_ITEMS: NavItem[] = [
  { id: "accueil", label: "Accueil", href: "/dashboard", exact: true, icon: navIcons.home(18) },
  { id: "mapage", label: "Ma page", href: "/dashboard/mapage", exact: false, icon: navIcons.page(18) },
  { id: "premium", label: "Premium", href: "/dashboard/premium", exact: false, icon: navIcons.premium(18) },
  { id: "compte", label: "Compte", href: "/dashboard/compte", exact: false, icon: navIcons.account(18) },
];

export const DASHBOARD_MOBILE: NavItem[] = [
  { id: "accueil", label: "Accueil", href: "/dashboard", exact: true, icon: navIcons.home(20) },
  { id: "mapage", label: "Ma page", href: "/dashboard/mapage", exact: false, icon: navIcons.page(20) },
  { id: "premium", label: "Premium", href: "/dashboard/premium", exact: false, icon: navIcons.premium(20) },
  { id: "compte", label: "Compte", href: "/dashboard/compte", exact: false, icon: navIcons.account(20) },
];
