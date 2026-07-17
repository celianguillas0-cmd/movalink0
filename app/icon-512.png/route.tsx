import { movalinkIcon } from "@/lib/icon-image";

export const dynamic = "force-static";

export async function GET() {
  return movalinkIcon(512);
}
