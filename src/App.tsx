import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Header, type View } from "./components/Header";
import { Footer } from "./components/Footer";
import { FilterPanel } from "./components/FilterPanel";
import { DEFAULT_FILTERS, applyFilters, type FilterState } from "./lib/filters";
import { PlanTable } from "./components/PlanTable";
import { CompareView } from "./components/CompareView";
import { ExportBar } from "./components/ExportBar";
import { AboutPage } from "./components/AboutPage";
import { HowToPage } from "./components/HowToPage";
import { NewsPage } from "./components/NewsPage";
import { PLANS, EXCHANGE_RATE } from "./data/loadPlans";
import { loadFavorites, saveFavorites, loadConditions, saveConditions } from "./lib/storage";
import { readSelectedFromUrl, writeSelectedToUrl, buildShareUrl } from "./lib/share";

function App() {
  const [view, setView] = useState<View>("list");
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [selectedIds, setSelectedIds] = useState<string[]>(() => readSelectedFromUrl());
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = loadConditions();
    return saved ? { ...DEFAULT_FILTERS, ...saved } : DEFAULT_FILTERS;
  });

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    saveConditions({
      requiredFeatures: filters.requiredFeatures,
      maxPriceUsd: filters.maxPriceUsd,
      billingCycle: filters.billingCycle,
      months: filters.months,
      keyword: filters.keyword,
      category: filters.category,
    });
  }, [filters]);

  useEffect(() => {
    writeSelectedToUrl(selectedIds);
  }, [selectedIds]);

  const filteredPlans = useMemo(
    () => applyFilters(PLANS as unknown as Record<string, unknown>[], filters) as unknown as typeof PLANS,
    [filters],
  );

  const selectedPlans = useMemo(
    () => selectedIds.map((id) => PLANS.find((p) => p.id === id)).filter((p): p is (typeof PLANS)[number] => !!p),
    [selectedIds],
  );

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  function handleRestored() {
    setFavorites(loadFavorites());
    const saved = loadConditions();
    if (saved) setFilters({ ...DEFAULT_FILTERS, ...saved });
  }

  return (
    <div className="app">
      <Header view={view} onChangeView={setView} compareCount={selectedIds.length} />
      <main className="app__main">
        {view === "list" ? (
          <>
            <FilterPanel filters={filters} onChange={setFilters} />
            <ExportBar
              visiblePlans={filteredPlans}
              shareUrl={buildShareUrl(selectedIds)}
              onImported={handleRestored}
              jpyPerUsd={EXCHANGE_RATE.jpyPerUsd}
            />
            <p className="exchange-rate-note">
              為替レート: {EXCHANGE_RATE.asOf}時点 1USD=¥{EXCHANGE_RATE.jpyPerUsd.toFixed(2)}（毎日変動します。実際のご請求額はカード会社のレートによります）
            </p>
            <PlanTable
              plans={filteredPlans}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              billingCycle={filters.billingCycle}
              months={filters.months}
              jpyPerUsd={EXCHANGE_RATE.jpyPerUsd}
            />
          </>
        ) : null}

        {view === "compare" ? (
          <CompareView plans={selectedPlans} onRemove={toggleSelect} jpyPerUsd={EXCHANGE_RATE.jpyPerUsd} />
        ) : null}

        {view === "news" ? <NewsPage /> : null}
        {view === "about" ? <AboutPage /> : null}
        {view === "howto" ? <HowToPage /> : null}
      </main>
      <Footer />
    </div>
  );
}

export default App;
