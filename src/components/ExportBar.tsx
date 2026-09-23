import { useRef, useState } from "react";
import type { Plan } from "../lib/schema";
import { downloadCsv, downloadJson } from "../lib/csv";
import { buildBackup, restoreBackup } from "../lib/storage";

interface ExportBarProps {
  visiblePlans: Plan[];
  shareUrl: string;
  onImported: () => void;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExportBar({ visiblePlans, shareUrl, onImported }: ExportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleCsvExport() {
    downloadCsv(visiblePlans, `ai-plan-compare-${today()}.csv`);
    setMessage("CSVファイルをダウンロードしました。");
  }

  function handleBackupExport() {
    downloadJson(buildBackup(), `ai-plan-compare-backup-${today()}.json`);
    setMessage("お気に入り・条件のバックアップをダウンロードしました。");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      restoreBackup(data);
      onImported();
      setMessage("バックアップから復元しました。");
    } catch (err) {
      setMessage(err instanceof Error ? `復元に失敗しました: ${err.message}` : "復元に失敗しました。");
    } finally {
      e.target.value = "";
    }
  }

  async function handleCopyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("共有用のURLをコピーしました。");
    } catch {
      setMessage("コピーに失敗しました。URL欄から手動でコピーしてください。");
    }
  }

  return (
    <div className="export-bar">
      <button type="button" onClick={handleCsvExport}>
        比較結果をCSVでダウンロード
      </button>
      <button type="button" onClick={handleBackupExport}>
        保存データをJSONでバックアップ
      </button>
      <button type="button" onClick={handleImportClick}>
        バックアップから読み込む
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button type="button" onClick={handleCopyShareUrl}>
        比較状態のURLをコピー
      </button>
      {message ? (
        <span className="export-bar__message" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}
