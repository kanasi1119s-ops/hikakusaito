// アフィリエイトリンク設定（実リンクは人間がASP提携後に設定する）。
// url が null の間は何も表示されず、外部への通信やリンクも発生しない。
export const AFFILIATE_LINKS: Record<string, string | null> = {
  // 例: "chatgpt-plus": "https://example.com/aff/xxxx",
};

export function getAffiliateUrl(planId: string): string | null {
  const url = AFFILIATE_LINKS[planId];
  if (!url || !/^https:\/\//.test(url)) return null;
  return url;
}

export function hasAnyAffiliate(): boolean {
  return Object.keys(AFFILIATE_LINKS).some((id) => getAffiliateUrl(id) !== null);
}
