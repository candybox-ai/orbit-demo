# Orbit 互动 Demo

[English](./README.md) · **中文** · [日本語](./README.ja.md)

**Orbit 是个人成长 Agent，做你的专属 AI 成长伙伴。**

本仓库是可在浏览器打开的手机样式互动 Demo，无需登录。

## 在线 Demo

https://candybox-ai.github.io/orbit-demo/

预置数据模拟一段从困惑、尝试行动、参加线下活动到复盘的经历，呈现核心流程。未接入生产级 LLM、ASR 与后端；主理人相关能力未实现。

## Orbit 能为你做什么

Orbit 不仅让成长自然发生，还让你看见自己的成长：

- 持续理解你的困惑或目标
- 帮你制定可执行的计划
- 连接线下同频的人，将你带入利于成长的环境中
- 记录成长过程，并用游戏的方式呈现

## 你可以试什么

- **成长地图（默认主界面）**：查看成长主题与轨迹；点击节点看事件与变化依据
- **Chat（右下角进入）**：像朋友聊天一样理解困惑与阻力，在对话里选择线下活动卡片，接收提醒，并完成复盘
- 地图展示的是 Chat 中已认可的行动与变化；也可重置演示进度后重走一遍

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

## 更新在线 Demo

把改动推送到 `main` 后，在线 Demo 会自动更新（无需手动上传页面）。

## 隐私

- 不要提交 API Key、真实录音或个人隐私文件。
- 演示数据可以改，但请保持可公开。

## 路线图

- 支持微信和手机号登录
- 支持接入多种大语言模型
- 线下活动相关功能

## 反馈

https://github.com/candybox-ai/orbit-demo/issues

## 致谢

本仓库由 Codex、Grok Bot 协助整理与发布。
