"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PublicShell from "@/components/PublicShell";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-transparent px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-zinc-700 dark:text-white dark:focus:border-zinc-500";
const labelClass =
  "block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5";

function ReportForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("u") ?? "");
  const [reason, setReason] = useState("contenu-illegal");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, reason, details, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Envoi impossible. Réessaie.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Signalement envoyé
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Merci. Nous examinons chaque signalement et retirons rapidement tout
          contenu manifestement illicite, conformément à nos CGU.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <label htmlFor="username" className={labelClass}>
          Pseudo du profil concerné
        </label>
        <div className="flex items-center rounded-lg border border-gray-200 px-3.5 py-2.5 dark:border-zinc-700">
          <span className="text-sm text-gray-400 dark:text-zinc-500">
            movalink.vercel.app/
          </span>
          <input
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-900 outline-none dark:text-white"
          />
        </div>
      </div>
      <div>
        <label htmlFor="reason" className={labelClass}>
          Motif
        </label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inputClass} dark:bg-zinc-900`}
        >
          <option value="contenu-illegal">Contenu illégal</option>
          <option value="droit-auteur">Atteinte au droit d'auteur</option>
          <option value="harcelement">Harcèlement ou haine</option>
          <option value="usurpation">Usurpation d'identité</option>
          <option value="contenu-choquant">Contenu choquant</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div>
        <label htmlFor="details" className={labelClass}>
          Description du problème (obligatoire)
        </label>
        <textarea
          id="details"
          required
          minLength={10}
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Explique précisément ce qui pose problème et où il se trouve sur la page."
          className={`${inputClass} resize-y`}
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Ton email (facultatif, pour te tenir informé)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
      >
        {status === "sending" ? "Envoi..." : "Envoyer le signalement"}
      </button>
    </form>
  );
}

export default function ReportPage() {
  return (
    <PublicShell>
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-xl py-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Signaler un contenu
          </h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6 leading-relaxed">
            Contenu illégal, droit d'auteur, harcèlement, usurpation... Nous
            examinons chaque signalement et agissons rapidement sur les
            contenus manifestement illicites.
          </p>
          <div>
            <Suspense>
              <ReportForm />
            </Suspense>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
