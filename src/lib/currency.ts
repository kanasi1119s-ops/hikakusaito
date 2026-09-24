export function formatUsd(value: number | null): string {
  if (value === null) return "—（未確認）";
  return `$${value.toFixed(2)}`;
}

export function formatJpy(value: number | null): string {
  if (value === null) return "—";
  return `¥${value.toLocaleString("ja-JP")}`;
}
