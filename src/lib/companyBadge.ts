// 実際の企業ロゴ・商標画像は無断使用のリスクがあるため掲載しない方針
// （docs/legal/CHECKLIST.md 参照）。代わりに、会社名から機械的に生成した
// イニシャル入りの色付きバッジを表示し、一覧性を高める。

// 末尾の "." の有無・内部の "." のゆらぎ（例: "s.r.o." / "s r o"）を吸収する
// ため、判定時は各トークンからピリオドを取り除いた上でこの集合と比較する。
const SUFFIXES = new Set([
  "inc",
  "llc",
  "ltd",
  "gmbh",
  "corp",
  "corporation",
  "co",
  "company",
  "pty",
  "pte",
  "ag",
  "kg",
  "bv",
  "aps",
  "sro",
  "technologies",
  "labs",
  "lab",
  "software",
]);

// アクセシビリティ配慮（白文字で十分なコントラストが出る程度に暗め）の
// カテゴリカルパレット。会社名のハッシュ値でこの中から決定的に選ぶ。
const PALETTE = [
  "#2b5fd9",
  "#8a2be2",
  "#1f8a70",
  "#c2410c",
  "#0891b2",
  "#be123c",
  "#4d7c0f",
  "#7c3aed",
  "#0f766e",
  "#b45309",
  "#4338ca",
  "#a21caf",
  "#065f46",
  "#9333ea",
  "#b91c1c",
  "#0e7490",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function coreCompanyName(company: string): string {
  return company.split(/[（(]/u)[0]?.trim() ?? company;
}

export function companyInitials(company: string): string {
  const core = coreCompanyName(company);
  const tokens = core
    .split(/[\s,]+/u)
    .map((t) => t.replace(/\.+$/u, ""))
    .filter((t) => t.length > 0 && !SUFFIXES.has(t.toLowerCase().replace(/\./gu, "")));

  if (tokens.length === 0) {
    return core.slice(0, 2).toUpperCase() || "?";
  }
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return (tokens[0][0] + tokens[1][0]).toUpperCase();
}

export function companyColor(company: string): string {
  const core = coreCompanyName(company);
  return PALETTE[hashString(core) % PALETTE.length];
}

export interface CompanyBadge {
  initials: string;
  color: string;
}

export function getCompanyBadge(company: string): CompanyBadge {
  return { initials: companyInitials(company), color: companyColor(company) };
}
