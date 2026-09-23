# 設計書（DESIGN.md）

## 1. プロジェクト概要

- **プロジェクト名**: hikakusaito（AI月額プラン比較サイト）
- **1行コンセプト**: ChatGPT・Claude・Gemini・Perplexity・Grok・Microsoft Copilotなど主要AIアシスタントの月額プランを、出典と確認日つきで公平に比較できるサイト。
- **ターゲットユーザー**: 複数のAIサービスのどれに課金すべきか迷っている個人（ビジネス利用・学習利用の両方を想定）。
- **サイト形態**: **W1（静的比較サイト）**。理由: 比較データは月〜数か月単位でしか変動せず、リアルタイムAPI連携やユーザー投稿の受付といったサーバー処理が本質的に不要なため。静的サイトであれば無料の静的ホスティングで運用でき、サーバー費・保守工数がかからない。

## 2. 比較対象の選定基準

「個人が公式サイトから直接申し込める、月額課金制のAIアシスタント・生成AIサービスのプラン」のうち、公式サイトで料金が公開されているものを対象とする。企業向け専用プラン（要問い合わせのEnterpriseプラン等）や、料金非公開のプランは対象外とした。

2026年9月23日時点でMVPに採用した12プラン:

| # | 会社 | サービス | プラン |
|---|---|---|---|
| 1 | OpenAI | ChatGPT | Plus |
| 2 | OpenAI | ChatGPT | Pro |
| 3 | Anthropic | Claude | Pro |
| 4 | Anthropic | Claude | Max 5x |
| 5 | Anthropic | Claude | Max 20x |
| 6 | Google | Gemini | Google AI Pro |
| 7 | Google | Gemini | Google AI Ultra |
| 8 | Perplexity AI | Perplexity | Pro |
| 9 | Perplexity AI | Perplexity | Max |
| 10 | xAI | Grok | SuperGrok |
| 11 | xAI | Grok | SuperGrok Heavy |
| 12 | Microsoft | Microsoft Copilot | Microsoft 365 Premium |

**掲載していないプラン（バックログ）**: 各サービスの無料プラン自体（比較列としては「無料プランの有無」で表現）、ChatGPT Business/Enterprise、SuperGrok Lite/SuperGrok Plus、Perplexity Enterprise Max、Microsoft 365 Copilot Business、Claude Team/Enterprise。次サイクルでの拡充候補。

## 3. 比較軸（13項目）

定義とデータ型は `src/data/axes.ts` を正とする。

| キー | 表示名 | 型 |
|---|---|---|
| company | 提供会社 | text |
| service | サービス名 | text |
| planName | プラン名 | text |
| priceMonthlyUsd | 月額料金（月払い） | number (USD) |
| priceAnnualMonthlyUsd | 月額料金（年払い時） | number (USD) / null |
| hasFreeTier | 無料プランの有無 | boolean |
| webSearch | Web検索・ブラウジング | boolean / null |
| deepResearch | 高度な調査機能 | boolean / null |
| imageGeneration | 画像生成 | boolean / null |
| videoGeneration | 動画生成 | boolean / null |
| agentFeature | 自動操作エージェント機能 | boolean / null |
| apiIncluded | API利用がプランに含まれるか | boolean |
| teamPlanAvailable | チーム・法人プランの有無 | boolean |

`null` は「公式情報で確認できなかった」ことを表し、画面上は「—（未確認）」と表示する（推測での穴埋めはしない）。

## 4. おすすめ算出ロジック

本サイトはランキング・おすすめ表示を行わない。理由: AIサービスの優劣は利用目的（コーディング支援／検索調査／文書作成／オフィス統合など）によって大きく変わり、単一のスコアに集約すると利用者の判断を誤らせるリスクがあるため。代わりに、以下の2つの手段で利用者自身が判断できるようにしている。

1. 比較表の列見出しクリックによる並べ替え（会社名・サービス名・月額料金）
2. 「条件で絞り込む」パネルでの機能条件・予算によるフィルタリングと、支払い方法×利用月数による概算金額の試算（`src/lib/calc.ts`）

## 5. データモデル

`src/data/plans.json` の各レコードは `src/lib/schema.ts` の zod スキーマ (`PlanSchema`) で検証される。`sourceUrl`・`checkedAt`・`note` を必須項目とし、欠けている場合はスキーマ検証エラーとしてテスト・ビルドが失敗するようにしている（`src/lib/__tests__/schema.test.ts`）。

## 6. 画面一覧

| 画面 | 概要 |
|---|---|
| 比較表（list） | 全プランの一覧表示。列見出しでの並べ替え、絞り込みパネル、CSV/JSON出力、共有URLコピー |
| 横並び比較（compare） | 選択した最大4件を列として並べ、値が異なる行を背景色でハイライト |
| 使い方（howto） | 操作手順とFAQ |
| このサイトについて（about） | 選定基準・評価方法・広告方針・データ更新方針・免責・プライバシー・商標表記 |

## 7. 収益化仮説（未実施）

将来的にアフィリエイト（各社の公式サイトへの送客）を想定しているが、2026年9月23日時点では未提携。実装するプレースホルダーは用意していない（MVPスコープ外。導入する場合は各社ASPへの提携申請という人間承認事項が先に必要なため）。

## 8. MVPスコープ

**含む**: 比較表、絞り込み、横並び比較、試算、CSV/JSONエクスポート、お気に入り、共有URL、オフライン対応（PWA）、使い方・About ページ。

**含まない（次サイクル以降）**: 多言語対応、アフィリエイトリンク実装、ユーザーアカウント、比較対象の拡充（Team/Enterpriseプラン等）、価格自動更新の仕組み。
