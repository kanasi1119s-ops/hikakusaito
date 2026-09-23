import { describe, expect, it } from "vitest";
import { plansToCsv } from "../csv";
import type { Plan } from "../schema";

const plan: Plan = {
  id: "test-plan",
  company: "テスト会社",
  service: "テストサービス",
  planName: "プラン,カンマ入り",
  category: "general_chat",
  mainModel: "テストモデル",
  priceMonthlyUsd: 20,
  priceAnnualMonthlyUsd: null,
  priceAnnualTotalUsd: null,
  hasFreeTier: true,
  webSearch: true,
  deepResearch: null,
  imageGeneration: false,
  videoGeneration: null,
  agentFeature: true,
  apiIncluded: false,
  teamPlanAvailable: true,
  usageNote: "テスト",
  sourceUrl: "https://example.com/pricing",
  checkedAt: "2026-09-23",
  note: "テスト",
};

describe("plansToCsv", () => {
  it("ヘッダー行とデータ行を出力する", () => {
    const csv = plansToCsv([plan]);
    const lines = csv.split("\r\n");
    expect(lines.length).toBe(2);
    expect(lines[0]).toContain("提供会社");
  });

  it("カンマを含む値をダブルクォートで囲む", () => {
    const csv = plansToCsv([plan]);
    expect(csv).toContain('"プラン,カンマ入り"');
  });

  it("nullの値は未確認と表示する", () => {
    const csv = plansToCsv([plan]);
    expect(csv).toContain("—（未確認）");
  });

  it("真偽値を日本語のあり/なしに変換する", () => {
    const csv = plansToCsv([plan]);
    expect(csv).toContain("あり");
    expect(csv).toContain("なし");
  });
});
