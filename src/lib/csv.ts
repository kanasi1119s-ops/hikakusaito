import type { Plan } from "./schema";
import { AXES, CATEGORY_LABELS } from "../data/axes";
import { usdToJpy } from "./calc";

function formatCell(plan: Plan, key: string): string {
  const value = (plan as unknown as Record<string, unknown>)[key];
  if (value === null || value === undefined) return "—（未確認）";
  if (typeof value === "boolean") return value ? "あり" : "なし";
  if (key === "category") return CATEGORY_LABELS[String(value)] ?? String(value);
  if (key === "priceMonthlyUsd" || key === "priceAnnualMonthlyUsd") return `$${Number(value).toFixed(2)}`;
  return String(value);
}

function escapeCsvField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function plansToCsv(plans: Plan[], jpyPerUsd: number): string {
  const headers = ["ID", ...AXES.map((a) => a.label), "月額料金（円換算）", "知名度の目安(1が高い、編集部目安)", "出典URL", "確認日"];
  const rows = plans.map((plan) => {
    const monthlyJpy = plan.priceMonthlyUsd === null ? "—" : `¥${usdToJpy(plan.priceMonthlyUsd, jpyPerUsd).toLocaleString("ja-JP")}`;
    const cells = [
      plan.id,
      ...AXES.map((a) => formatCell(plan, a.key)),
      monthlyJpy,
      String(plan.popularityTier),
      plan.sourceUrl,
      plan.checkedAt,
    ];
    return cells.map(escapeCsvField).join(",");
  });
  return [headers.map(escapeCsvField).join(","), ...rows].join("\r\n");
}

const BOM = "﻿";

export function downloadCsv(plans: Plan[], filename: string, jpyPerUsd: number): void {
  const csv = BOM + plansToCsv(plans, jpyPerUsd);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
