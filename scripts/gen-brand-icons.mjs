// 掲載企業のブランドアイコン(simple-icons, CC0)から、使うものだけを src/data/brandIcons.json に書き出す。
import * as si from "simple-icons";
import { readFileSync, writeFileSync } from "node:fs";

const plans = JSON.parse(readFileSync("src/data/plans.json", "utf-8")).plans;
const MAP = {
  OpenAI: "openai", Anthropic: "anthropic", Google: "google", Microsoft: "microsoft", Meta: "meta",
  "Perplexity AI": "perplexity", xAI: "x", "Mistral AI": "mistralai", "Adobe Inc.": "adobe",
  "Canva Pty Ltd": "canva", "Notion Labs, Inc.": "notion", "GitHub, Inc.（Microsoft）": "github",
  "Amazon Web Services, Inc.": "amazonaws", "Grammarly Inc.": "grammarly", "Zoom Communications, Inc.": "zoom",
  "Vercel Inc.": "vercel", "JetBrains s.r.o.": "jetbrains", "Replit, Inc.": "replit", "ElevenLabs": "elevenlabs",
  "Midjourney, Inc.": "midjourney", "Asana, Inc.": "asana", ClickUp: "clickup", "Doist Inc.": "todoist",
  "Miro (RealtimeBoard, Inc.)": "miro", "monday.com Ltd.": "mondaydotcom", "Airtable, Inc. (a Salesforce company)": "airtable",
  "Salesforce, Inc. (Slack Technologies)": "slack", Quora: "quora", "Quizlet, Inc.": "quizlet",
  "Framer B.V.": "framer", "Coursera, Inc.": "coursera", "Khan Academy": "khanacademy", "Semrush Inc.": "semrush",
  "Stability AI (Clipdrop)": "stabilityai", ByteDance: "bytedance", Alibaba: "alibabadotcom", "Chegg, Inc.": "chegg",
  "StackBlitz, Inc.": "stackblitz", "Wolfram Research, Inc.": "wolfram", "Freepik Company": "freepik",
  "Course Hero, Inc.(Learneo)": "coursehero", Coda: "coda", "Hugging Face": "huggingface",
  "Cognition AI, Inc.（Windsurf）": "windsurf", "Anysphere, Inc.": "cursor", "Zhipu AI（智譜AI）": "zhipu",
};
const out = {};
for (const c of new Set(plans.map((p) => p.company))) {
  const slug = MAP[c];
  if (!slug) continue;
  const key = "si" + slug[0].toUpperCase() + slug.slice(1);
  const i = si[key];
  if (i) out[c] = { path: i.path, hex: "#" + i.hex, title: i.title };
  else console.warn("見つからない:", c, key);
}
writeFileSync("src/data/brandIcons.json", JSON.stringify(out, null, 1) + "\n", "utf-8");
console.log(Object.keys(out).length, "社分を出力");
