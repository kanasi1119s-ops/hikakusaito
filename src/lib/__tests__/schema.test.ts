import { describe, expect, it } from "vitest";
import plansData from "../../data/plans.json";
import { validatePlansFile } from "../schema";

describe("plans.json のスキーマ検証", () => {
  it("実データがスキーマに一致する", () => {
    expect(() => validatePlansFile(plansData)).not.toThrow();
  });

  it("全プランに出典URLと確認日がある", () => {
    const parsed = validatePlansFile(plansData);
    for (const plan of parsed.plans) {
      expect(plan.sourceUrl.length).toBeGreaterThan(0);
      expect(plan.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("id が重複していない", () => {
    const parsed = validatePlansFile(plansData);
    const ids = parsed.plans.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("出典URLとcheckedAtが欠けているとビルドが失敗する", () => {
    const broken = {
      dataUpdatedAt: "2026-09-23",
      plans: [
        {
          id: "broken",
          company: "Test",
          service: "Test",
          planName: "Test",
          category: "general_chat",
          mainModel: "test",
          priceMonthlyUsd: 10,
          priceAnnualMonthlyUsd: null,
          priceAnnualTotalUsd: null,
          hasFreeTier: true,
          webSearch: true,
          deepResearch: true,
          imageGeneration: true,
          videoGeneration: true,
          agentFeature: true,
          apiIncluded: false,
          teamPlanAvailable: false,
          usageNote: "test",
          sourceUrl: "",
          checkedAt: "",
          note: "test",
        },
      ],
    };
    expect(() => validatePlansFile(broken)).toThrow();
  });
});
