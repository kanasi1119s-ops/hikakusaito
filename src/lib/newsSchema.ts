import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式である必要があります");

export const NewsArticleSchema = z.object({
  id: z.string().min(1),
  date: dateString,
  title: z.string().min(1),
  body: z.string().min(1),
  relatedServices: z.array(z.string()),
});

export const NewsFileSchema = z.object({
  lastCheckedAt: dateString,
  articles: z.array(NewsArticleSchema),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type NewsFile = z.infer<typeof NewsFileSchema>;

export function validateNewsFile(data: unknown): NewsFile {
  return NewsFileSchema.parse(data);
}
