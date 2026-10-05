import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  FileSearch,
  KeyRound,
  Plus,
  Search,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useGetFoundItemStats, useListFoundItems } from "@workspace/api-client-react";
import { FoundItemRow } from "@/components/found-item";

function StatCard({
  icon,
  label,
  value,
  detail,
  live = true,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  live?: boolean;
  accent: string;
}) {
  return (
    <article className={`stat-card ${accent}`}>
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-demo">{live ? "LIVE" : "PENDING"}</span>
      </div>
      <div className="stat-bottom">
        <div><p>{label}</p><small>{detail}</small></div>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default function Dashboard({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const itemsQuery = useListFoundItems({ q: debouncedQuery || undefined, limit: 3, offset: 0 });
  const statsQuery = useGetFoundItemStats();
  const items = itemsQuery.data ?? [];

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  return (
    <div className="dashboard">
      <div className="page-topline">
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>Dashboard</b></div>
        <span className="sample-tag"><span /> LIVE DATA</span>
      </div>

      <section className="welcome-row">
        <div>
          <p className="eyebrow">A SHARED CAMPUS BOARD <span className="eyebrow-rule" /></p>
          <h1>Good things find<br className="mobile-break" /> their way <em>back.</em></h1>
          <p className="intro">A shared place for the Mapúa community to reconnect with misplaced things.</p>
        </div>
        <button className="primary-button report-cta" onClick={() => onNavigate("/report")} data-testid="button-report-item">
          <Plus size={18} /> Report an item <ArrowRight size={16} />
        </button>
      </section>

      <section className="notice-banner" aria-label="Public listing notice">
        <span className="notice-icon"><ShieldCheck size={19} /></span>
        <p><b>Reports are saved to the campus board</b><span>Listings are visible to visitors. Keep contact details and private verification clues out of descriptions.</span></p>
        <span className="notice-label">SAVED RECORDS</span>
      </section>

      <section className="stat-grid" aria-label="Found-item statistics">
        <StatCard
          icon={<FileSearch size={18} />}
          label="Items reported"
          value={statsQuery.isLoading ? "…" : statsQuery.data ? String(statsQuery.data.totalItems) : "—"}
          detail={statsQuery.isError ? "Unable to load totals" : "Saved found-item reports"}
          accent="red"
        />
        <StatCard
          icon={<KeyRound size={18} />}
          label="Waiting to be claimed"
          value={statsQuery.isLoading ? "…" : statsQuery.data ? String(statsQuery.data.availableItems) : "—"}
          detail={statsQuery.isError ? "Unable to load totals" : "Items marked available"}
          accent="gold"
        />
        <StatCard
          icon={<ArrowDownRight size={18} />}
          label="Reunited this month"
          value="—"
          detail="Claims are not connected yet"
          live={false}
          accent="green"
        />
      </section>

      <div className="content-columns">
        <section className="items-panel">
          <div className="section-heading">
            <div><p className="section-kicker">THE COMMUNITY BOARD</p><h2>Recently found</h2></div>
            <button className="text-action" onClick={() => onNavigate("/browse")}>Browse all <ArrowRight size={15} /></button>
          </div>
          <div className="item-tools">
            <label className="search-box">
              <Search size={17} />
              <input
                type="search"
                aria-label="Search saved found items"
                placeholder="Search by item, category, or place..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                data-testid="input-search-items"
              />
            </label>
            <button className="filter-button" onClick={() => setQuery("")} data-testid="button-clear-search"><Tag size={15} /> Clear</button>
          </div>
          <div className="items-list" aria-live="polite">
            {itemsQuery.isLoading && <div className="list-state">Loading saved listings…</div>}
            {itemsQuery.isError && <div className="list-state error-state">Could not load listings. Try again in a moment.</div>}
            {!itemsQuery.isLoading && !itemsQuery.isError && items.length === 0 && (
              <div className="empty-search">
                <Search size={21} />
                <b>{debouncedQuery ? "No saved items match that search." : "No items have been reported yet."}</b>
                <span>{debouncedQuery ? "Try another name, category, or campus location." : "Report the first found item to start the campus board."}</span>
              </div>
            )}
            {items.map((item) => <FoundItemRow key={item.id} item={item} onSelect={() => onNavigate("/browse")} />)}
          </div>
          <div className="list-footnote"><span className="tiny-demo-dot" /> Listings are shared with visitors to this board.</div>
        </section>

        <aside className="right-rail">
          <section className="quick-card">
            <div className="quick-heading"><span className="quick-mark"><BriefcaseBusiness size={17} /></span><div><p className="section-kicker">START HERE</p><h2>What can we help with?</h2></div></div>
            <button className="quick-link" onClick={() => onNavigate("/browse")}>
              <span className="quick-link-icon"><Search size={16} /></span><span><b>Find something</b><small>Search saved listings</small></span><ArrowRight size={15} />
            </button>
            <button className="quick-link" onClick={() => onNavigate("/report")}>
              <span className="quick-link-icon gold-icon"><Plus size={17} /></span><span><b>Report something found</b><small>Save a campus listing</small></span><ArrowRight size={15} />
            </button>
            <button className="quick-link" onClick={() => onNavigate("/claims")}>
              <span className="quick-link-icon"><KeyRound size={15} /></span><span><b>Check a claim</b><small>Claims area not connected</small></span><ArrowRight size={15} />
            </button>
          </section>
          <section className="custody-card">
            <div className="custody-top"><span className="custody-icon"><ShieldCheck size={18} /></span><span className="custody-status">NEXT STEP</span></div>
            <h2>Every handoff<br />should feel certain.</h2>
            <p>Claims and custody tracking can be added once campus sign-in is in place.</p>
            <button onClick={() => onNavigate("/custody")}>Explore custody log <ArrowRight size={15} /></button>
            <div className="custody-ornament" aria-hidden="true"><span /><span /><span /></div>
          </section>
          <div className="privacy-note"><ShieldCheck size={15} /><span>Do not post serial numbers, student IDs, contact information, or private claim clues.</span></div>
        </aside>
      </div>
      <footer className="page-footer"><span>Mapúa Findr <span className="footer-separator">/</span> Campus lost &amp; found</span><span>Built for a more thoughtful campus community.</span></footer>
    </div>
  );
}
