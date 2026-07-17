"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyButton({
  plan,
  className,
  children,
}: {
  plan: "pro" | "elite";
  className?: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const buy = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
      <button type="button" onClick={buy} disabled={loading} className={className}>
        {loading ? "Redirection..." : children}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
