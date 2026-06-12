"use client";

import { useState } from "react";

export default function Home() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState<number | null>(null);

  async function handleCheckin() {
    setState("loading");
    try {
      const res = await fetch("/api/checkin", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setCount(data.total);
        setState("done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <main style={styles.container}>
      {/* 夜空背景 */}
      <div style={styles.stars}>
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} style={{ ...styles.star, left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, animationDelay: `${Math.random() * 3}s` }} />
        ))}
      </div>

      <div style={styles.card}>
        <p style={styles.subtitle}>💤 今夜晚安否？</p>

        {state === "done" ? (
          <div style={styles.doneBox}>
            <span style={styles.checkmark}>✅</span>
            <p style={styles.doneText}>晚安，好梦 🌙</p>
            <p style={styles.countText}>第 {count} 位打卡人</p>
          </div>
        ) : (
          <button
            onClick={handleCheckin}
            disabled={state === "loading"}
            style={{
              ...styles.btn,
              opacity: state === "loading" ? 0.6 : 1,
            }}
          >
            {state === "loading" ? "..." : "🌙 晚安打卡"}
          </button>
        )}

        {state === "error" && (
          <p style={styles.error}>打卡失败，请稍后再试</p>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 50%, #2a2a5e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  stars: {
    position: "absolute",
    inset: 0,
  },
  star: {
    position: "absolute",
    width: 3,
    height: 3,
    background: "#fff",
    borderRadius: "50%",
    animation: "twinkle 3s ease-in-out infinite",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    padding: "40px 32px",
    textAlign: "center",
    zIndex: 1,
    border: "1px solid rgba(255,255,255,0.1)",
    maxWidth: 320,
    width: "90%",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
    marginBottom: 32,
    letterSpacing: 2,
  },
  btn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    color: "#fff",
    fontSize: 22,
    padding: "16px 40px",
    borderRadius: 50,
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 2,
    boxShadow: "0 8px 30px rgba(102,126,234,0.4)",
    transition: "transform 0.2s",
  },
  doneBox: {
    color: "#fff",
  },
  checkmark: {
    fontSize: 48,
    display: "block",
    marginBottom: 16,
  },
  doneText: {
    fontSize: 20,
    margin: "8px 0",
  },
  countText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 16,
  },
};
