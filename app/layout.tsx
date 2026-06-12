import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "今夜晚安否？",
  viewport: "width=device-width, initial-scale=1, user-scalable=no",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
