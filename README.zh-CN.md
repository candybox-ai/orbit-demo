# Orbit 互动 Demo

[English](./README.md) · **中文** · [日本語](./README.ja.md)

**Orbit 是 AI 成长陪伴产品。** 本仓库是可在浏览器里直接点开的手机样式 Demo，无需登录。

## 在线 Demo

https://candybox-ai.github.io/orbit-demo/

演示账户为虚构人物「许澄」；人物、活动、对话与素材均为演示数据。

## 你可以试什么

- 浏览成长地图上的主题与节点
- 在 Chat 里查看 Agent 对话、活动匹配、现场记录和成长状态确认
- 继续操作或重置演示进度

这是产品互动 Demo，不是可登录的正式 App。

## 本地运行

先克隆本仓库，再安装并启动：

```bash
git clone https://github.com/candybox-ai/orbit-demo.git
cd orbit-demo
pnpm install
pnpm dev
```

浏览器访问 `http://127.0.0.1:5173/orbit-demo/`。

## 验证

```bash
pnpm typecheck
pnpm test
pnpm build
```

## 部署

Vite `base` 为 `/orbit-demo/`。推送到 `main` 会跑测试、构建，并把 `dist` 发布到 GitHub Pages。

公开地址：https://candybox-ai.github.io/orbit-demo/

## 隐私

- 不要提交 API Key、真实录音或个人隐私文件。
- 演示数据可以改，但请保持可公开。

## 路线图

在 Demo 之外还将补齐：

- 账号登录与个人成长数据持久化
- 面向真实用户的成长路径与活动推荐

## 反馈

https://github.com/candybox-ai/orbit-demo/issues
