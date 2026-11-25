import { describe, expect, it } from "vitest";
import { AFFILIATE_LINKS, getAffiliateUrl, hasAnyAffiliate } from "../affiliate";

describe("affiliate", () => {
  it("未設定のプランはnullを返す", () => {
    expect(getAffiliateUrl("no-such-plan")).toBeNull();
  });
  it("現状は実リンクが一つも設定されていない", () => {
    expect(hasAnyAffiliate()).toBe(false);
  });
  it("https以外のURLは無効として扱う", () => {
    AFFILIATE_LINKS["t1"] = "http://example.com";
    AFFILIATE_LINKS["t2"] = "https://example.com";
    expect(getAffiliateUrl("t1")).toBeNull();
    expect(getAffiliateUrl("t2")).toBe("https://example.com");
    delete AFFILIATE_LINKS["t1"];
    delete AFFILIATE_LINKS["t2"];
  });
});
