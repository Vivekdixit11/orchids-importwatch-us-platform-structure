'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  BookmarkCheck, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Globe,
  AlertTriangle,
  Scale,
  Building2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockCompanies, mockRefusals, violationCodes } from '@/lib/mock-data';
import { getWatchlist } from '@/lib/watchlist';
import { ThemeToggle } from '@/components/ThemeToggle';

interface SearchResult {
  type: 'company' | 'refusal' | 'violation';
  title: string;
  subtitle: string;
  href: string;
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [watchlistSlugs, setWatchlistSlugs] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setWatchlistSlugs(getWatchlist());
  }, [pathname]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    Object.values(mockCompanies).forEach(company => {
      if (company.name.toLowerCase().includes(query)) {
        results.push({
          type: 'company',
          title: company.name,
          subtitle: company.country,
          href: `/company/${company.slug}`,
        });
      }
    });

    mockRefusals.forEach(refusal => {
      if (refusal.productDescription.toLowerCase().includes(query)) {
        results.push({
          type: 'refusal',
          title: refusal.productDescription,
          subtitle: refusal.importerName,
          href: `/report/${refusal.id}`,
        });
      }
    });

    Object.values(violationCodes).forEach(violation => {
      if (violation.code.toLowerCase().includes(query) || violation.title.toLowerCase().includes(query)) {
        results.push({
          type: 'violation',
          title: violation.code,
          subtitle: violation.title,
          href: `/violation/${violation.slug}`,
        });
      }
    });

    setSearchResults(results.slice(0, 8));
  }, [searchQuery]);

  const navItems = [
    { icon: Activity, label: 'Live Feed', href: '/' },
    { icon: Building2, label: 'Companies', href: '/companies' },
    { icon: BookmarkCheck, label: 'Watchlist', href: '/watchlist' },
  ];

  const watchlistCompanies = watchlistSlugs
    .map(slug => mockCompanies[slug])
    .filter(Boolean);

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 p-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                ImportWatch<span className="text-amber-500">.us</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Globe className="h-4 w-4 text-white" />
              </div>
            </Link>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {collapsed && (
          <div className="p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="w-full text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!collapsed && (
          <div className="border-b border-slate-200 dark:border-zinc-800 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <Input
                placeholder="Search companies, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 pl-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
                {searchResults.map((result, idx) => (
                  <Link
                    key={idx}
                    href={result.href}
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 px-3 py-2 last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    {result.type === 'company' && <Globe className="h-4 w-4 text-blue-500" />}
                    {result.type === 'refusal' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {result.type === 'violation' && <Scale className="h-4 w-4 text-amber-500" />}
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{result.title}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-zinc-500">{result.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 shadow-sm' 
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && watchlistCompanies.length > 0 && (
          <div className="border-t border-slate-200 dark:border-zinc-800 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              Tracked Companies
            </h3>
            <ScrollArea className="h-32">
              {watchlistCompanies.map(company => (
                <Link
                  key={company.slug}
                  href={`/company/${company.slug}`}
                  className="flex items-center gap-2 rounded py-1.5 text-sm text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
                >
                  <div className={`h-2 w-2 rounded-full ${
                    company.riskGrade === 'F' ? 'bg-red-500' :
                    company.riskGrade === 'C' ? 'bg-orange-500' :
                    company.riskGrade === 'B' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="truncate">{company.name}</span>
                </Link>
              ))}
            </ScrollArea>
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <p className="text-xs text-slate-500 dark:text-zinc-600">
                FDA Import Alerts
              </p>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}
