// TEMPORARY: runs live detection for any channel, to test it against a channel that is always live. Remove after use.
import { getLiveStatus } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const channel = new URL(req.url).searchParams.get("channel") ?? undefined;
  return Response.json(await getLiveStatus(channel));
}
