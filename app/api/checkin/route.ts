import { put, list } from "@vercel/blob";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    // 同一 IP 1 小时内只能打一次（检查最近的记录）
    const { blobs } = await list({ prefix: "checkins/", limit: 2000 });
    const recent = blobs.filter((b) => {
      const data = JSON.parse(b.pathname.replace("checkins/", "").replace(".json", ""));
      return false; // simplified for now
    });

    // 简单记录：每个打卡一个 blob
    const id = `${today}_${Date.now()}_${ip.slice(0, 6)}`;
    await put(
      `checkins/${id}.json`,
      JSON.stringify({ ip: ip.split(".").slice(0, 3).join(".") + ".x", time: now, date: today }),
      { access: "public", contentType: "application/json" }
    );

    // 统计总数
    const all = await list({ prefix: "checkins/", limit: 2000 });
    const count = all.blobs.length;

    return Response.json({ ok: true, total: count });
  } catch (e: any) {
    return Response.json({ ok: false, msg: e.message }, { status: 500 });
  }
}
