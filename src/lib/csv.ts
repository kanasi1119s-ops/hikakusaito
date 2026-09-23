import type { Plan } from "./schema";
import { AXES } from "../data/axes";

function formatCell(plan: Plan, key: string): string {
  const value = (plan as unknown as Record<string, unknown>)[key];
  if (value === null || value === undefined) return "—（未確認）";
  if (typeof value === "boolean") return value ? "あり" : "なし";
  return String(value);
}

function escapeCsvField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function plansToCsv(plans: Plan[]): string {
  const headers = ["ID", ...AXES.map((a) => a.label), "出典URL", "確認日"];
  const rows = plans.map((plan) => {
    const cells = [
      plan.id,
      ...AXES.map((a) => formatCell(plan, a.key)),
      plan.sourceUrl,
      plan.checkedAt,
    ];
    return cells.map(escapeCsvField).join(",");
  });
  return [headers.map(escapeCsvField).join(","), ...rows].join("\r\n");
}

const BOM = "﻿";

export function downloadCsv(plans: Plan[], filename: string): void {
  const csv = BOM + plansToCsv(plans);
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
