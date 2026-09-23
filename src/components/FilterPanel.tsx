import type { FilterState } from "../lib/filters";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

const FEATURE_OPTIONS: { key: string; label: string }[] = [
  { key: "webSearch", label: "Web検索・ブラウジングができる" },
  { key: "deepResearch", label: "高度な調査機能（Deep Research）がある" },
  { key: "imageGeneration", label: "画像生成ができる" },
  { key: "videoGeneration", label: "動画生成ができる" },
  { key: "agentFeature", label: "自動操作エージェント機能がある" },
  { key: "hasFreeTier", label: "無料プランがある" },
];

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function toggleFeature(key: string) {
    const has = filters.requiredFeatures.includes(key);
    const next = has
      ? filters.requiredFeatures.filter((f) => f !== key)
      : [...filters.requiredFeatures, key];
    onChange({ ...filters, requiredFeatures: next });
  }

  return (
    <section className="filter-panel" aria-label="絞り込み条件">
      <h2 className="filter-panel__title">条件で絞り込む</h2>

      <div className="filter-panel__row">
        <label htmlFor="keyword-filter">サービス名・会社名で検索</label>
        <input
          id="keyword-filter"
          type="text"
          value={filters.keyword}
          onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
          placeholder="例: Claude"
        />
      </div>

      <fieldset className="filter-panel__row">
        <legend>必要な機能</legend>
        {FEATURE_OPTIONS.map((opt) => (
          <label key={opt.key} className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={filters.requiredFeatures.includes(opt.key)}
              onChange={() => toggleFeature(opt.key)}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      <div className="filter-panel__row">
        <label htmlFor="max-price">上限予算（月払い換算・米ドル）</label>
        <input
          id="max-price"
          type="number"
          min={0}
          step={1}
          value={filters.maxPriceUsd ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              maxPriceUsd: e.target.value === "" ? null : Number(e.target.value),
            })
          }
          placeholder="指定しない場合は空欄"
        />
      </div>

      <div className="filter-panel__row filter-panel__row--calc">
        <span className="filter-panel__legend">自分の条件で試算する</span>
        <label>
          支払い方法
          <select
            value={filters.billingCycle}
            onChange={(e) =>
              onChange({ ...filters, billingCycle: e.target.value as "monthly" | "annual" })
            }
          >
            <option value="monthly">月払い</option>
            <option value="annual">年払い（対応プランのみ）</option>
          </select>
        </label>
        <label>
          利用予定の月数
          <input
            type="number"
            min={1}
            max={60}
            value={filters.months}
            onChange={(e) => onChange({ ...filters, months: Number(e.target.value) || 1 })}
          />
        </label>
      </div>
    </section>
  );
}
