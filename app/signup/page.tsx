"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard, {
  authButtonClass,
  authInputClass,
  authLabelClass,
} from "@/components/AuthCard";
import PasswordInput from "@/components/PasswordInput";
import CheckboxRow from "@/components/CheckboxRow";

function SignupForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("u") ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const router = useRouter();
  const targetPlan = searchParams.get("plan");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      setError("Merci d'accepter les CGU pour créer ton compte.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, ref: searchParams.get("ref") ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      router.push(targetPlan ? "/dashboard/premium" : "/dashboard");
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="username" className={authLabelClass}>
          Ton pseudo (URL publique) <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-white focus-within:border-transparent">
          <span className="text-sm text-gray-400 dark:text-zinc-500">
            movalink.vercel.app/
          </span>
          <input
            id="username"
            required
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
            }
            maxLength={20}
            placeholder="tonpseudo"
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-zinc-600"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className={authLabelClass}>
          Adresse email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={authLabelClass}>
          Mot de passe <span className="text-red-400">*</span>
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          placeholder="8 caractères minimum"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <CheckboxRow checked={accepted} onChange={setAccepted}>
        J'ai lu et j'accepte les{" "}
        <Link
          href="/legal/cgu"
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="underline hover:text-gray-700 dark:hover:text-zinc-200"
        >
          CGU
        </Link>{" "}
        et la{" "}
        <Link
          href="/legal/confidentialite"
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="underline hover:text-gray-700 dark:hover:text-zinc-200"
        >
          politique de confidentialité
        </Link>
        . <span className="text-red-400">*</span>
      </CheckboxRow>
      <CheckboxRow checked={newsletter} onChange={setNewsletter}>
        J'accepte de recevoir des emails sur les nouveautés et offres de
        Movalink. (optionnel)
      </CheckboxRow>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className={authButtonClass}>
        {loading ? "Création..." : "Créer mon compte gratuit"}
      </button>
      <p className="text-xs text-gray-400 dark:text-zinc-500 text-center">
        <span className="text-red-400">*</span> Champ obligatoire
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <AuthCard
      title="Créer votre compte"
      subtitle="Gratuit, sans carte bancaire"
      footer={
        <>
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-gray-900 dark:text-white font-medium hover:underline"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
