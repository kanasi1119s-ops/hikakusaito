// 毎朝実行される、Gemini API(Web検索つき)を使った料金変化の自動チェックスクリプト。
//
// 全149件を毎日調べるとAPI費用がかさむため、日付に応じて約15件ずつ
// ローテーションして確認する(全件を約10日で一巡)。
// 「価格が変わった」とモデルが高い確信度(confidence: "high")で判断したものだけを
// 反映し、それ以外(確信度が低いもの・変化なしと判断したもの)は何もしない。
//
// このスクリプト自体はデータやニュース記事を直接mainブランチへコミットしない。
// 呼び出し元のGitHub Actionsワークフローが、変化を検知した場合のみ
// 新しいブランチを切ってコミット・プルリクエストを作成する想定。

import { readFileSync, writeFileSync } from "node:fs";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("GOOGLE_API_KEY が設定されていません。");
  process.exit(1);
}

const MODEL = "gemini-flash-latest";
const BATCH_SIZE = 15;
const TODAY = new Date().toISOString().slice(0, 10);

const plansPath = "src/data/plans.json";
const newsPath = "src/data/news.json";

const plansFile = JSON.parse(readFileSync(plansPath, "utf-8"));
const newsFile = JSON.parse(readFileSync(newsPath, "utf-8"));

function dayOfYear(date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

const totalBatches = Math.ceil(plansFile.plans.length / BATCH_SIZE);
const batchIndex = dayOfYear(new Date()) % totalBatches;
const batch = plansFile.plans.slice(batchIndex * BATCH_SIZE, batchIndex * BATCH_SIZE + BATCH_SIZE);

console.log(
  `全${plansFile.plans.length}件中、今日は ${batch.length}件（バッチ ${batchIndex + 1}/${totalBatches}）を確認します。`,
);

async function checkPlan(plan) {
  const prompt = `あなたはAIサービスの料金調査アシスタントです。以下のサービスについて、Web検索を使って公式サイトの最新の料金ページを確認し、記録されている情報と現在の情報を比較してください。

会社名: ${plan.company}
サービス名: ${plan.service}
プラン名: ${plan.planName}
出典URL: ${plan.sourceUrl}
記録されている月額料金(米ドル): ${plan.priceMonthlyUsd ?? "不明"}
記録されている年払い時の月額料金(米ドル): ${plan.priceAnnualMonthlyUsd ?? "不明"}
前回確認日: ${plan.checkedAt}

出典URL、またはそれが見つからない場合は公式サイトの料金ページを検索して確認してください。
回答は、説明文やMarkdownの装飾を一切含めず、次の形式のJSONオブジェクト1つだけを出力してください。

{"changed": true または false, "newPriceMonthlyUsd": 数値またはnull, "newPriceAnnualMonthlyUsd": 数値またはnull, "summaryJa": "日本語で1〜2文の変化の要約（変化がない場合は空文字）", "confidence": "high" または "medium" または "low"}

- 公式情報で明確に金額の変更を確認できた場合のみ changed を true にし、confidence を "high" にしてください。
- 情報が古い・見つからない・不確かな場合は confidence を "low" または "medium" にしてください。
- 分からない金額は null にしてください。推測で埋めないでください。`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
      }),
    },
  );

  if (!res.ok) {
    console.warn(`  [警告] ${plan.id}: APIエラー ${res.status}`);
    return null;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn(`  [警告] ${plan.id}: JSON形式の応答を取得できませんでした。`);
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    console.warn(`  [警告] ${plan.id}: JSON解析に失敗しました。`);
    return null;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const confirmedChanges = [];

for (const plan of batch) {
  console.log(`確認中: ${plan.service} ${plan.planName} (${plan.id})`);
  let result;
  try {
    result = await checkPlan(plan);
  } catch (err) {
    console.warn(`  [警告] ${plan.id}: 呼び出し失敗 - ${err instanceof Error ? err.message : String(err)}`);
  }

  if (result && result.changed === true && result.confidence === "high") {
    confirmedChanges.push({ plan, result });
    console.log(`  → 変化を検知: ${result.summaryJa}`);
  } else {
    console.log("  → 変化なし、または確信度が低いため見送り");
  }

  await sleep(1000);
}

if (confirmedChanges.length === 0) {
  console.log("本日確認した範囲では、確信度の高い変化は見つかりませんでした。");
  writeFileSync("check-news-result.json", JSON.stringify({ changed: false }, null, 2));
  process.exit(0);
}

for (const { plan, result } of confirmedChanges) {
  const target = plansFile.plans.find((p) => p.id === plan.id);
  if (!target) continue;
  if (typeof result.newPriceMonthlyUsd === "number") {
    target.priceMonthlyUsd = result.newPriceMonthlyUsd;
  }
  if (typeof result.newPriceAnnualMonthlyUsd === "number") {
    target.priceAnnualMonthlyUsd = result.newPriceAnnualMonthlyUsd;
    target.priceAnnualTotalUsd = Math.round(result.newPriceAnnualMonthlyUsd * 12 * 100) / 100;
  }
  target.checkedAt = TODAY;
  target.note = `${target.note}\n[${TODAY}自動チェック] Gemini APIによるWeb検索で変化を検知（要人間確認）: ${result.summaryJa}`;
}

newsFile.lastCheckedAt = TODAY;
newsFile.articles.unshift({
  id: `${TODAY}-auto-check`,
  date: TODAY,
  title: `料金変更の可能性を検知しました（${confirmedChanges.length}件、要確認）`,
  body: confirmedChanges
    .map(({ plan, result }) => `【${plan.service} ${plan.planName}】${result.summaryJa}`)
    .join("\n"),
  relatedServices: confirmedChanges.map(({ plan }) => plan.id),
});

writeFileSync(plansPath, JSON.stringify(plansFile, null, 2) + "\n", "utf-8");
writeFileSync(newsPath, JSON.stringify(newsFile, null, 2) + "\n", "utf-8");
writeFileSync(
  "check-news-result.json",
  JSON.stringify({ changed: true, count: confirmedChanges.length }, null, 2),
);

console.log(`${confirmedChanges.length}件の変化を反映しました。プルリクエスト作成のため終了します。`);
