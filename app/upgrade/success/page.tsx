"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/AuthCard";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setMessage("Session de paiement manquante.");
      return;
    }
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setState("ok");
          setMessage(
            `Ton compte est passé au plan ${data.plan === "elite" ? "Elite" : "Pro"}.`
          );
        } else {
          setState("error");
          setMessage(data.error ?? "Vérification impossible.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Vérification impossible. Réessaie depuis ton dashboard.");
      });
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {state === "loading" && (
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Vérification du paiement...
        </p>
      )}
      {state === "ok" && (
        <>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Merci pour ton achat
          </p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{message}</p>
        </>
      )}
      {state === "error" && (
        <>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Un problème est survenu
          </p>
          <p className="text-sm text-red-500">{message}</p>
        </>
      )}
      <Link
        href="/dashboard"
        className="mt-2 w-full rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
      >
        Aller au dashboard
      </Link>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <AuthCard title="Paiement" subtitle="Confirmation de ton achat">
      <Suspense>
        <SuccessContent />
      </Suspense>
    </AuthCard>
  );
}
