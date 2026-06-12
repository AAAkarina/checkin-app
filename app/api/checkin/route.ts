import { kv } from "@vercel/kv";

export const runtime = "edge";

const RECORDS_KEY = "checkin_records";
const LAST_IP_KEY = "checkin_last_ip";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // IP 限流：同一 IP 1 小时内只能打一次
    const lastCheckin = await kv.get<string>(`${LAST_IP_KEY}:${ip}`);
    if (lastCheckin) {
      const elapsed = now - parseInt(lastCheckin);
      if (elapsed < 3600000) {
        return Response.json(
          { ok: false, msg: `请 ${Math.ceil((3600000 - elapsed) / 60000)} 分钟后再来` },
          { status: 429 }
        );
      }
    }

    // 记录打卡
    const record = {
      ip: ip.slice(0, ip.lastIndexOf(".")) + ".x", // 脱敏
      time: new Date().toISOString(),
      date: today,
    };

    await kv.lpush(RECORDS_KEY, JSON.stringify(record));
    await kv.set(`${LAST_IP_KEY}:${ip}`, now.toString());

    // 每天自动清理过期 IP 记录（保留最近 2000 条）
    const allRecords = await kv.lrange(RECORDS_KEY, 0, 2000);
    const count = allRecords.length;

    return Response.json({ ok: true, total: count });
  } catch (e: any) {
    return Response.json({ ok: false, msg: e.message }, { status: 500 });
  }
}
