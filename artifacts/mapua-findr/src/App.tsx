import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  Bookmark,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileSearch,
  MapPin,
  Menu,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import DashboardPage from '@/pages/dashboard';
import BrowseItemsPage from '@/pages/browse-items';
import ReportItemPage from '@/pages/report-item';

const queryClient = new QueryClient();

const navigation = [
  { label: 'Dashboard', href: '/', icon: ClipboardList },
  { label: 'Browse Items', href: '/browse', icon: FileSearch },
  { label: 'Report Item', href: '/report', icon: Plus },
  { label: 'My Claims', href: '/claims', icon: Bookmark },
  { label: 'Custody Log', href: '/custody', icon: ShieldCheck },
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
          <span className="demo-indicator"><span /> Live records</span>
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
                {label === 'Browse Items' && <span className="nav-count">LIVE</span>}
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
          {location === '/' ? (
            <DashboardPage onNavigate={goTo} />
          ) : location === '/browse' ? (
            <BrowseItemsPage />
          ) : location === '/report' ? (
            <ReportItemPage onNavigate={goTo} />
          ) : (
            <PlaceholderPage title={current?.label ?? routeTitle(location)} onBack={() => goTo('/')} />
          )}
        </main>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, onBack }: { title: string; onBack: () => void }) {
  const descriptions: Record<string, string> = {
    'My Claims': 'Claim verification and claim status are not connected yet.',
    'Custody Log': 'Item handoffs are not tracked yet.',
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
