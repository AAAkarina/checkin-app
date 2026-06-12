# 🌙 今夜晚安否？— 微信打卡小程序

一个极简的晚安打卡网页，发到微信群，点一下就能打卡。

## 架构
- Next.js 14 + React 18
- Vercel KV 存储
- Vercel 免费部署

## 部署步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 创建 Vercel KV 数据库
去 Vercel 控制台 → Storage → KV → Create → 选默认区域 → Create

### 3. 设置环境变量
在 Vercel 项目 → Settings → Environment Variables 添加：
- `ADMIN_PASSWORD` = 你的管理密码（默认 goodnight2024）

KV 的 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 会自动注入。

### 4. 部署
把代码 push 到 GitHub，在 Vercel 中 Import 这个仓库即可。

## 使用
- 主页面：`/` — 打卡按钮
- 后台：`/admin` — 输入密码查看数据
