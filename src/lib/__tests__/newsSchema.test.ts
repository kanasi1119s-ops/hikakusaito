import { describe, expect, it } from "vitest";
import newsData from "../../data/news.json";
import { validateNewsFile } from "../newsSchema";

describe("news.json のスキーマ検証", () => {
  it("実データがスキーマに一致する", () => {
    expect(() => validateNewsFile(newsData)).not.toThrow();
  });

  it("各記事に日付・タイトル・本文がある", () => {
    const parsed = validateNewsFile(newsData);
    for (const article of parsed.articles) {
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.title.length).toBeGreaterThan(0);
      expect(article.body.length).toBeGreaterThan(0);
    }
  });

  it("形式が壊れているとビルドが失敗する", () => {
    expect(() => validateNewsFile({ lastCheckedAt: "invalid", articles: [] })).toThrow();
  });
});
