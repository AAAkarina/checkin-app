"use client";

import { useState, useEffect, useCallback } from "react";

export default function AdminPage() {
  const [pwd, setPwd] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecords = useCallback(async (password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/records?pwd=${encodeURIComponent(password)}`);
      const json = await res.json();
      if (json.ok) {
        setData(json);
        setAuthed(true);
      } else {
        setError("密码错误");
      }
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchRecords(pwd);
  }

  if (!authed) {
    return (
      <main style={loginStyles.container}>
        <form onSubmit={handleLogin} style={loginStyles.form}>
          <h2 style={loginStyles.title}>🔐 管理员登录</h2>
          <input
            type="password"
            placeholder="请输入管理密码"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={loginStyles.input}
            autoFocus
          />
          <button type="submit" disabled={loading} style={loginStyles.btn}>
            {loading ? "验证中..." : "登录"}
          </button>
          {error && <p style={loginStyles.error}>{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main style={adminStyles.container}>
      <h2 style={adminStyles.title}>🌙 今夜晚安否？— 后台</h2>

      <div style={adminStyles.statBox}>
        <div style={adminStyles.stat}>
          <span style={adminStyles.statNum}>{data.total}</span>
          <span style={adminStyles.statLabel}>总打卡人次</span>
        </div>
      </div>

      {data.byDate && (
        <div style={adminStyles.section}>
          <h3 style={adminStyles.sectionTitle}>📅 每日统计</h3>
          <table style={adminStyles.table}>
            <thead>
              <tr>
                <th>日期</th>
                <th>打卡次数</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.byDate as Record<string, number>)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([date, count]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={adminStyles.section}>
        <h3 style={adminStyles.sectionTitle}>📋 最近记录</h3>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th>时间</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {data.records?.map((r: any, i: number) => (
              <tr key={i}>
                <td>{r.time || r}</td>
                <td>{r.ip || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={adminStyles.footer}>
        分享链接：<code>{typeof window !== "undefined" ? window.location.origin : ""}</code>
      </p>
    </main>
  );
}

// -- 样式 --
const loginStyles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
  },
  form: {
    background: "#1a1a1a",
    padding: "32px 24px",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: 300,
  },
  title: { color: "#fff", textAlign: "center", margin: 0 },
  input: {
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid #333",
    background: "#222",
    color: "#fff",
    fontSize: 16,
  },
  btn: {
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 600,
  },
  error: { color: "#ff6b6b", fontSize: 14, textAlign: "center" },
};

const adminStyles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#111",
    color: "#ddd",
    padding: "24px 16px",
    fontFamily: "system-ui, sans-serif",
    maxWidth: 600,
    margin: "0 auto",
  },
  title: { color: "#fff", textAlign: "center", fontSize: 20 },
  statBox: { display: "flex", justifyContent: "center", margin: "24px 0" },
  stat: {
    background: "#1a1a1a",
    padding: "24px 40px",
    borderRadius: 16,
    textAlign: "center",
  },
  statNum: { display: "block", fontSize: 48, color: "#667eea", fontWeight: 700 },
  statLabel: { fontSize: 14, color: "#888" },
  section: { marginTop: 24 },
  sectionTitle: { color: "#fff", fontSize: 16, marginBottom: 12 },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
  },
  footer: { marginTop: 32, textAlign: "center", fontSize: 12, color: "#666" },
};
