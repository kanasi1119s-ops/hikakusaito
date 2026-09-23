const SELECTED_PARAM = "selected";

export function readSelectedFromUrl(): string[] {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(SELECTED_PARAM);
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function buildShareUrl(selectedIds: string[]): string {
  const url = new URL(window.location.href);
  if (selectedIds.length > 0) {
    url.searchParams.set(SELECTED_PARAM, selectedIds.join(","));
  } else {
    url.searchParams.delete(SELECTED_PARAM);
  }
  return url.toString();
}

export function writeSelectedToUrl(selectedIds: string[]): void {
  const url = buildShareUrl(selectedIds);
  window.history.replaceState(null, "", url);
}
