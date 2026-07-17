"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimForm() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  return (
    <form
      className="flex w-full max-w-md items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/signup${username ? `?u=${encodeURIComponent(username)}` : ""}`);
      }}
    >
      <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm focus-within:border-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-zinc-500">
        <span className="text-sm text-gray-400 dark:text-zinc-500">
          movalink.vercel.app/
        </span>
        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
          }
          placeholder="tonpseudo"
          maxLength={20}
          className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-300 dark:text-white dark:placeholder:text-zinc-600"
          aria-label="Choisis ton pseudo"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
      >
        Réserver
      </button>
    </form>
  );
}
