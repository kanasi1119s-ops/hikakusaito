# Changelog

## [Unreleased] - 2026-10-01

### Fixed
- 為替参考レートを更新（157.19→158.33円/USD）
- Play.ht Creatorの年払い換算額（$31.20）を追加、WellSaid Labs・Gamma Proを再確認（Gamma Proは情報源間で価格差があるため注記を更新）

## [Unreleased] - 2026-09-28

### Added
- 比較表・横並び比較の会社名の横に、会社名から自動生成した色付きイニシャルバッジを追加し、どの会社のソフトか一覧で見分けやすくした（`src/lib/companyBadge.ts`）。実際の企業ロゴ・商標画像は無断使用を避けるため使用していない（詳細は`docs/legal/CHECKLIST.md`の2026-09-28追記を参照）
- GitHub Pagesをmainへのpushで自動デプロイするよう変更（オーナー承認済み）

## [Unreleased] - 2026-09-27

### Fixed
- 前サイクルの成果（ChatGPT Pro・Google AI Ultraの2段階ティア化、149→151プラン）がmainに未反映のままだったため、本サイクルで統合
- Microsoft 365 Premiumの価格・プラン体系をWebSearchで再確認（数値変更なし、確信度向上のため`checkedAt`を更新）
- 日本円の参考換算に使う為替レートを本日時点の値に更新（158.28→157.19円/USD）

## [Unreleased] - 2026-09-26

### Fixed
- ChatGPT ProおよびGoogle AI Ultraが、2026年に「同一機能・利用量枠違いの2段階ティア」へ変更されていたことが判明したため、それぞれ1プラン→2プランに分割して掲載（149→151プラン）。詳細は`docs/DATA_SOURCES.md`を参照

## [Unreleased] - 2026-09-24

### Added
- 掲載プランを12件から149件に拡大（コーディング支援・画像/動画/音声生成・文章作成/マーケ・議事録/文字起こし・生産性/オフィス統合・デザイン/プレゼン・リサーチ/学習支援の各分野を追加）
- 日本円の参考換算表示、知名度の目安（★）による並べ替え
- お知らせ（ニュース）機能
- Gemini API（Web検索つき）による料金変化の自動検知ワークフロー（`.github/workflows/ai-news-check.yml`）。変化を検知した場合のみプルリクエストを自動作成し、人間の確認を待つ

## [Unreleased] - 2026-09-23

### Added
- 初回MVP公開: AI月額プラン比較サイト（ChatGPT / Claude / Gemini / Perplexity / Grok / Microsoft Copilot、全12プラン）
- 比較表（並べ替え・絞り込み）、横並び比較（最大4件、差分ハイライト）
- 条件試算（月払い/年払い × 利用月数）
- CSVエクスポート（BOM付きUTF-8）、お気に入り・条件のJSONバックアップ/復元
- 比較状態のURL共有
- PWA対応（オフラインでの閲覧に対応するService Worker、マニフェスト）
- ユニットテスト20件（Vitest）、E2Eテスト15件（Playwright）
- 「このサイトについて」「使い方」ページ
