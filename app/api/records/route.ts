import { list } from "@vercel/blob";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pwd = url.searchParams.get("pwd");
    const adminPwd = process.env.ADMIN_PASSWORD || "goodnight2024";

    if (pwd !== adminPwd) {
      return Response.json({ ok: false, msg: "密码错误" }, { status: 401 });
    }

    const { blobs } = await list({ prefix: "checkins/", limit: 2000 });

    const records = blobs.map((b) => {
      const t = b.uploadedAt;
      const ts = typeof t === "string" ? t : new Date(t).toISOString();
      return { time: ts };
    });

    const byDate: Record<string, number> = {};
    records.forEach((r) => {
      const d = String(r.time).slice(0, 10);
      byDate[d] = (byDate[d] || 0) + 1;
    });

    return Response.json({
      ok: true,
      total: records.length,
      byDate,
      records: records.slice(0, 200),
    });
  } catch (e: any) {
    return Response.json({ ok: false, msg: e.message }, { status: 500 });
  }
}
