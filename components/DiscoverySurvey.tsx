"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DISCOVERY_OPTIONS } from "@/lib/types";
import { haptics } from "@/lib/haptics";
import { cardClass, inputClass, primaryBtnClass } from "@/lib/ui";

// Sondage « Comment as-tu découvert Movalink ? » affiché une fois dans le
// dashboard tant que l'utilisateur n'a pas répondu.
export default function DiscoverySurvey({ onDone }: { onDone: () => void }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (source: string, det?: string) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, detail: det }),
      });
      if (res.ok) {
        haptics.success();
        onDone();
      } else {
        const d = await res.json();
        setError(d.error ?? "Une erreur est survenue.");
      }
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  const pick = (key: string) => {
    haptics.select();
    if (key === "other") {
      setChoice("other");
      return;
    }
    submit(key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${cardClass} mb-4`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Comment as-tu découvert Movalink ?
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
            Ça nous aide énormément à nous améliorer — un seul clic.
          </p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="shrink-0 text-xs text-gray-400 underline-offset-2 transition-colors hover:text-gray-600 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Passer
        </button>
      </div>

      {choice !== "other" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {DISCOVERY_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              disabled={submitting}
              onClick={() => pick(o.key)}
              className="rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-600 transition-all duration-150 hover:border-gray-400 hover:text-gray-900 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            autoFocus
            value={detail}
            maxLength={200}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Précise où / comment…"
            className={inputClass}
            onKeyDown={(e) => {
              if (e.key === "Enter" && detail.trim()) submit("other", detail);
            }}
          />
          <button
            type="button"
            disabled={submitting || !detail.trim()}
            onClick={() => submit("other", detail)}
            className={`${primaryBtnClass} shrink-0`}
          >
            {submitting ? "…" : "Valider"}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </motion.div>
  );
}
