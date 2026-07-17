"use client";

import { useEffect, useState } from "react";

export function useTheme(): [boolean, () => void] {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // stockage indisponible : le thème restera pour la session
    }
    setDark(next);
  };

  return [dark, toggle];
}

export function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [dark, toggle] = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Changer le thème"
      className={
        className ??
        "flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:text-gray-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white"
      }
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
