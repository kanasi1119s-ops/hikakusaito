import { describe, expect, it } from "vitest";
import { estimateTotalCostUsd } from "../calc";
import type { Plan } from "../schema";

const basePlan: Plan = {
  id: "test",
  company: "Test",
  service: "Test",
  planName: "Test",
  category: "general_chat",
  mainModel: "test",
  priceMonthlyUsd: 20,
  priceAnnualMonthlyUsd: 17,
  priceAnnualTotalUsd: 204,
  hasFreeTier: true,
  webSearch: true,
  deepResearch: true,
  imageGeneration: true,
  videoGeneration: true,
  agentFeature: true,
  apiIncluded: false,
  teamPlanAvailable: true,
  usageNote: "test",
  sourceUrl: "https://example.com",
  checkedAt: "2026-09-23",
  note: "test",
};

describe("estimateTotalCostUsd", () => {
  it("月払いで12か月分を計算する", () => {
    expect(estimateTotalCostUsd(basePlan, "monthly", 12)).toBe(240);
  });

  it("年払いで12か月分を計算する（年払い単価を使う）", () => {
    expect(estimateTotalCostUsd(basePlan, "annual", 12)).toBe(204);
  });

  it("年払いが提供されていないプランは月払い単価で計算する", () => {
    const plan: Plan = { ...basePlan, priceAnnualMonthlyUsd: null };
    expect(estimateTotalCostUsd(plan, "annual", 12)).toBe(240);
  });

  it("0か月以下は0を返す", () => {
    expect(estimateTotalCostUsd(basePlan, "monthly", 0)).toBe(0);
    expect(estimateTotalCostUsd(basePlan, "monthly", -3)).toBe(0);
  });

  it("小数を含む金額を正しく丸める", () => {
    const plan: Plan = { ...basePlan, priceMonthlyUsd: 16.67, priceAnnualMonthlyUsd: null };
    expect(estimateTotalCostUsd(plan, "monthly", 3)).toBe(50.01);
  });
});
