# Orbit 互动 Demo

[English](./README.md) · **中文** · [日本語](./README.ja.md)

**在浏览器里体验 Orbit 成长陪伴。** 默认打开成长地图；进入 Chat 可看 Agent 对话、活动匹配、现场记录和成长状态确认。

## 在线 Demo

打开即可体验（手机样式界面）：

https://candybox-ai.github.io/orbit-demo/

演示账户为虚构人物「许澄」；人物、活动、对话与素材均为演示数据。

## 你可以试什么

- 浏览成长地图上的主题与节点
- 在 Chat 里查看 Agent 对话与活动提案
- 继续操作或重置演示进度

这是产品互动 Demo，不是可登录的正式 App。

## 本地运行

```bash
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

## 未来规划

计划中（不在本仓库）：

- 可登录的正式 Orbit App
- 超出「许澄」演示人设的真实用户数据

## 反馈

https://github.com/candybox-ai/orbit-demo/issues
