import type { BillingCycle } from "./calc";

export interface FilterState {
  requiredFeatures: string[];
  maxPriceUsd: number | null;
  billingCycle: BillingCycle;
  months: number;
  keyword: string;
  category: string;
}

export const DEFAULT_FILTERS: FilterState = {
  requiredFeatures: [],
  maxPriceUsd: null,
  billingCycle: "monthly",
  months: 12,
  keyword: "",
  category: "all",
};

export function applyFilters<T extends Record<string, unknown>>(
  plans: T[],
  filters: FilterState,
): T[] {
  return plans.filter((plan) => {
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase();
      const company = String(plan.company ?? "").toLowerCase();
      const service = String(plan.service ?? "").toLowerCase();
      const planName = String(plan.planName ?? "").toLowerCase();
      if (!company.includes(kw) && !service.includes(kw) && !planName.includes(kw)) {
        return false;
      }
    }

    if (filters.category !== "all" && plan.category !== filters.category) {
      return false;
    }

    for (const feature of filters.requiredFeatures) {
      if (plan[feature] !== true) return false;
    }

    if (filters.maxPriceUsd !== null) {
      const price = Number(plan.priceMonthlyUsd ?? Infinity);
      if (price > filters.maxPriceUsd) return false;
    }

    return true;
  });
}
