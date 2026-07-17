"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "./Icons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "ml_app_banner_dismissed";

export default function AppBanner() {
  const [visible, setVisible] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Déjà dans l'appli installée ou bannière déjà fermée : on ne montre rien.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone);
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // stockage indisponible : on affiche quand même
    }
    if (!standalone && !dismissed) setVisible(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setVisible(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // au pire, la bannière reviendra à la prochaine visite
    }
  };

  const install = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setVisible(false);
      setPromptEvent(null);
    } else {
      // Pas de prompt natif (iOS, Firefox...) : on renvoie vers la FAQ qui explique.
      router.push("/faq");
    }
  };

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-[60] flex w-full items-center gap-3 bg-zinc-900 px-4 py-2.5 text-white dark:bg-zinc-800">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-zinc-900">
        <LogoMark className="h-3 w-3" />
      </span>
      <p className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">
        <span className="hidden sm:inline">
          Movalink existe en application : ta page et tes stats à un clic,
          directement depuis ton écran d'accueil.
        </span>
        <span className="sm:hidden">Movalink existe en application.</span>
      </p>
      <button
        type="button"
        onClick={install}
        className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 transition-opacity hover:opacity-90"
      >
        Installer
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer la bannière"
        className="shrink-0 rounded-md p-1 text-white/50 transition-colors hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
