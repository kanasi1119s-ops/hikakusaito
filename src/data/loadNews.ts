import newsRaw from "./news.json";
import { validateNewsFile, type NewsArticle } from "../lib/newsSchema";

const validated = validateNewsFile(newsRaw);

export const NEWS_LAST_CHECKED_AT: string = validated.lastCheckedAt;
export const NEWS_ARTICLES: NewsArticle[] = [...validated.articles].sort((a, b) =>
  b.date.localeCompare(a.date),
);
