import { useEffect, useState, type ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useListFoundItems } from "@workspace/api-client-react";
import type { FoundItemInputCategory } from "@workspace/api-client-react";
import { FoundItemRow } from "@/components/found-item";

const PAGE_SIZE = 20;
const categories: FoundItemInputCategory[] = [
  "Electronics",
  "Personal items",
  "School supplies",
  "Clothing & accessories",
  "Keys & cards",
  "Other",
];

export default function BrowseItemsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<FoundItemInputCategory | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setOffset(0);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const itemsQuery = useListFoundItems({
    q: debouncedQuery || undefined,
    category: category || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    limit: PAGE_SIZE + 1,
    offset,
  });
  const result = itemsQuery.data ?? [];
  const hasNextPage = result.length > PAGE_SIZE;
  const items = result.slice(0, PAGE_SIZE);

  const changeDateRange = (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    setOffset(0);
  };
  const changeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value as FoundItemInputCategory | "");
    setOffset(0);
  };

  return (
    <div className="browse-page">
      <div className="page-topline">
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>Browse Items</b></div>
        <span className="sample-tag"><span /> SAVED LISTINGS</span>
      </div>
      <header className="section-heading browse-heading">
        <div><p className="section-kicker">THE COMMUNITY BOARD</p><h1>Browse found items</h1></div>
      </header>
      <p className="browse-intro">Search by item, category, description, or campus location. Filter by the date it was found.</p>
      <div className="browse-filters">
        <label className="search-box">
          <Search size={17} />
          <input type="search" aria-label="Search found items" placeholder="Search saved listings..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="date-filter"><span>Found from</span><input type="date" value={dateFrom} onChange={changeDateRange(setDateFrom)} /></label>
        <label className="date-filter"><span>Found to</span><input type="date" value={dateTo} onChange={changeDateRange(setDateTo)} /></label>
        <label className="date-filter">
          <span>Category</span>
          <select value={category} onChange={changeCategory}>
            <option value="">All categories</option>
            {categories.map((itemCategory) => (
              <option key={itemCategory} value={itemCategory}>{itemCategory}</option>
            ))}
          </select>
        </label>
        <button
          className="filter-button"
          onClick={() => { setQuery(""); setCategory(""); setDateFrom(""); setDateTo(""); setOffset(0); }}
        >
          Clear
        </button>
      </div>
      <section className="browse-results" aria-live="polite">
        <div className="browse-results-heading">
          <h2>{itemsQuery.isLoading ? "Loading listings…" : "Found-item listings"}</h2>
          {!itemsQuery.isLoading && !itemsQuery.isError && <span>{items.length} on this page</span>}
        </div>
        {itemsQuery.isError && <div className="list-state error-state">Could not load listings. Check your connection and try again.</div>}
        {!itemsQuery.isLoading && !itemsQuery.isError && items.length === 0 && (
          <div className="empty-search">
            <Search size={21} />
            <b>No saved items match these filters.</b>
            <span>Try a different search or date range.</span>
          </div>
        )}
        {items.map((item) => <FoundItemRow key={item.id} item={item} />)}
      </section>
      <nav className="pagination" aria-label="Listing pages">
        <button className="filter-button" disabled={offset === 0 || itemsQuery.isLoading} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
          <ArrowLeft size={15} /> Previous
        </button>
        <span>Page {Math.floor(offset / PAGE_SIZE) + 1}</span>
        <button className="filter-button" disabled={!hasNextPage || itemsQuery.isLoading} onClick={() => setOffset(offset + PAGE_SIZE)}>
          Next <ArrowRight size={15} />
        </button>
      </nav>
    </div>
  );
}
