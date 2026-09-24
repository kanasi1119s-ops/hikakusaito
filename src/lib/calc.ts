import type { Plan } from "./schema";

export type BillingCycle = "monthly" | "annual";

/**
 * 指定した支払いサイクル・利用月数での概算合計金額（米ドル）を返す。
 * 年払いが提供されていないプランで annual を指定した場合は月払い金額で計算する。
 * 月額料金が未確認（null）のプランは null を返す。
 */
export function estimateTotalCostUsd(
  plan: Plan,
  billingCycle: BillingCycle,
  months: number,
): number | null {
  if (months <= 0) return 0;

  if (billingCycle === "annual" && plan.priceAnnualMonthlyUsd !== null) {
    return round2(plan.priceAnnualMonthlyUsd * months);
  }

  if (plan.priceMonthlyUsd === null) return null;
  return round2(plan.priceMonthlyUsd * months);
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function usdToJpy(usd: number, jpyPerUsd: number): number {
  return Math.round(usd * jpyPerUsd);
}
