# Orbit - パーソナル成長エージェント

[English](./README.md) · [中文](./README.zh-CN.md) · **日本語**

**Orbit —— あなた専用の AI 成長パートナー。個人の成長が、もっと自然に進むように。**

新社会人、転職を考える社会人、フリーランスは、成長の途中で迷いやすく、無力感を覚えやすい。目標がぼやけ、道筋が見えず、一緒に前へ進む仲間も足りない。何度か試してうまくいかないと、成長そのものを諦めてしまうこともある。Orbit は、あなた自身の成長の軌跡づくりを手伝い、なりたい自分へ近づく手助けをします。

## オンライン Demo

https://candybox-ai.github.io/orbit-demo/

プリセットデータで、迷い→行動→オフライン活動への参加→振り返りというコアの流れを体験できます。本番向けの LLM・ASR・バックエンドにはつながっていません。

<p>
  <img src="https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-map.png" alt="成長マップ：成長の一歩ずつを記録" width="48%" />
  <img src="https://cdn.jsdelivr.net/gh/candybox-ai/orbit-demo@main/docs/demo-chat.png" alt="Chat：迷いを理解し、オフライン活動をマッチ" width="48%" />
</p>

デモで試せること：

- **成長マップ（最初の画面）**：テーマと軌跡を眺める。ノードをタップすると、出来事と変化の理由が分かる
- **Chat（右下）**：友人に話すように迷いとつまずきを整理し、会話の中でオフライン活動カードを選び、リマインドを受け、振り返りまで進める

## Orbit でできること

- 迷いまたは目標を、継続して受け止める
- 実行できる計画に落とし込む
- オフラインで波長の合う人とつなぎ、成長しやすい場へ導く
- 成長の過程を記録し、ゲームのように見せる

## ローカルで動かす

```bash
git clone https://github.com/candybox-ai/orbit-demo.git
cd orbit-demo
pnpm install
pnpm dev
```

その後、ブラウザで `http://127.0.0.1:5173/orbit-demo/` を開きます。

## 検証

```bash
pnpm typecheck
pnpm test
pnpm build
```

## オンライン Demo の更新

`main` に push すれば、オンライン Demo は自動で更新されます。ページを手で上げ直す必要はありません。

## プライバシー

- API キー、実録音、個人の非公開ファイルはコミットしないでください。
- デモデータは変えて構いませんが、公開して問題ない内容に保ってください。

## ロードマップ

- WeChat と電話番号でのログイン
- 複数の大規模言語モデルへの接続
- 音声会話
- オフライン活動まわりの機能

## フィードバック

https://github.com/candybox-ai/orbit-demo/issues

## 謝辞

本リポジトリは [Codex](https://github.com/apps/chatgpt-codex-connector) と Grok Bot の協力により整理・公開されました。
