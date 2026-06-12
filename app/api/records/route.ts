import { kv } from "@vercel/kv";

export const runtime = "edge";

const RECORDS_KEY = "checkin_records";

export async function GET(request: Request) {
  try {
    // 简单密码验证
    const url = new URL(request.url);
    const pwd = url.searchParams.get("pwd");
    const adminPwd = process.env.ADMIN_PASSWORD || "admin123";

    if (pwd !== adminPwd) {
      return Response.json({ ok: false, msg: "密码错误" }, { status: 401 });
    }

    const raw = await kv.lrange(RECORDS_KEY, 0, 2000);
    const records = raw.map((r) => {
      try {
        return typeof r === "string" ? JSON.parse(r) : r;
      } catch {
        return r;
      }
    });

    // 按日期分组统计
    const byDate: Record<string, number> = {};
    records.forEach((r: any) => {
      const d = r.date || r.time?.slice(0, 10) || "?";
      byDate[d] = (byDate[d] || 0) + 1;
    });

    return Response.json({
      ok: true,
      total: records.length,
      byDate,
      records: records.slice(0, 200), // 最多返回 200 条
    });
  } catch (e: any) {
    return Response.json({ ok: false, msg: e.message }, { status: 500 });
  }
}
