import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  FileSearch,
  KeyRound,
  MapPin,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();

const navigation = [
  { label: 'Dashboard', href: '/', icon: ClipboardList },
  { label: 'Browse Items', href: '/browse', icon: FileSearch },
  { label: 'Report Item', href: '/report', icon: Plus },
  { label: 'My Claims', href: '/claims', icon: Bookmark },
  { label: 'Custody Log', href: '/custody', icon: ShieldCheck },
];

const sampleItems = [
  { name: 'Black wireless earbuds', category: 'Electronics', location: 'Library — 2nd floor', when: 'Today, 10:42 AM', marker: 'E', tone: 'rose' },
  { name: 'Blue student ID holder', category: 'Personal items', location: 'Cardinal Cafe', when: 'Today, 9:18 AM', marker: 'ID', tone: 'gold' },
  { name: 'Graphing calculator', category: 'School supplies', location: 'South Building — Room 304', when: 'Yesterday, 4:06 PM', marker: 'C', tone: 'blue' },
];

function AppShell() {
  const [location, setLocation] = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const current = navigation.find((item) => item.href === location);

  const goTo = (path: string) => {
    setLocation(path);
    setMobileMenu(false);
  };

  return (
    <div className="app-frame">
      <header className="topbar">
        <button className="mobile-menu" aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)} data-testid="button-toggle-navigation">
          {mobileMenu ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Link href="/" className="brand" aria-label="Mapúa Findr dashboard">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-name">Mapúa <b>Findr</b></span>
        </Link>
        <div className="topbar-right">
          <span className="demo-indicator"><span /> Prototype preview</span>
          <button className="icon-button notification-button" aria-label="Notifications unavailable in prototype" title="Notifications are not available in this prototype" disabled data-testid="button-notifications">
            <Bell size={18} /><i />
          </button>
          <div className="profile">
            <div className="profile-avatar">MF</div>
            <div className="profile-copy"><b>Mapúa community</b><span>Guest preview</span></div>
            <ChevronDown size={15} className="profile-chevron" />
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`} aria-label="Main navigation">
          <div className="sidebar-section-label">WORKSPACE</div>
          <nav className="nav-list">
            {navigation.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenu(false)}
                className={`nav-link ${location === href ? 'active' : ''}`}
                aria-current={location === href ? 'page' : undefined}
                data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {label === 'Browse Items' && <span className="nav-count">DEMO</span>}
              </Link>
            ))}
          </nav>
          <div className="sidebar-divider" />
          <div className="sidebar-section-label">YOUR CAMPUS</div>
          <button className="campus-switcher" title="Campus selection is a prototype placeholder" disabled data-testid="button-campus-selector">
            <span className="campus-pin"><MapPin size={16} /></span>
            <span><b>Intramuros</b><small>Manila campus</small></span>
            <ChevronDown size={15} className="campus-chevron" />
          </button>
          <div className="sidebar-spacer" />
          <div className="help-card">
            <span className="help-icon"><CircleHelp size={18} /></span>
            <b>Keep it safe.</b>
            <p>Verify an item privately before arranging a handoff.</p>
            <button onClick={() => goTo('/guidelines')} className="help-link" data-testid="button-view-guidelines">
              View guidelines <ArrowRight size={14} />
            </button>
          </div>
          <div className="sidebar-foot">MAPÚA UNIVERSITY <span>•</span> FINDR PREVIEW</div>
        </aside>

        {mobileMenu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}

        <main className="main-content">
          {location === '/' ? <Dashboard onNavigate={goTo} /> : <PlaceholderPage title={current?.label ?? routeTitle(location)} onBack={() => goTo('/')} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = sampleItems.filter((item) => `${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="dashboard">
      <div className="page-topline">
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>Dashboard</b></div>
        <span className="sample-tag"><span /> DEMO CONTENT</span>
      </div>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">A SHARED CAMPUS BOARD <span className="eyebrow-rule" /></p>
          <h1>Good things find<br className="mobile-break" /> their way <em>back.</em></h1>
          <p className="intro">A shared place for the Mapúa community to reconnect with misplaced things.</p>
        </div>
        <button className="primary-button report-cta" onClick={() => onNavigate('/report')} data-testid="button-report-item">
          <Plus size={18} /> Report an item <ArrowRight size={16} />
        </button>
      </section>

      <section className="notice-banner" aria-label="Prototype notice">
        <span className="notice-icon"><ShieldCheck size={19} /></span>
        <p><b>Prototype preview</b><span>Items and numbers below are sample content only. Nothing here is a live report or claim.</span></p>
        <span className="notice-label">SAMPLE DATA</span>
      </section>

      <section className="stat-grid" aria-label="Sample dashboard statistics">
        <StatCard icon={<FileSearch size={18} />} label="Items reported" value="24" detail="Sample records" accent="red" />
        <StatCard icon={<KeyRound size={18} />} label="Waiting to be claimed" value="08" detail="Sample records" accent="gold" />
        <StatCard icon={<ArrowDownRight size={18} />} label="Reunited this month" value="16" detail="Sample records" accent="green" />
      </section>

      <div className="content-columns">
        <section className="items-panel">
          <div className="section-heading">
            <div><p className="section-kicker">THE COMMUNITY BOARD</p><h2>Recently found</h2></div>
            <button className="text-action" onClick={() => onNavigate('/browse')} data-testid="button-browse-all">Browse all <ArrowRight size={15} /></button>
          </div>
          <div className="item-tools">
            <label className="search-box">
              <Search size={17} />
              <input type="search" aria-label="Search sample found items" placeholder="Search sample items..." value={query} onChange={(event) => setQuery(event.target.value)} data-testid="input-search-items" />
              <kbd>⌘ K</kbd>
            </label>
            <button className="filter-button" onClick={() => setQuery('')} data-testid="button-clear-search"><Tag size={15} /> Clear</button>
          </div>
          <div className="items-list">
            {filtered.map((item, index) => (
              <article className="item-row" key={item.name} data-testid={`card-sample-item-${index}`}>
                <div className={`item-symbol ${item.tone}`}>{item.marker}</div>
                <div className="item-info">
                  <div className="item-title-line"><h3>{item.name}</h3><span className="found-pill">FOUND</span></div>
                  <div className="item-meta"><span><MapPin size={13} />{item.location}</span><i /> <span><Clock3 size={13} />{item.when}</span></div>
                </div>
                <span className="category-label">{item.category}</span>
                <button className="item-arrow" aria-label={`View sample details for ${item.name}`} onClick={() => onNavigate('/browse')} data-testid={`button-view-sample-${index}`}><ArrowRight size={17} /></button>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="empty-search"><Search size={21} /><b>No sample items match that search.</b><span>Try a different item name, category, or place.</span></div>
            )}
          </div>
          <div className="list-footnote"><span className="tiny-demo-dot" /> All listings shown are illustrative demo content</div>
        </section>

        <aside className="right-rail">
          <section className="quick-card">
            <div className="quick-heading"><span className="quick-mark"><BriefcaseBusiness size={17} /></span><div><p className="section-kicker">START HERE</p><h2>What can we help with?</h2></div></div>
            <button className="quick-link" onClick={() => onNavigate('/browse')} data-testid="button-find-something">
              <span className="quick-link-icon"><Search size={16} /></span><span><b>Find something</b><small>Look through sample listings</small></span><ArrowRight size={15} />
            </button>
            <button className="quick-link" onClick={() => onNavigate('/report')} data-testid="button-report-found">
              <span className="quick-link-icon gold-icon"><Plus size={17} /></span><span><b>Report something found</b><small>See the reporting prototype</small></span><ArrowRight size={15} />
            </button>
            <button className="quick-link" onClick={() => onNavigate('/claims')} data-testid="button-check-claim">
              <span className="quick-link-icon"><Bookmark size={15} /></span><span><b>Check a claim</b><small>Preview the claims area</small></span><ArrowRight size={15} />
            </button>
          </section>
          <section className="custody-card">
            <div className="custody-top"><span className="custody-icon"><ShieldCheck size={18} /></span><span className="custody-status">PROTOTYPE</span></div>
            <h2>Every handoff<br />should feel certain.</h2>
            <p>Custody tracking is designed to keep each item's next step clear and accountable.</p>
            <button onClick={() => onNavigate('/custody')} data-testid="button-explore-custody">Explore custody log <ArrowRight size={15} /></button>
            <div className="custody-ornament" aria-hidden="true"><span /><span /><span /></div>
          </section>
          <div className="privacy-note"><ShieldCheck size={15} /><span>Personal details should stay private. Arrange handoffs through official campus channels.</span></div>
        </aside>
      </div>
      <footer className="page-footer"><span>Mapúa Findr <span className="footer-separator">/</span> Campus lost &amp; found</span><span>Built for a more thoughtful campus community.</span></footer>
    </div>
  );
}

function StatCard({ icon, label, value, detail, accent }: { icon: ReactNode; label: string; value: string; detail: string; accent: string }) {
  return (
    <article className={`stat-card ${accent}`} data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="stat-top"><span className="stat-icon">{icon}</span><span className="stat-demo">SAMPLE</span></div>
      <div className="stat-bottom"><div><p>{label}</p><small>{detail}</small></div><strong>{value}</strong></div>
    </article>
  );
}

function PlaceholderPage({ title, onBack }: { title: string; onBack: () => void }) {
  const descriptions: Record<string, string> = {
    'Browse Items': 'A searchable view of found-item listings will live here.',
    'Report Item': 'A guided form for documenting an item found on campus will live here.',
    'My Claims': 'A private view of claim activity will live here.',
    'Custody Log': 'A clear record of item handoffs will live here.',
    'Keep it safe': 'Practical guidance for safe, respectful item handoffs will live here.',
  };
  return (
    <div className="placeholder-page">
      <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>{title}</b></div>
      <span className="sample-tag"><span /> PROTOTYPE AREA</span>
      <div className="placeholder-content">
        <div className="placeholder-icon"><ClipboardList size={25} /></div>
        <p className="section-kicker">MAPÚA FINDR PREVIEW</p>
        <h1>{title}</h1>
        <p>{descriptions[title] ?? 'This part of the campus lost-and-found prototype is not built yet.'}</p>
        <div className="prototype-callout"><ShieldCheck size={18} /><span>This is a navigation placeholder. It does not connect to live records or submit information.</span></div>
        <button onClick={onBack} className="primary-button" data-testid="button-return-dashboard">Return to dashboard <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function routeTitle(path: string) {
  return path === '/guidelines' ? 'Keep it safe' : 'Prototype area';
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary resetKey={window.location.pathname}>
            <Switch><Route path="/" component={AppShell} /><Route component={AppShell} /></Switch>
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
