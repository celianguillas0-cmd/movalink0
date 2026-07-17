import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifie que le compte existe réellement, pas seulement que le cookie est
  // valide : un compte supprimé (ou perdu) doit renvoyer à la connexion au
  // lieu de laisser les pages bloquées en chargement.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <AppShell>{children}</AppShell>;
}
