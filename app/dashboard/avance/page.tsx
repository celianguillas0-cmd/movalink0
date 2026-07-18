import { redirect } from "next/navigation";

export default function AvancePage() {
  redirect("/dashboard/mapage?tab=avance");
}
