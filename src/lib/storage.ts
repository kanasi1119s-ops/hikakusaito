const FAVORITES_KEY = "hikakusaito.favorites.v1";
const CONDITIONS_KEY = "hikakusaito.conditions.v1";

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // ブラウザのストレージが使えない環境では保存をあきらめる（表示は継続）
  }
}

export interface SavedConditions {
  requiredFeatures: string[];
  maxPriceUsd: number | null;
  billingCycle: "monthly" | "annual";
}

export function loadConditions(): SavedConditions | null {
  try {
    const raw = localStorage.getItem(CONDITIONS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedConditions;
  } catch {
    return null;
  }
}

export function saveConditions(conditions: SavedConditions): void {
  try {
    localStorage.setItem(CONDITIONS_KEY, JSON.stringify(conditions));
  } catch {
    // 保存できない場合は無視する
  }
}

export interface BackupData {
  favorites: string[];
  conditions: SavedConditions | null;
  exportedAt: string;
}

export function buildBackup(): BackupData {
  return {
    favorites: loadFavorites(),
    conditions: loadConditions(),
    exportedAt: new Date().toISOString(),
  };
}

export function restoreBackup(data: unknown): BackupData {
  if (
    typeof data !== "object" ||
    data === null ||
    !("favorites" in data) ||
    !Array.isArray((data as { favorites: unknown }).favorites)
  ) {
    throw new Error("バックアップファイルの形式が正しくありません。");
  }
  const backup = data as BackupData;
  saveFavorites(backup.favorites);
  if (backup.conditions) saveConditions(backup.conditions);
  return backup;
}
