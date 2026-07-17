"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plan } from "@/lib/types";

const PLAN_LABELS: Record<Plan, string> = { free: "Gratuit", pro: "Pro", elite: "Elite" };
const PLAN_COLORS: Record<Plan, string> = {
  free: "rgba(113,113,122,0.15)",
  pro: "rgba(99,102,241,0.15)",
  elite: "rgba(234,179,8,0.15)",
};
const PLAN_TEXT: Record<Plan, string> = {
  free: "#71717a",
  pro: "#818cf8",
  elite: "#ca8a04",
};

interface FoundUser {
  user: {
    id: string;
    email: string;
    username: string;
    plan: Plan;
    isAdmin?: boolean;
    createdAt: string;
  };
  profile: { displayName: string; avatarUrl?: string } | null;
  stats: { totalViews: number; totalClicks: number };
}

interface GlobalStats {
  total: number;
  free: number;
  pro: number;
  elite: number;
}

const card: React.CSSProperties = {
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)",
  borderRadius: 16,
  padding: "20px 24px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "var(--input-bg)",
  border: "1px solid var(--card-border)",
  borderRadius: 10,
  fontSize: 14,
  color: "var(--foreground)",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 18px",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const btnPlan = (active: boolean, plan: Plan): React.CSSProperties => ({
  padding: "6px 14px",
  background: active ? PLAN_COLORS[plan] : "transparent",
  border: `1px solid ${active ? PLAN_TEXT[plan] : "var(--card-border)"}`,
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  color: active ? PLAN_TEXT[plan] : "var(--foreground-muted)",
  cursor: active ? "default" : "pointer",
  transition: "all .15s",
});

export default function AdminPage() {
  const router = useRouter();
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [emailInput, setEmailInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<FoundUser | null>(null);
  const [searchError, setSearchError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  async function loadStats() {
    setStatsLoading(true);
    const r = await fetch("/api/admin/stats");
    if (r.status === 403) { router.push("/dashboard"); return; }
    if (r.ok) setGlobalStats(await r.json());
    setStatsLoading(false);
  }

  async function search() {
    setSearchError("");
    setFound(null);
    setSaveMsg("");
    if (!emailInput.trim()) return;
    setSearching(true);
    const r = await fetch(`/api/admin/user?email=${encodeURIComponent(emailInput.trim())}`);
    if (r.status === 403) { router.push("/dashboard"); return; }
    if (r.status === 404) { setSearchError("Aucun utilisateur trouvé."); setSearching(false); return; }
    if (!r.ok) { setSearchError("Erreur serveur."); setSearching(false); return; }
    setFound(await r.json());
    setSearching(false);
    if (!globalStats) loadStats();
  }

  async function changePlan(plan: Plan) {
    if (!found) return;
    setSaving(true);
    setSaveMsg("");
    const r = await fetch("/api/admin/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: found.user.email, plan }),
    });
    const data = await r.json();
    if (r.ok) {
      setFound((f) => f ? { ...f, user: data.user } : f);
      setSaveMsg("Plan mis à jour.");
      if (globalStats) loadStats();
    } else {
      setSaveMsg(data.error ?? "Erreur.");
    }
    setSaving(false);
  }

  async function toggleAdmin() {
    if (!found) return;
    setSaving(true);
    setSaveMsg("");
    const r = await fetch("/api/admin/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: found.user.email, isAdmin: !found.user.isAdmin }),
    });
    const data = await r.json();
    if (r.ok) {
      setFound((f) => f ? { ...f, user: data.user } : f);
      setSaveMsg(data.user.isAdmin ? "Accès admin accordé." : "Accès admin retiré.");
    } else {
      setSaveMsg(data.error ?? "Erreur.");
    }
    setSaving(false);
  }

  // Load stats on mount
  useEffect(() => { loadStats(); }, []);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Panneau admin</h1>
        <p style={{ fontSize: 13, color: "var(--foreground-muted)", margin: 0 }}>
          Visible uniquement pour les administrateurs
        </p>
      </div>

      {/* Stats globales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total", value: globalStats?.total, color: "var(--accent)" },
          { label: "Gratuits", value: globalStats?.free, color: "#71717a" },
          { label: "Pro", value: globalStats?.pro, color: "#818cf8" },
          { label: "Elite", value: globalStats?.elite, color: "#ca8a04" },
        ].map((s) => (
          <div key={s.label} style={{ ...card, textAlign: "center", padding: "16px 12px" }}>
            <p style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", color: s.color }}>
              {statsLoading ? "…" : (s.value ?? "—")}
            </p>
            <p style={{ fontSize: 11, color: "var(--foreground-muted)", margin: 0, fontWeight: 500 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div style={{ ...card, marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 10px" }}>Rechercher un utilisateur</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={inputStyle}
            type="email"
            placeholder="email@exemple.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <button style={btnPrimary} onClick={search} disabled={searching}>
            {searching ? "…" : "Chercher"}
          </button>
        </div>
        {searchError && (
          <p style={{ fontSize: 12, color: "#ef4444", margin: "8px 0 0" }}>{searchError}</p>
        )}
      </div>

      {/* Résultat */}
      {found && (
        <div style={{ ...card }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--nav-btn-bg)",
                flexShrink: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {found.profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={found.profile.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                (found.profile?.displayName ?? found.user.username).slice(0, 2).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                {found.profile?.displayName ?? found.user.username}
                {found.user.isAdmin && (
                  <span style={{ marginLeft: 8, fontSize: 10, background: "rgba(99,102,241,0.15)", color: "#818cf8", padding: "2px 7px", borderRadius: 6, fontWeight: 600, verticalAlign: "middle" }}>
                    ADMIN
                  </span>
                )}
              </p>
              <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: "2px 0 0" }}>
                @{found.user.username} · {found.user.email}
              </p>
            </div>
            <a
              href={`/${found.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                padding: "6px 12px",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                color: "var(--foreground-muted)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Voir la page ↗
            </a>
          </div>

          {/* Stats rapides */}
          <div style={{ display: "flex", gap: 16, marginBottom: 18, fontSize: 12, color: "var(--foreground-muted)" }}>
            <span>👁 {found.stats.totalViews} vues</span>
            <span>🖱 {found.stats.totalClicks} clics</span>
            <span>📅 {new Date(found.user.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>

          {/* Changement de plan */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 8px", color: "var(--foreground-muted)" }}>
              PLAN
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {(["free", "pro", "elite"] as Plan[]).map((p) => (
                <button
                  key={p}
                  disabled={saving || found.user.plan === p}
                  onClick={() => changePlan(p)}
                  style={btnPlan(found.user.plan === p, p)}
                >
                  {PLAN_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle admin */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--card-border)" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Accès administrateur</p>
              <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: "2px 0 0" }}>
                Permet d'accéder à ce panneau admin
              </p>
            </div>
            <button
              disabled={saving}
              onClick={toggleAdmin}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: found.user.isAdmin ? "var(--accent)" : "var(--card-border)",
                cursor: "pointer",
                position: "relative",
                transition: "background .2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: found.user.isAdmin ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left .2s",
                }}
              />
            </button>
          </div>

          {saveMsg && (
            <p style={{ fontSize: 12, margin: "10px 0 0", color: saveMsg.includes("Erreur") ? "#ef4444" : "#22c55e" }}>
              {saveMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
