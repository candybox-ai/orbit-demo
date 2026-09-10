# Orbit - Personal Growth Agent

**English** · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)

**Orbit — your AI growth companion, so personal growth can happen naturally.**

Early-career professionals, career changers, and freelancers often feel lost and stuck: goals stay fuzzy, there’s no clear path, and no one to move forward with. After a few dead ends, it’s easy to quit. Orbit helps you build your own growth path and become who you want to be.

## Live demo

https://candybox-ai.github.io/orbit-demo/

Sample data walks you through the core loop—feeling stuck, taking action, joining an offline activity, and reflecting. This build is not connected to a production LLM, ASR, or backend.

<p>
  <img src="https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-map.png" alt="Growth map: every step of growth recorded" width="200" />
  <img src="https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-chat.png" alt="Chat: understand struggles and match offline activities" width="200" />
</p>

In this demo you can:

- **Growth map (home screen)**: browse themes and your path; tap a node to see what happened and why it changed
- **Chat (bottom-right)**: talk through confusion and friction like you would with a friend, pick offline activity cards in the thread, get reminders, and wrap up with a reflection

## What Orbit can do for you

- Stay with your confusion or goals over time
- Turn them into a plan you can actually run
- Connect you with like-minded people offline, in settings that support growth
- Track the journey and show it in a game-like way

## Run locally

```bash
git clone https://github.com/candybox-ai/orbit-demo.git
cd orbit-demo
pnpm install
pnpm dev
```

Then open `http://127.0.0.1:5173/orbit-demo/`.

## Verify

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Updating the live demo

Push to `main` and the live demo updates on its own—no manual upload.

## Privacy

- Do not commit API keys, real recordings, or personal private files.
- You can edit demo data, but keep it safe to publish.

## Roadmap

- WeChat and phone-number sign-in
- Multiple large language models
- Voice conversation
- Offline activity features

## Feedback

https://github.com/candybox-ai/orbit-demo/issues

## Acknowledgments

This repository was prepared and published with help from [Codex](https://github.com/apps/chatgpt-codex-connector) and Grok Bot.
