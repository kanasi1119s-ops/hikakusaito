import { DATA_UPDATED_AT } from "../data/loadPlans";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>データ最終更新日: {DATA_UPDATED_AT}</p>
      <p>
        本サイトは公式サイトの公開情報をもとに作成した非公式の比較サイトです。実際の料金・仕様は必ず各社の公式サイトでご確認ください。
      </p>
    </footer>
  );
}
