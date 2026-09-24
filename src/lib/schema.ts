import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式である必要があります");

export const CATEGORY_VALUES = [
  "general_chat",
  "search_focused",
  "office_integrated",
  "coding_assistant",
  "image_generation",
  "video_generation",
  "audio_music_generation",
  "writing_marketing",
  "meeting_transcription",
  "productivity_office",
  "design_presentation",
  "research_education",
] as const;

export const PlanSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  service: z.string().min(1),
  planName: z.string().min(1),
  category: z.enum(CATEGORY_VALUES),
  descriptionJa: z.string().min(1),
  popularityTier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  mainModel: z.string().min(1).nullable(),
  priceMonthlyUsd: z.number().nonnegative().nullable(),
  priceAnnualMonthlyUsd: z.number().nonnegative().nullable(),
  priceAnnualTotalUsd: z.number().nonnegative().nullable(),
  hasFreeTier: z.boolean(),
  webSearch: z.boolean().nullable(),
  deepResearch: z.boolean().nullable(),
  imageGeneration: z.boolean().nullable(),
  videoGeneration: z.boolean().nullable(),
  agentFeature: z.boolean().nullable(),
  apiIncluded: z.boolean().nullable(),
  teamPlanAvailable: z.boolean().nullable(),
  usageNote: z.string().min(1),
  sourceUrl: z.string().url(),
  checkedAt: dateString,
  note: z.string().min(1),
});

export const ExchangeRateSchema = z.object({
  jpyPerUsd: z.number().positive(),
  asOf: dateString,
  sourceUrl: z.string().url(),
  note: z.string().min(1),
});

export const PlansFileSchema = z.object({
  dataUpdatedAt: dateString,
  exchangeRate: ExchangeRateSchema,
  plans: z.array(PlanSchema).min(1),
});

export type Plan = z.infer<typeof PlanSchema>;
export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;
export type PlansFile = z.infer<typeof PlansFileSchema>;

export function validatePlansFile(data: unknown): PlansFile {
  return PlansFileSchema.parse(data);
}
