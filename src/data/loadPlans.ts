import plansRaw from "./plans.json";
import { validatePlansFile, type Plan } from "../lib/schema";

const validated = validatePlansFile(plansRaw);

export const DATA_UPDATED_AT: string = validated.dataUpdatedAt;
export const PLANS: Plan[] = validated.plans;

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
