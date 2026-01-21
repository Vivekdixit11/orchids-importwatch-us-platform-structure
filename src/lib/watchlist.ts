'use client';

const WATCHLIST_KEY = 'importwatch_watchlist';

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToWatchlist(companySlug: string): void {
  const list = getWatchlist();
  if (!list.includes(companySlug)) {
    list.push(companySlug);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  }
}

export function removeFromWatchlist(companySlug: string): void {
  const list = getWatchlist().filter(slug => slug !== companySlug);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function isInWatchlist(companySlug: string): boolean {
  return getWatchlist().includes(companySlug);
}
