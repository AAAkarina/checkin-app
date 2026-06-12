import { put, list } from "@vercel/blob";

export const runtime = "edge";

export async function POST() {
  try {
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const id = `${today}_${Date.now()}`;

    await put(
      `checkins/${id}.json`,
      JSON.stringify({ time: now, date: today }),
      { access: "public" }
    );

    const { blobs } = await list({ prefix: "checkins/", limit: 2000 });

    return Response.json({ ok: true, total: blobs.length });
  } catch (e: any) {
    return Response.json({ ok: false, msg: e.message }, { status: 500 });
  }
}
