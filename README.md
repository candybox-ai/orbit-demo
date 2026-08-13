# Orbit 互动 Demo

一个按手机 App 设计的 React + TypeScript 交互 Demo。默认界面是成长地图，Chat 承载 Agent 对话、活动匹配、现场记录和成长状态确认。

## 本地运行

```bash
pnpm install
pnpm dev
```

访问 `http://127.0.0.1:5173/orbit-demo/`。

## 验证

```bash
pnpm typecheck
pnpm test
pnpm build
```

## GitHub Pages

Vite 的 `base` 已设置为 `/orbit-demo/`。仓库启用 GitHub Pages 的 GitHub Actions 发布源后，推送到 `main` 会运行测试、构建并部署 `dist`。

公开仓库中的人物、活动、对话和素材均为演示数据。不要提交 API Key、真实录音或个人隐私文件。
