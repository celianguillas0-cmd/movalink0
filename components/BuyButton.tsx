"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { haptics } from "@/lib/haptics";

export default function BuyButton({
  plan,
  billing = "monthly",
  className,
  children,
  discountCode,
  consent,
  requireConsent,
}: {
  plan: "pro" | "elite";
  billing?: "monthly" | "lifetime";
  className?: string;
  children: React.ReactNode;
  discountCode?: string;
  // Consentement à l'exécution immédiate (renonciation au droit de
  // rétractation). Soit piloté par le parent via `consent`, soit géré par une
  // case interne via `requireConsent`.
  consent?: boolean;
  requireConsent?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selfConsent, setSelfConsent] = useState(false);
  const router = useRouter();

  const consentEnforced = requireConsent === true || consent !== undefined;
  const consentValue = requireConsent ? selfConsent : consent === true;

  const buy = async () => {
    if (consentEnforced && !consentValue) {
      haptics.error();
      setError(
        "Merci de cocher la case de consentement ci-dessus pour continuer."
      );
      return;
    }
    haptics.tap();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          discountCode: discountCode?.trim() || undefined,
          consent: consentValue === true,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push(`/signup?plan=${plan}`);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else if (data.upgraded) {
        haptics.success();
        router.push("/dashboard?upgraded=1");
      }
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {requireConsent && (
        <label className="flex cursor-pointer items-start gap-2 text-left text-[11px] leading-snug text-gray-500 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={selfConsent}
            onChange={(e) => {
              haptics.toggle();
              setSelfConsent(e.target.checked);
            }}
            className="mt-0.5 shrink-0"
          />
          <span>
            Je demande l&apos;exécution immédiate et renonce à mon droit de
            rétractation une fois le service pleinement fourni.
          </span>
        </label>
      )}
      <button type="button" onClick={buy} disabled={loading} className={className}>
        {loading ? "Redirection..." : children}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
