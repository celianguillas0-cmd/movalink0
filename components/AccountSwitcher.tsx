"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMe } from "./NavShell";
import { clearCachedMe } from "@/lib/me-client";
import { haptics } from "@/lib/haptics";
import { Plan } from "@/lib/types";

const PLAN_LABELS: Record<Plan, string> = {
  free: "Gratuit",
  pro: "Pro",
  elite: "Elite",
};

interface Account {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  plan: Plan;
  active: boolean;
}

function Avatar({ url, name }: { url: string | null; name: string }) {
  const initials = (name || "?").slice(0, 2).toUpperCase();
  return (
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
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--nav-btn-text)" }}>
          {initials}
        </span>
      )}
    </div>
  );
}

export default function AccountSwitcher() {
  const me = useMe();
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/accounts")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAccounts(d.accounts))
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const switchTo = async (id: string) => {
    if (busy) return;
    setBusy(true);
    haptics.select();
    const r = await fetch("/api/accounts/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });
    if (r.ok) {
      clearCachedMe();
      window.location.assign("/dashboard");
    } else {
      setBusy(false);
    }
  };

  const logout = async () => {
    if (busy) return;
    setBusy(true);
    haptics.tap();
    const r = await fetch("/api/auth/logout", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    clearCachedMe();
    window.location.assign(d.switchedTo ? "/dashboard" : "/");
  };

  const rowBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "7px 8px",
    borderRadius: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    color: "inherit",
    textDecoration: "none",
    fontSize: 12,
  };

  const others = accounts.filter((a) => !a.active);

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: 6 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: 14,
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            padding: 6,
            zIndex: 60,
          }}
        >
          {accounts.map((a) => (
            <button
              key={a.id}
              type="button"
              disabled={busy}
              onClick={() => (a.active ? setOpen(false) : switchTo(a.id))}
              style={{
                ...rowBtn,
                background: a.active ? "var(--nav-btn-bg)" : "transparent",
              }}
            >
              <Avatar url={a.avatarUrl} name={a.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.name}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "var(--nav-muted)" }}>
                  @{a.username} · {PLAN_LABELS[a.plan]}
                </p>
              </div>
              {a.active && <span style={{ color: "var(--accent)", fontSize: 14 }}>✓</span>}
            </button>
          ))}

          <div style={{ height: 1, background: "var(--card-border)", margin: "6px 4px" }} />

          <Link
            href="/login?add=1"
            style={{ ...rowBtn, fontWeight: 600 }}
            onClick={() => haptics.tap()}
          >
            <span style={{ width: 30, textAlign: "center", fontSize: 18 }}>＋</span>
            Ajouter un compte
          </Link>
          <Link href="/dashboard/compte" style={rowBtn} onClick={() => haptics.tap()}>
            <span style={{ width: 30, textAlign: "center", fontSize: 14 }}>⚙️</span>
            Gérer ce compte
          </Link>
          <button type="button" disabled={busy} onClick={logout} style={{ ...rowBtn, color: "#ef4444" }}>
            <span style={{ width: 30, textAlign: "center", fontSize: 14 }}>⎋</span>
            Se déconnecter{others.length > 0 ? " de ce compte" : ""}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          haptics.tap();
          setOpen((o) => !o);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "7px 8px",
          borderRadius: 10,
          background: open ? "var(--nav-btn-bg)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        <Avatar url={me.avatarUrl} name={me.name ?? me.username ?? "?"} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--nav-text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {me.name ?? "Mon compte"}
          </p>
          <p style={{ fontSize: 10, color: "var(--nav-muted)", margin: 0 }}>
            {PLAN_LABELS[me.plan]}
          </p>
        </div>
        <span style={{ color: "var(--nav-muted)", fontSize: 12, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          ⌃
        </span>
      </button>
    </div>
  );
}
