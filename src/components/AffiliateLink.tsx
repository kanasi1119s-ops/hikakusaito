import { getAffiliateUrl } from "../lib/affiliate";

// 提携前（URL未設定）は何も描画しない。設定後は「PR」表記つきの広告リンクとして表示する。
export function AffiliateLink({ planId }: { planId: string }) {
  const url = getAffiliateUrl(planId);
  if (!url) return null;
  return (
    <span className="affiliate">
      <span className="pr-badge">PR</span>
      <a href={url} target="_blank" rel="sponsored noopener noreferrer" data-affiliate="active">
        公式サイトで申し込む（広告）
      </a>
    </span>
  );
}
