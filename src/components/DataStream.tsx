'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { mockRefusals, Refusal } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  detained: { icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10', label: 'Detained' },
  refused: { icon: Shield, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Refused' },
  released: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10', label: 'Released' },
};

export function DataStream() {
  const [visibleRefusals, setVisibleRefusals] = useState<Refusal[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setVisibleRefusals(mockRefusals.slice(0, pageSize));
  }, []);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    
    setTimeout(() => {
      const nextPage = page + 1;
      const allData = [...mockRefusals, ...mockRefusals, ...mockRefusals];
      const newItems = allData.slice(0, nextPage * pageSize);
      setVisibleRefusals(newItems);
      setPage(nextPage);
      setLoading(false);
    }, 500);
  }, [page, loading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement;
      const scrolledToBottom = scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 200;
      
      if (scrolledToBottom && !loading) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loading]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Date</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Status</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Importer</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Origin</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Product</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Violation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRefusals.map((refusal, idx) => {
            const StatusIcon = statusConfig[refusal.status].icon;
            return (
              <TableRow 
                key={`${refusal.id}-${idx}`}
                className="cursor-pointer border-slate-100 dark:border-zinc-800/50 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/30"
              >
                <TableCell className="font-mono text-sm text-slate-600 dark:text-zinc-400">
                  {format(new Date(refusal.date), 'MMM dd')}
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${statusConfig[refusal.status].bg}`}>
                    <StatusIcon className={`h-3.5 w-3.5 ${statusConfig[refusal.status].color}`} />
                    <span className={`text-xs font-semibold ${statusConfig[refusal.status].color}`}>
                      {statusConfig[refusal.status].label}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/company/${refusal.importerSlug}`}
                    className="font-medium text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {refusal.importerName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 font-normal text-slate-600 dark:text-zinc-400">
                    {refusal.originCountry}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-slate-600 dark:text-zinc-400">
                  <Link href={`/report/${refusal.id}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    {refusal.productDescription}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/violation/${refusal.violationSlug}`}
                    className="text-sm font-medium text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    {refusal.violationCode}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {loading && (
        <div className="flex items-center justify-center border-t border-slate-200 dark:border-zinc-800 py-4 bg-slate-50 dark:bg-zinc-800/30">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          <span className="ml-2 text-sm text-slate-500 dark:text-zinc-500">Loading more...</span>
        </div>
      )}
    </div>
  );
}
