# Orbit Demo

**English** · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)

**Try Orbit’s growth companion in the browser.** Open the growth map first; in Chat you can follow Agent dialogue, activity matching, on-site recording, and growth-status confirmation.

## Live demo

Open in a phone-style UI:

https://candybox-ai.github.io/orbit-demo/

The demo account is a fictional person, “Xu Cheng” (许澄). People, activities, dialogues, and assets are sample data only.

## What you can try

- Browse themes and nodes on the growth map
- Open Chat to review Agent dialogue and activity proposals
- Continue the flow or reset demo progress

This is an interactive product demo, not a production app you can sign into.

## Run locally

```bash
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

## Deploy

Vite `base` is `/orbit-demo/`. Pushing to `main` runs tests, builds, and deploys `dist` to GitHub Pages.

Public URL: https://candybox-ai.github.io/orbit-demo/

## Privacy

- Do not commit API keys, real recordings, or personal private files.
- Demo data may be edited, but keep it safe to publish.

## Roadmap

Planned (not in this repo):

- Production Orbit app with real sign-in
- Live user data beyond the Xu Cheng sample persona

## Feedback

https://github.com/candybox-ai/orbit-demo/issues
