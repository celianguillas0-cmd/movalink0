"use client";

import { useEffect, useState } from "react";
import { fetchMe, getCachedMe, MeData } from "@/lib/me-client";
import { Plan } from "@/lib/types";

// Extrait de NavShell pour que les pages vitrine puissent savoir si le visiteur
// est connecté sans embarquer toute la navigation de l'application : importer
// le hook depuis NavShell tirait le menu latéral, ses icônes et le sélecteur de
// thème dans le lot JavaScript de la page d'accueil.

export interface MovalinkMe {
  loggedIn: boolean | null;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  plan: Plan;
  isAdmin?: boolean;
}

function toMovalinkMe(d: MeData): MovalinkMe {
  return {
    loggedIn: true,
    name: d.profile?.displayName ?? d.user.username,
    username: d.user.username,
    avatarUrl: d.profile?.avatarUrl || null,
    plan: d.user.plan ?? "free",
    isAdmin: d.user.isAdmin ?? false,
  };
}

export function useMe(): MovalinkMe {
  const cached = getCachedMe();
  const [me, setMe] = useState<MovalinkMe>(
    cached
      ? toMovalinkMe(cached)
      : {
          loggedIn: null,
          name: null,
          username: null,
          avatarUrl: null,
          plan: "free",
        }
  );

  useEffect(() => {
    let alive = true;
    fetchMe().then(({ me: d }) => {
      if (!alive) return;
      if (d) setMe(toMovalinkMe(d));
      else setMe((m) => ({ ...m, loggedIn: false }));
    });
    return () => {
      alive = false;
    };
  }, []);

  return me;
}
