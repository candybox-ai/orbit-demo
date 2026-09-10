# Orbit 互动 Demo

[English](./README.md) · **中文** · [日本語](./README.ja.md)

**Orbit 是理解用户、主动组织成长过程，并把真实经历转化为成长认知的 AI Growth Agent。** 本仓库是可在浏览器打开的手机样式互动 Demo，无需登录。

地图让你先看见自己走到了哪里；Agent 在 Chat 里陪你理解、经历并确认这段成长。它不是留在线上堆建议的聊天机器人，也不只是「推荐活动」的工具。

## 在线 Demo

https://candybox-ai.github.io/orbit-demo/

演示账户为虚构人物「许澄」（29 岁，上海，内容运营）：有改变意愿，但还没把困惑变成稳定行动。对话、活动与素材均为演示数据；公开仓库只含化名与虚构内容。

## 你可以试什么

- 打开即进入**成长地图**：看当前主题、阶段，以及已确认的成长变化
- 点右下角进入全屏 **Chat**：看 Agent 如何理解用户、约定行动、匹配线下活动、现场记录、复盘，并请你确认成长状态
- 只有在 Chat 里确认后，地图才会更新；也可重置演示进度后重走一遍

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

在 Demo 之外还将补齐：

- 账号登录
- 支持接入多种大语言模型
- 个人数据持久化

## 反馈

https://github.com/candybox-ai/orbit-demo/issues

## 致谢

本仓库由 Codex、Grok Bot 协助整理与发布。
