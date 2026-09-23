import type { Plan } from "../lib/schema";
import { AXES } from "../data/axes";

interface CompareViewProps {
  plans: Plan[];
  onRemove: (id: string) => void;
}

function cellValue(plan: Plan, key: string): { text: string; raw: unknown } {
  const raw = (plan as unknown as Record<string, unknown>)[key];
  if (raw === null || raw === undefined) return { text: "—（未確認）", raw };
  if (typeof raw === "boolean") return { text: raw ? "○ あり" : "× なし", raw };
  return { text: String(raw), raw };
}

export function CompareView({ plans, onRemove }: CompareViewProps) {
  if (plans.length === 0) {
    return (
      <p className="compare-view__empty">
        比較表の「比較」列にチェックを入れると、ここに横並びで表示されます（最大4件）。
      </p>
    );
  }

  return (
    <div className="compare-view">
      <div className="compare-view__cards">
        {plans.map((plan) => (
          <div key={plan.id} className="compare-card">
            <button
              type="button"
              className="compare-card__remove"
              onClick={() => onRemove(plan.id)}
              aria-label={`${plan.service} ${plan.planName} を比較から外す`}
            >
              ×
            </button>
            <h3>{plan.service}</h3>
            <p className="compare-card__plan-name">{plan.planName}</p>
            <p className="compare-card__company">{plan.company}</p>
          </div>
        ))}
      </div>

      <table className="compare-table">
        <tbody>
          {AXES.map((axis) => {
            const values = plans.map((p) => cellValue(p, axis.key));
            const allSame = values.every((v) => v.text === values[0].text);
            return (
              <tr key={axis.key} className={allSame ? "" : "compare-table__diff"}>
                <th scope="row">{axis.label}</th>
                {values.map((v, i) => (
                  <td key={plans[i].id}>{v.text}</td>
                ))}
              </tr>
            );
          })}
          <tr>
            <th scope="row">出典・確認日</th>
            {plans.map((plan) => (
              <td key={plan.id}>
                <a href={plan.sourceUrl} target="_blank" rel="noopener noreferrer">
                  出典
                </a>
                <div>{plan.checkedAt}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="compare-view__note">差がある項目は背景色で強調表示しています。</p>
    </div>
  );
}
