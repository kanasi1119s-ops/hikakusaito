# Changelog

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
