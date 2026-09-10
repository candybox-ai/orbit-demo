# Orbit インタラクティブ Demo

[English](./README.md) · [中文](./README.zh-CN.md) · **日本語**

**Orbit —— あなた専用の AI 成長パートナー。個人の成長が自然に起こるように。**

新社会人、転職を考えている社会人、フリーランスは、個人の成長の道で迷いと無力感に陥りやすい。目標が整理できず、道筋が見えず、一緒に前へ進む仲間も足りない。何度か試してうまくいかないと、成長そのものを諦めてしまうこともある。Orbit は、あなた自身の成長の軌跡づくりを手伝い、なりたい自分に近づける。

## オンライン Demo

https://candybox-ai.github.io/orbit-demo/

プリセットデータで、迷い→行動→オフライン活動への参加→振り返りまでの流れを再現し、コアプロセスを示します。本番級の LLM・ASR・バックエンドには未接続です。

![成長マップ：成長の一歩ずつを記録](https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-map.png)

![Chat：迷いを理解し、オフライン活動をマッチ](https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-chat.png)

開いたあとでできること：

- **成長マップ（デフォルトのメイン画面）**：成長テーマと軌跡を見る。ノードをタップすると出来事と変化の根拠が分かる
- **Chat（右下から）**：友人と話すように迷いとつまずきを理解し、会話の中でオフライン活動カードを選び、リマインドを受け、振り返りまで進める

## Orbit にできること

- 迷いまたは目標を継続的に理解する
- 実行可能な計画づくりを手伝う
- オフラインで波長の合う人とつなぎ、成長しやすい環境へ導く
- 成長過程を記録し、ゲームのように見せる

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

## オンライン Demo の更新

変更を `main` に push すると、オンライン Demo は自動更新されます（ページの手動アップロードは不要）。

## プライバシー

- API キー、実録音、個人の非公開ファイルをコミットしないでください。
- デモデータは変更して構いませんが、公開して問題ない内容に保ってください。

## ロードマップ

- WeChat と電話番号でのログイン
- 複数の大規模言語モデルへの接続
- 音声会話
- オフライン活動まわりの機能

## フィードバック

https://github.com/candybox-ai/orbit-demo/issues

## 謝辞

本リポジトリは [Codex](https://github.com/apps/chatgpt-codex-connector) と Grok Bot の協力により整理・公開されました。
