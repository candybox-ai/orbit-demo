# Orbit Interactive Demo

**English** · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)

**Orbit — your AI growth companion, so personal growth can happen naturally.**

Early-career professionals, people changing careers, and freelancers often feel lost and powerless on the path of personal growth: unclear goals, no path forward, and no peers walking with them. After a few failed attempts, some give up. Orbit helps you build your own growth trajectory and become who you want to be.

## Live demo

https://candybox-ai.github.io/orbit-demo/

Preset data walks through confusion, trying actions, joining offline activities, and reflection—showing the core flow. Not connected to production LLM, ASR, or backend services.

![Growth map: every step of growth recorded](https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-map.png)

![Chat: understand struggles and match offline activities](https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-chat.png)

What you can try after opening:

- **Growth map (default home)**: browse growth themes and paths; tap nodes for events and why things changed
- **Chat (bottom-right)**: talk like a friend about confusion and friction, pick offline activity cards in the conversation, get reminders, and complete reflection

## What Orbit can do for you

- Keep understanding your confusion or goals
- Help you make an actionable plan
- Connect you with people on a similar wavelength offline, into environments that support growth
- Record the growth process and present it in a game-like way

## Run locally

Clone this repository, then install and start:

```bash
git clone https://github.com/candybox-ai/orbit-demo.git
cd orbit-demo
pnpm install
pnpm dev
```

Open `http://127.0.0.1:5173/orbit-demo/` in your browser.

## Verify

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Updating the live demo

After you push changes to `main`, the live demo updates automatically (no manual page upload).

## Privacy

- Do not commit API keys, real recordings, or personal private files.
- Demo data may be edited, but keep it safe to publish.

## Roadmap

- WeChat and phone-number sign-in
- Support for multiple large language models
- Voice conversation
- Offline activity features

## Feedback

https://github.com/candybox-ai/orbit-demo/issues

## Acknowledgments

This repository was prepared and published with help from [Codex](https://github.com/apps/chatgpt-codex-connector) and Grok Bot.
