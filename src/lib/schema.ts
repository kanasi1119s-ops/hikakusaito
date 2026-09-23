import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式である必要があります");

export const PlanSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  service: z.string().min(1),
  planName: z.string().min(1),
  category: z.enum(["general_chat", "search_focused", "office_integrated"]),
  mainModel: z.string().min(1),
  priceMonthlyUsd: z.number().nonnegative(),
  priceAnnualMonthlyUsd: z.number().nonnegative().nullable(),
  priceAnnualTotalUsd: z.number().nonnegative().nullable(),
  hasFreeTier: z.boolean(),
  webSearch: z.boolean().nullable(),
  deepResearch: z.boolean().nullable(),
  imageGeneration: z.boolean().nullable(),
  videoGeneration: z.boolean().nullable(),
  agentFeature: z.boolean().nullable(),
  apiIncluded: z.boolean(),
  teamPlanAvailable: z.boolean(),
  usageNote: z.string().min(1),
  sourceUrl: z.string().url(),
  checkedAt: dateString,
  note: z.string().min(1),
});

export const PlansFileSchema = z.object({
  dataUpdatedAt: dateString,
  plans: z.array(PlanSchema).min(1),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlansFile = z.infer<typeof PlansFileSchema>;

export function validatePlansFile(data: unknown): PlansFile {
  return PlansFileSchema.parse(data);
}
