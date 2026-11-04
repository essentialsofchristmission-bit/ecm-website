import { getLiveStatus } from "@/lib/live";

// Asked by the pages every couple of minutes; YouTube itself is checked at most once a minute.
export const revalidate = 60;

export async function GET() {
  return Response.json(await getLiveStatus());
}
