import { describe, expect, it } from "vitest";
import { applyFilters, DEFAULT_FILTERS } from "../filters";

const sample = [
  { id: "a", company: "Anthropic", service: "Claude", planName: "Pro", priceMonthlyUsd: 20, webSearch: true, hasFreeTier: true },
  { id: "b", company: "OpenAI", service: "ChatGPT", planName: "Pro", priceMonthlyUsd: 200, webSearch: true, hasFreeTier: false },
  { id: "c", company: "Google", service: "Gemini", planName: "AI Pro", priceMonthlyUsd: 19.99, webSearch: false, hasFreeTier: true },
];

describe("applyFilters", () => {
  it("フィルタなしなら全件を返す", () => {
    expect(applyFilters(sample, DEFAULT_FILTERS)).toHaveLength(3);
  });

  it("該当0件になる条件では空配列を返す", () => {
    const result = applyFilters(sample, { ...DEFAULT_FILTERS, keyword: "存在しないサービス名12345" });
    expect(result).toEqual([]);
  });

  it("キーワードは大文字小文字を区別しない", () => {
    const result = applyFilters(sample, { ...DEFAULT_FILTERS, keyword: "claude" });
    expect(result.map((p) => p.id)).toEqual(["a"]);
  });

  it("必須機能を複数指定するとAND条件で絞り込む", () => {
    const result = applyFilters(sample, {
      ...DEFAULT_FILTERS,
      requiredFeatures: ["webSearch", "hasFreeTier"],
    });
    expect(result.map((p) => p.id)).toEqual(["a"]);
  });

  it("上限予算ちょうどの価格は含める（境界値）", () => {
    const result = applyFilters(sample, { ...DEFAULT_FILTERS, maxPriceUsd: 19.99 });
    expect(result.map((p) => p.id)).toEqual(["c"]);
  });

  it("上限予算に0を指定すると無料プラン以外は除外される", () => {
    const result = applyFilters(sample, { ...DEFAULT_FILTERS, maxPriceUsd: 0 });
    expect(result).toEqual([]);
  });

  it("前後に空白を含むキーワードもトリムして検索する", () => {
    const result = applyFilters(sample, { ...DEFAULT_FILTERS, keyword: "  Gemini  " });
    expect(result.map((p) => p.id)).toEqual(["c"]);
  });
});
