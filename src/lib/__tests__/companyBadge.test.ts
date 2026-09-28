import { describe, expect, it } from "vitest";
import { companyColor, companyInitials, getCompanyBadge } from "../companyBadge";
import plansData from "../../data/plans.json";

describe("companyBadge", () => {
  it("実際の企業ロゴではなく、会社名から生成した2文字以内のイニシャルを返す", () => {
    expect(companyInitials("OpenAI")).toBe("OP");
    expect(companyInitials("Anthropic")).toBe("AN");
    expect(companyInitials("Google")).toBe("GO");
    expect(companyInitials("Perplexity AI")).toBe("PA");
  });

  it("法人格の接尾辞（Inc.やLtd.等）を無視してイニシャルを作る", () => {
    expect(companyInitials("Midjourney, Inc.")).toBe("MI");
    expect(companyInitials("JetBrains s.r.o.")).toBe("JE");
  });

  it("括弧内の補足（日本語表記や親会社名）はイニシャルの計算から除外する", () => {
    expect(companyInitials("Zhipu AI（智譜AI）")).toBe("ZA");
    expect(companyInitials("Photomath, Inc.(Google傘下)")).toBe("PH");
  });

  it("同じ会社名には常に同じ色を返す（決定的である）", () => {
    expect(companyColor("OpenAI")).toBe(companyColor("OpenAI"));
    const badge1 = getCompanyBadge("Anthropic");
    const badge2 = getCompanyBadge("Anthropic");
    expect(badge1).toEqual(badge2);
  });

  it("色は#で始まるCSSカラーコードである", () => {
    expect(companyColor("Microsoft")).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("掲載されている全プランの会社名について、空でないイニシャルが生成できる", () => {
    const companies = new Set(plansData.plans.map((p) => p.company));
    for (const company of companies) {
      const badge = getCompanyBadge(company);
      expect(badge.initials.length).toBeGreaterThan(0);
      expect(badge.color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
