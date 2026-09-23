import { useMemo, useState } from "react";
import type { Plan } from "../lib/schema";
import { estimateTotalCostUsd, type BillingCycle } from "../lib/calc";
import { CATEGORY_LABELS } from "../data/axes";

interface PlanTableProps {
  plans: Plan[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  billingCycle: BillingCycle;
  months: number;
}

type SortKey = "priceMonthlyUsd" | "company" | "service";

function renderBool(value: boolean | null): string {
  if (value === null) return "—（未確認）";
  return value ? "○" : "×";
}

export function PlanTable({
  plans,
  favorites,
  onToggleFavorite,
  selectedIds,
  onToggleSelect,
  billingCycle,
  months,
}: PlanTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("priceMonthlyUsd");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...plans];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), "ja");
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
              <button type="button" onClick={() => handleSort("company")}>会社{sortKey === "company" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}</button>
            </th>
            <th scope="col">
              <button type="button" onClick={() => handleSort("service")}>サービス / プラン{sortKey === "service" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}</button>
            </th>
            <th scope="col">分類</th>
            <th scope="col">
              <button type="button" onClick={() => handleSort("priceMonthlyUsd")}>月額（月払い）{sortKey === "priceMonthlyUsd" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}</button>
            </th>
            <th scope="col">{months}か月試算</th>
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
          {sorted.map((plan) => (
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
              </td>
              <td>{CATEGORY_LABELS[plan.category] ?? plan.category}</td>
              <td>${plan.priceMonthlyUsd.toFixed(2)}</td>
              <td>${estimateTotalCostUsd(plan, billingCycle, months).toFixed(2)}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
