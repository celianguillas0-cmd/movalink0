"use client";

import { useState } from "react";

export default function RedeemCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Code invalide.");
        return;
      }
      setSuccess(
        data.reset
          ? "Compte réinitialisé au plan Gratuit. Rechargement..."
          : `Code validé : ton compte passe au plan ${data.plan === "elite" ? "Elite" : "Pro"} ! Rechargement...`
      );
      setCode("");
      // Rechargement complet : met à jour le plan partout (sidebar, limites).
      setTimeout(() => window.location.reload(), 900);
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        Tu as un code cadeau ?
      </p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Entre ton code"
          maxLength={32}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium tracking-wider text-gray-900 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
        />
        <button
          type="submit"
          disabled={loading || !code}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {loading ? "..." : "Valider"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">{success}</p>
      )}
    </form>
  );
}
