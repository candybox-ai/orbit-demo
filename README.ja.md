# Orbit インタラクティブ Demo

[English](./README.md) · [中文](./README.zh-CN.md) · **日本語**

**Orbit は AI 成長コンパニオンです。** このリポジトリは、ブラウザでそのまま触れるスマホ風 Demo で、ログインは不要です。

## オンライン Demo

https://candybox-ai.github.io/orbit-demo/

デモアカウントは架空の人物「許澄（Xu Cheng）」です。人物・活動・対話・素材はすべてデモ用データです。

## 試せること

- 成長マップ上のテーマとノードを眺める
- Chat で Agent の対話、アクティビティ提案、現場記録、成長ステータス確認を見る
- 流れを進める、またはデモ進捗をリセットする

本番のログイン可能な App ではなく、プロダクトのインタラクティブ Demo です。

## ローカル実行

まずこのリポジトリを clone してから、インストールと起動：

```bash
git clone https://github.com/candybox-ai/orbit-demo.git
cd orbit-demo
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

## ロードマップ

この Demo の先では、次を揃える予定です：

- アカウントログイン
- 複数の大規模言語モデルへの接続
- 個人データの永続化

## フィードバック

https://github.com/candybox-ai/orbit-demo/issues
