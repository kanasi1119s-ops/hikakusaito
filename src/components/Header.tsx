export type View = "list" | "compare" | "about" | "howto";

interface HeaderProps {
  view: View;
  onChangeView: (view: View) => void;
  compareCount: number;
}

const NAV_ITEMS: { key: View; label: string }[] = [
  { key: "list", label: "比較表" },
  { key: "compare", label: "横並び比較" },
  { key: "howto", label: "使い方" },
  { key: "about", label: "このサイトについて" },
];

export function Header({ view, onChangeView, compareCount }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <h1 className="site-header__title">AI月額プラン比較</h1>
        <nav className="site-header__nav" aria-label="ページ切り替え">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`site-header__nav-btn${view === item.key ? " is-active" : ""}`}
              onClick={() => onChangeView(item.key)}
            >
              {item.label}
              {item.key === "compare" && compareCount > 0 ? (
                <span className="site-header__badge">{compareCount}</span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
