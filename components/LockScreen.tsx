"use client";

import { useState } from "react";

export default function LockScreen({
  username,
  displayName,
  avatarUrl,
}: {
  username: string;
  displayName: string;
  avatarUrl?: string;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error ?? "Mot de passe incorrect.");
      }
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm text-center">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-white/10 object-cover"
          />
        ) : (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="mb-1 flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-sm font-semibold text-white">{displayName}</span>
        </div>
        <p className="mb-6 text-xs text-white/40">Cette page est protégée par un mot de passe.</p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:ring-2 focus:ring-white/10"
            autoFocus
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Vérification…" : "Accéder"}
          </button>
        </form>
      </div>
    </div>
  );
}
