'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockCompanies } from '@/lib/mock-data';
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkCheck, Trash2, Building2, AlertTriangle } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlistSlugs, setWatchlistSlugs] = useState<string[]>([]);

  useEffect(() => {
    setWatchlistSlugs(getWatchlist());
  }, []);

  const handleRemove = (slug: string) => {
    removeFromWatchlist(slug);
    setWatchlistSlugs(getWatchlist());
  };

  const watchlistCompanies = watchlistSlugs
    .map(slug => mockCompanies[slug])
    .filter(Boolean);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
          <BookmarkCheck className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Your Watchlist</h1>
          <p className="text-sm text-zinc-500">
            {watchlistCompanies.length} companies tracked
          </p>
        </div>
      </div>

      {watchlistCompanies.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30">
          <Building2 className="h-12 w-12 text-zinc-700" />
          <h2 className="mt-4 text-lg font-semibold text-white">No Companies Tracked</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-zinc-500">
            Start tracking companies by clicking the "Track" button on any company profile page.
          </p>
          <Link href="/">
            <Button className="mt-6 bg-amber-500 text-black hover:bg-amber-400">
              Browse Companies
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {watchlistCompanies.map(company => (
            <div
              key={company.slug}
              className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <Link href={`/company/${company.slug}`}>
                  <h3 className="font-semibold text-white group-hover:text-amber-500">
                    {company.name}
                  </h3>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(company.slug)}
                  className="h-8 w-8 text-zinc-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="mt-1 text-sm text-zinc-500">{company.country}</p>
              
              <div className="mt-4 flex items-center gap-3">
                <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ${
                  company.riskGrade === 'F' ? 'bg-red-500/10' :
                  company.riskGrade === 'C' ? 'bg-orange-500/10' :
                  company.riskGrade === 'B' ? 'bg-yellow-500/10' : 'bg-green-500/10'
                }`}>
                  <div className={`h-2 w-2 rounded-full ${
                    company.riskGrade === 'F' ? 'bg-red-500' :
                    company.riskGrade === 'C' ? 'bg-orange-500' :
                    company.riskGrade === 'B' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className={`text-xs font-medium ${
                    company.riskGrade === 'F' ? 'text-red-400' :
                    company.riskGrade === 'C' ? 'text-orange-400' :
                    company.riskGrade === 'B' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    Grade {company.riskGrade}
                  </span>
                </div>
                <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                  {company.totalRefusals} refusals
                </Badge>
              </div>

              {company.totalRefusals > 10 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-500">
                  <AlertTriangle className="h-3 w-3" />
                  High risk supplier
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
