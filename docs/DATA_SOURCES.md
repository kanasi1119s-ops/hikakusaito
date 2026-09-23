# データ出典一覧（DATA_SOURCES.md）

作成日: 2026-09-23 / 対象: `src/data/plans.json`（12プラン）

## 出典の調査方法について（重要な制約）

本サイクルの作業環境では、ネットワークの出口制限（egress proxy）により `chatgpt.com` / `openai.com` / `one.google.com` / `gemini.google` / `x.ai` / `www.perplexity.ai` 等、多くの公式ドメインへの直接アクセスができませんでした。直接アクセスできたのは `claude.com` のみです。

そのため、直接アクセスできなかったサービスについては、検索エンジン経由で「公式サイトの内容を要約・引用している複数の二次情報源（2026年9月時点の記事）」を突き合わせて確認する方法を取りました。価格.comのような比較サイトや口コミサイトの独自評価・ランキングは参照していません。**この方法は本来の運用指示書が定める「公式一次情報からの直接確認」を完全には満たしていないため、公開前に必ず各社公式ページでの目視確認をお願いします。**

## プランごとの出典

| # | プラン | 出典URL | 確認日 | 確認方法 |
|---|---|---|---|---|
| 1 | ChatGPT Plus | https://openai.com/chatgpt/pricing/ | 2026-09-23 | 検索エンジン経由（直接アクセス不可） |
| 2 | ChatGPT Pro | https://openai.com/chatgpt/pricing/ | 2026-09-23 | 検索エンジン経由（直接アクセス不可、価格に複数の報告あり・要再確認） |
| 3 | Claude Pro | https://claude.com/pricing | 2026-09-23 | 公式サイト直接取得 |
| 4 | Claude Max 5x | https://claude.com/pricing | 2026-09-23 | 公式サイト直接取得 |
| 5 | Claude Max 20x | https://claude.com/pricing | 2026-09-23 | 公式サイト直接取得＋検索エンジンでダブルチェック |
| 6 | Google AI Pro (Gemini) | https://one.google.com/about/google-ai-plans/ | 2026-09-23 | 検索エンジン経由（直接アクセス不可） |
| 7 | Google AI Ultra (Gemini) | https://one.google.com/about/google-ai-plans/ | 2026-09-23 | 検索エンジン経由（直接アクセス不可、2026年の価格改定情報あり） |
| 8 | Perplexity Pro | https://www.perplexity.ai/pricing | 2026-09-23 | 検索エンジン経由（直接アクセス不可） |
| 9 | Perplexity Max | https://www.perplexity.ai/pricing | 2026-09-23 | 検索エンジン経由（直接アクセス不可）＋ダブルチェック |
| 10 | SuperGrok | https://x.ai/pricing | 2026-09-23 | 検索エンジン経由（直接アクセス不可）＋ダブルチェック |
| 11 | SuperGrok Heavy | https://x.ai/pricing | 2026-09-23 | 検索エンジン経由（直接アクセス不可） |
| 12 | Microsoft 365 Premium (Copilot) | https://www.microsoft.com/en-us/microsoft-365/premium | 2026-09-23 | 検索エンジン経由（直接アクセス不可、プラン体系の移行期のため要再確認） |

## ダブルチェック結果

運用指示書に従い、ランダムに全12件中3件（25%）を、当初とは異なる検索クエリで再照合しました。

| プラン | 再照合した項目 | 結果 |
|---|---|---|
| SuperGrok | 月額$30・年額$300 | 一致（誤りなし） |
| Claude Max 20x | 月額$200 | 一致（誤りなし。一部の自動要約ツールがMax 5xと同額と誤表示する不具合を検出したが、複数の検索結果で$200であることを確認済み） |
| Perplexity Max | 月額$200・年額$2000 | 一致（誤りなし） |

ダブルチェックで発見した誤り: **0件**。ただし上記の通り、直接アクセスできなかった9プランについては一次情報への直接アクセスができていないため、公開前の最終確認を強く推奨します。

## 未確認（null）のデータ項目

以下は「公式情報で確認できず」として `null` のまま掲載しています（推測での穴埋めはしていません）。

- Google AI Pro / Google AI Ultra の `agentFeature`（自動操作エージェント機能の有無）
- Perplexity Pro / Perplexity Max の `videoGeneration`（動画生成機能の有無）
- SuperGrok / SuperGrok Heavy の `agentFeature`
- Microsoft 365 Premium の `deepResearch`・`videoGeneration`
- 年払い料金が確認できなかったプラン（ChatGPT Plus/Pro、Google AI Pro/Ultra、Claude Max 5x/20x、Microsoft 365 Premium）の `priceAnnualMonthlyUsd` / `priceAnnualTotalUsd`

## データ更新履歴

| 日付 | 内容 |
|---|---|
| 2026-09-23 | 初版作成（12プラン） |
