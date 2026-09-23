export type AxisType = "text" | "price" | "boolean" | "boolean-null";

export interface AxisDef {
  key: string;
  label: string;
  type: AxisType;
  unit?: string;
  description: string;
}

export const AXES: AxisDef[] = [
  { key: "company", label: "提供会社", type: "text", description: "サービスを提供している会社名。" },
  { key: "service", label: "サービス名", type: "text", description: "AIアシスタントのサービス名。" },
  { key: "planName", label: "プラン名", type: "text", description: "サービス内でのプラン名。" },
  { key: "priceMonthlyUsd", label: "月額料金（月払い）", type: "price", unit: "USD/月", description: "毎月払いを選んだ場合の月額料金（米ドル）。" },
  { key: "priceAnnualMonthlyUsd", label: "月額料金（年払い時）", type: "price", unit: "USD/月", description: "年払いを選んだ場合に割った月あたりの料金（米ドル）。年払いが無い場合は「—」。" },
  { key: "hasFreeTier", label: "無料プランの有無", type: "boolean", description: "同じサービス内に無料で使えるプランがあるか。" },
  { key: "webSearch", label: "Web検索・ブラウジング", type: "boolean-null", description: "最新のWeb情報を検索して回答に使う機能があるか。" },
  { key: "deepResearch", label: "高度な調査機能", type: "boolean-null", description: "複数の情報源を自動で調べて長いレポートを作る「Deep Research」的な機能があるか。" },
  { key: "imageGeneration", label: "画像生成", type: "boolean-null", description: "文章から画像を作る機能があるか。" },
  { key: "videoGeneration", label: "動画生成", type: "boolean-null", description: "文章から動画を作る機能があるか。" },
  { key: "agentFeature", label: "自動操作エージェント機能", type: "boolean-null", description: "AIが複数の作業を自動でまとめて実行してくれる機能（エージェント機能）があるか。" },
  { key: "apiIncluded", label: "API利用がプランに含まれるか", type: "boolean", description: "開発者向けAPIの利用がこの月額プランの料金に含まれているか（多くの場合、別料金）。" },
  { key: "teamPlanAvailable", label: "チーム・法人プランの有無", type: "boolean", description: "同じサービスに、チームや会社向けのプランが別途あるか。" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  general_chat: "汎用AIチャット",
  search_focused: "検索特化",
  office_integrated: "オフィス統合",
};
