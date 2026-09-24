import { useMemo, useState } from "react";
import type { Plan } from "../lib/schema";
import { estimateTotalCostUsd, usdToJpy, type BillingCycle } from "../lib/calc";
import { formatUsd, formatJpy } from "../lib/currency";
import { CATEGORY_LABELS } from "../data/axes";

interface PlanTableProps {
  plans: Plan[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  billingCycle: BillingCycle;
  months: number;
  jpyPerUsd: number;
}

type SortKey = "priceMonthlyUsd" | "company" | "service" | "popularityTier";

function renderBool(value: boolean | null): string {
  if (value === null) return "—（未確認）";
  return value ? "○" : "×";
}

function popularityLabel(tier: 1 | 2 | 3): string {
  if (tier === 1) return "★★★";
  if (tier === 2) return "★★";
  return "★";
}

export function PlanTable({
  plans,
  favorites,
  onToggleFavorite,
  selectedIds,
  onToggleSelect,
  billingCycle,
  months,
  jpyPerUsd,
}: PlanTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("popularityTier");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...plans];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else if (av === null) {
        cmp = bv === null ? 0 : 1;
      } else if (bv === null) {
        cmp = -1;
      } else {
        cmp = String(av).localeCompare(String(bv), "en");
      }
      if (cmp === 0) {
        cmp = a.service.localeCompare(b.service, "en");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [plans, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function sortIndicator(key: SortKey): string {
    return sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  }

  if (plans.length === 0) {
    return <p className="plan-table__empty">条件に一致するプランがありません。絞り込み条件を減らしてみてください。</p>;
  }

  return (
    <div className="plan-table__wrapper">
      <table className="plan-table">
        <thead>
          <tr>
            <th scope="col">比較</th>
            <th scope="col">お気に入り</th>
            <th scope="col">
              <button type="button" onClick={() => handleSort("company")}>会社{sortIndicator("company")}</button>
            </th>
            <th scope="col">
              <button type="button" onClick={() => handleSort("service")}>サービス / プラン（アルファベット順）{sortIndicator("service")}</button>
            </th>
            <th scope="col">分野</th>
            <th scope="col">
              <button type="button" onClick={() => handleSort("popularityTier")}>知名度の目安{sortIndicator("popularityTier")}</button>
            </th>
            <th scope="col">
              <button type="button" onClick={() => handleSort("priceMonthlyUsd")}>月額（月払い・USD）{sortIndicator("priceMonthlyUsd")}</button>
            </th>
            <th scope="col">月額（円換算）</th>
            <th scope="col">{months}か月試算（USD）</th>
            <th scope="col">無料枠</th>
            <th scope="col">Web検索</th>
            <th scope="col">調査機能</th>
            <th scope="col">画像生成</th>
            <th scope="col">動画生成</th>
            <th scope="col">エージェント</th>
            <th scope="col">出典・確認日</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((plan) => {
            const estimate = estimateTotalCostUsd(plan, billingCycle, months);
            const monthlyJpy = plan.priceMonthlyUsd === null ? null : usdToJpy(plan.priceMonthlyUsd, jpyPerUsd);
            return (
              <tr key={plan.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`${plan.service} ${plan.planName} を横並び比較に追加`}
                    checked={selectedIds.includes(plan.id)}
                    disabled={!selectedIds.includes(plan.id) && selectedIds.length >= 4}
                    onChange={() => onToggleSelect(plan.id)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className={`fav-btn${favorites.includes(plan.id) ? " is-active" : ""}`}
                    aria-pressed={favorites.includes(plan.id)}
                    aria-label={`${plan.service} ${plan.planName} をお気に入り${favorites.includes(plan.id) ? "から外す" : "に追加"}`}
                    onClick={() => onToggleFavorite(plan.id)}
                  >
                    {favorites.includes(plan.id) ? "★" : "☆"}
                  </button>
                </td>
                <td>{plan.company}</td>
                <td>
                  <div className="plan-table__service">{plan.service}</div>
                  <div className="plan-table__plan-name">{plan.planName}</div>
                  <div className="plan-table__description">{plan.descriptionJa}</div>
                </td>
                <td>{CATEGORY_LABELS[plan.category] ?? plan.category}</td>
                <td title="編集部による大まかな知名度の目安であり、実際の利用者数調査ではありません">{popularityLabel(plan.popularityTier)}</td>
                <td>{formatUsd(plan.priceMonthlyUsd)}</td>
                <td>{formatJpy(monthlyJpy)}</td>
                <td>{formatUsd(estimate)}</td>
                <td>{plan.hasFreeTier ? "○" : "×"}</td>
                <td>{renderBool(plan.webSearch)}</td>
                <td>{renderBool(plan.deepResearch)}</td>
                <td>{renderBool(plan.imageGeneration)}</td>
                <td>{renderBool(plan.videoGeneration)}</td>
                <td>{renderBool(plan.agentFeature)}</td>
                <td>
                  <a href={plan.sourceUrl} target="_blank" rel="noopener noreferrer">
                    出典
                  </a>
                  <div className="plan-table__checked-at">確認日: {plan.checkedAt}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
