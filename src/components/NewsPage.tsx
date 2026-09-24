import { NEWS_ARTICLES, NEWS_LAST_CHECKED_AT } from "../data/loadNews";
import { getPlanById } from "../data/loadPlans";

export function NewsPage() {
  return (
    <section className="news-page">
      <h2>お知らせ</h2>
      <p className="news-page__updated">
        最終確認日: {NEWS_LAST_CHECKED_AT}（毎朝9時頃に、掲載しているAIサービスの料金・仕様に変化がないか確認しています。変化がない日は更新しません）
      </p>

      {NEWS_ARTICLES.length === 0 ? (
        <p>現在、お知らせはありません。</p>
      ) : (
        <ul className="news-page__list">
          {NEWS_ARTICLES.map((article) => (
            <li key={article.id} className="news-article">
              <p className="news-article__date">{article.date}</p>
              <h3 className="news-article__title">{article.title}</h3>
              <p className="news-article__body">{article.body}</p>
              {article.relatedServices.length > 0 ? (
                <p className="news-article__related">
                  関連プラン:{" "}
                  {article.relatedServices.map((id, i) => {
                    const plan = getPlanById(id);
                    return (
                      <span key={id}>
                        {i > 0 ? "、" : ""}
                        {plan ? `${plan.service}（${plan.planName}）` : id}
                      </span>
                    );
                  })}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
