"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HexBackground from "@/components/HexBackground";
import { LogoMark } from "@/components/Icons";
import { SITE_NAME } from "@/lib/config";

const LABELS: Record<string, string> = {
  web: "Site et pages publiques",
  store: "Base de données",
  media: "Stockage des images",
  payments: "Paiements",
};

const STATUS_LABELS: Record<string, { text: string; dot: string }> = {
  ok: { text: "Opérationnel", dot: "bg-emerald-500" },
  degraded: { text: "Dégradé", dot: "bg-amber-500" },
  down: { text: "Indisponible", dot: "bg-red-500" },
};

export default function StatusPage() {
  const [checks, setChecks] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setChecks(d.checks))
      .catch(() => setError(true));
  }, []);

  const allOk = checks && Object.values(checks).every((s) => s === "ok");

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 px-4 py-16 overflow-hidden">
      <HexBackground />
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-7 h-7 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity">
              <LogoMark className="h-3.5 w-3.5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {SITE_NAME}
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            État du service
          </h1>
          {checks ? (
            <p
              className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${
                allOk
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
              }`}
            >
              {allOk ? "Tous les systèmes sont opérationnels" : "Fonctionnement partiel"}
            </p>
          ) : (
            <div className="h-6 w-48 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse mx-auto" />
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden mb-6">
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {checks
              ? Object.entries(LABELS).map(([key, label]) => {
                  const status = STATUS_LABELS[checks[key] ?? "down"];
                  return (
                    <div key={key} className="flex items-center justify-between px-5 py-4">
                      <span className="text-sm text-gray-700 dark:text-zinc-300">
                        {label}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                        <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                        {status.text}
                      </span>
                    </div>
                  );
                })
              : [0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-20 animate-pulse" />
                  </div>
                ))}
            {error && (
              <div className="px-5 py-4 text-sm text-red-500">
                Impossible de récupérer l'état du service.
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-gray-400 dark:text-zinc-400">
            <Link href="/dashboard" className="hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
              ← Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
