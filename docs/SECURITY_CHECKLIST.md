# セキュリティチェックリスト（Securityフェーズ）

実施日: 2026-09-23

- [x] **依存パッケージの脆弱性チェック**: `npm audit`（本番依存・全依存とも）で **0件**（High以上なし）。
- [x] **秘密情報の混入チェック**: `.env` ファイルは存在せず、APIキー・トークン・パスワードの類はコード・データ・コミット履歴に含めていない（外部APIを一切呼び出さない設計のため、そもそも秘密情報を必要としない）。
- [x] **OSSライセンス一覧**: `npx license-checker-rseidelsohn` で生成し `docs/THIRD_PARTY_LICENSES.md` にまとめ済み。本番ビルドに含まれるのはMITライセンスのみ（react / react-dom / scheduler / zod）。GPL/AGPL系のコピーレフトライセンスは検出されなかった。
- [x] **ユーザー入力・インポートファイル・URLクエリパラメータの扱い**:
  - `dangerouslySetInnerHTML` および `innerHTML` への直接代入は一切使用していない（Reactの通常のテキストレンダリングのみ）。
  - URLクエリパラメータ（`selected`）はプラン選択のID文字列としてのみ扱い、`PLANS.find()` で既知のプランIDと突き合わせるため、任意のHTML/スクリプトが注入されても表示には影響しない。
  - インポートするJSONファイルは `JSON.parse` 後に形式チェック（`restoreBackup`）を行い、不正な形式はエラーメッセージを表示して処理を中断する（E2Eテストで確認済み）。
  - 外部リンク（出典リンク）はすべて `rel="noopener noreferrer"` を付与済み。
- [x] **Content-Security-Policy**: `index.html` に `default-src 'self'` を基本としたCSPを設定し、外部への通信（fetch/script/connect）を自サイト内に制限。本サイトはW1（外部通信ゼロ設計）のため、これによりデータの外部送信がないことを技術的にも担保している。
- [x] **W2固有のチェック（認証・CSRF・SQLインジェクション等）**: 本サイトはW1（サーバーなし）のため非該当。

## 総合判定

High以上の既知脆弱性・秘密情報の混入・コピーレフトライセンスの衝突は検出されませんでした。次フェーズ（法務レビュー）へ進行可能と判断します。

## 追記: 2026-09-28サイクル（公式サイトリンクのプレースホルダー追加）

- 新規追加した `AffiliateCta`（`src/components/AffiliateCta.tsx`）は `href="#"` かつ `onClick` で `preventDefault()` しており、現時点では外部への遷移が一切発生しない（クリックしてもページ内に留まる）ことをユニットテスト・E2Eテストで確認済み。
- `data-affiliate="pending"` を付与しており、将来実際のリンク先URLに差し替える際は `rel="sponsored noopener"` を付与するよう `docs/RELEASE.md` に明記した。
- `npm audit`・`npx license-checker-rseidelsohn` を本サイクルでも再実行し、結果に変化がないことを確認（脆弱性0件、コピーレフトライセンスなし）。
