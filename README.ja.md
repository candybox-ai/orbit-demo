# Orbit インタラクティブ Demo

[English](./README.md) · [中文](./README.zh-CN.md) · **日本語**

**ブラウザで Orbit の成長コンパニオンを体験できます。** 最初に成長マップが開き、Chat では Agent の対話、アクティビティ提案、現場記録、成長ステータス確認を辿れます。

## オンライン Demo

スマホ風 UI でそのまま開けます：

https://candybox-ai.github.io/orbit-demo/

デモアカウントは架空の人物「許澄（Xu Cheng）」です。人物・活動・対話・素材はすべてデモ用データです。

## 試せること

- 成長マップ上のテーマとノードを眺める
- Chat で Agent の対話とアクティビティ提案を見る
- 流れを進める、またはデモ進捗をリセットする

本番のログイン可能な App ではなく、プロダクトのインタラクティブ Demo です。

## ローカル実行

```bash
pnpm install
pnpm dev
```

ブラウザで `http://127.0.0.1:5173/orbit-demo/` を開きます。

## 検証

```bash
pnpm typecheck
pnpm test
pnpm build
```

## デプロイ

Vite の `base` は `/orbit-demo/` です。`main` への push でテスト・ビルドし、`dist` を GitHub Pages に公開します。

公開 URL：https://candybox-ai.github.io/orbit-demo/

## プライバシー

- API キー、実録音、個人の非公開ファイルをコミットしないでください。
- デモデータは変更して構いませんが、公開して問題ない内容に保ってください。

## 今後の予定

計画中（本リポジトリ外）：

- 本番の Orbit App（実ログイン）
- 「許澄」デモ人格を超える実ユーザーデータ

## フィードバック

https://github.com/candybox-ai/orbit-demo/issues
