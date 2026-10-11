// 各プランの出典URLに接続し、掲載価格($)がページ内に現れるかを確認する。
// 使い方: node scripts/verify-sources.mjs [プランIDの一部...]
// 接続できない場合（外向き通信の許可リスト外）は「接続不可」と表示するだけで、回避はしない。
import { readFileSync } from "node:fs";

const plans = JSON.parse(readFileSync("src/data/plans.json", "utf-8")).plans;
const filters = process.argv.slice(2);
const targets = plans.filter((p) => filters.length === 0 || filters.some((f) => p.id.includes(f)));
const cache = new Map();

async function fetchText(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) })
        .then(async (r) => (r.ok ? (await r.text()).replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ") : `HTTP ${r.status}`))
        .catch(() => null),
    );
  }
  return cache.get(url);
}

const results = { ok: 0, notFound: 0, unreachable: 0 };
for (const p of targets) {
  const text = await fetchText(p.sourceUrl);
  if (text === null || /^HTTP \d+$/.test(text)) {
    results.unreachable += 1;
    console.log(`接続不可  ${p.id}  ${p.sourceUrl} ${text ?? ""}`);
    continue;
  }
  const price = p.priceMonthlyUsd;
  const hit = price === null || price === 0 || new RegExp(`\\$\\s?${String(price).replace(".", "\\.")}(?!\\d)`).test(text);
  if (hit) results.ok += 1;
  else results.notFound += 1;
  console.log(`${hit ? "一致    " : "要確認  "}  ${p.id}  掲載値 $${price}  ${p.sourceUrl}`);
}
console.log(`\n一致 ${results.ok} / 価格がページに見つからない ${results.notFound} / 接続不可 ${results.unreachable}`);
console.log("※『一致』は掲載価格の文字列がページ内にあるという意味です。プラン名との対応は目視で確認してください。");
