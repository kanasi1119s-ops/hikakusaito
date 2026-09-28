interface AffiliateCtaProps {
  label: string;
}

/**
 * 将来アフィリエイト提携を行う場合のリンク位置のプレースホルダー。
 * href は "#" のまま、data-affiliate="pending" を付けて未提携であることを示す。
 * 実際の提携先URLは人間の承認・ASP登録後にのみ設定する（運用指示書§1.2）。
 */
export function AffiliateCta({ label }: AffiliateCtaProps) {
  return (
    <a
      href="#"
      className="affiliate-cta affiliate-cta--pending"
      data-affiliate="pending"
      aria-disabled="true"
      title="現在アフィリエイト提携は行っておらず、押しても画面は移動しません。提携後は「PR」表記付きの本リンクに差し替わります。"
      onClick={(event) => event.preventDefault()}
    >
      <span className="affiliate-cta__badge">PR</span>
      <span className="affiliate-cta__label">{label}（準備中）</span>
    </a>
  );
}
