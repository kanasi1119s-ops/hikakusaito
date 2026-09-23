# hikakusaito ― AI月額プラン比較サイト

ChatGPT・Claude・Gemini・Perplexity・Grok・Microsoft Copilot など、主要なAIアシスタントの月額プランを、料金・機能・出典つきで横断比較できる非公式の比較サイトです。

- **サイト形態**: W1（静的サイト。サーバー不要、ブラウザだけで完結）
- **技術スタック**: React + TypeScript + Vite（PWA対応）
- 比較データはリポジトリ内の `src/data/plans.json` に同梱されており、外部サーバーへの通信は行いません。

詳しい企画意図・比較軸の定義は [`docs/DESIGN.md`](docs/DESIGN.md) を、データの出典一覧は [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) を参照してください。

## ローカルでの起動手順

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開くと確認できます。

## ビルド

```bash
npm run build
```

`dist/` に静的ファイル一式が出力されます。相対パス（`base: './'`）でビルドしているため、サブディレクトリ配下に配置しても動作します。

ビルド結果をローカルで確認する場合:

```bash
npm run preview
```

## テスト・チェック

```bash
npm run check   # lint + 型チェック + ユニットテスト + ビルド を一括実行
npm test        # ユニットテスト（Vitest）のみ
npx playwright test   # E2Eテスト（Playwright）。事前に `npm run build` が必要
```

## データの更新方法

比較データの更新手順は [`docs/DATA_UPDATE.md`](docs/DATA_UPDATE.md) にまとめています。`src/data/plans.json` を編集し、`npm test` でスキーマ検証が通ることを確認してからコミットしてください。

## ディレクトリ構成

```
src/
  data/       比較データ（plans.json）と比較軸の定義（axes.ts）
  lib/        データ検証・CSV出力・試算ロジックなどの純粋関数とテスト
  components/ 画面のUIコンポーネント
e2e/          Playwright E2Eテスト
docs/         設計書・データ出典・説明書・レポートなど
public/       PWAマニフェスト・Service Worker・ファビコン
```

## ドキュメント一覧

- [`docs/DESIGN.md`](docs/DESIGN.md) ― 要件・比較軸・データモデル
- [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) ― データの出典・確認日一覧
- [`docs/DATA_UPDATE.md`](docs/DATA_UPDATE.md) ― データ更新の手順
- [`docs/DEBUG_LOG.md`](docs/DEBUG_LOG.md) ― デバッグ3ラウンドの記録
- [`docs/THIRD_PARTY_LICENSES.md`](docs/THIRD_PARTY_LICENSES.md) ― OSSライセンス一覧
- [`docs/RELEASE.md`](docs/RELEASE.md) ― 公開手順書（人間が実行）
- [`docs/MANUAL.md`](docs/MANUAL.md) ― 素人向け説明書
- [`docs/REPORT.md`](docs/REPORT.md) ― 日次レポート

## ライセンス

コードは [MIT License](LICENSE) の案としています（人間の最終確認前）。比較データ（`src/data/plans.json`）自体の取り扱いについては `LICENSE` を参照してください。
