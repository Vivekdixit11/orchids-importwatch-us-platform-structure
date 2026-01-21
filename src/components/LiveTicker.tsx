'use client';

import { mockRefusals } from '@/lib/mock-data';
import Link from 'next/link';
import { AlertTriangle, Radio } from 'lucide-react';
import Marquee from 'react-fast-marquee';

export function LiveTicker() {
  const recentRefusals = mockRefusals.slice(0, 5);

  return (
    <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex items-center">
        <div className="flex items-center gap-2 border-r border-slate-200 dark:border-zinc-800 bg-red-50 dark:bg-red-500/10 px-4 py-2.5">
          <Radio className="h-3 w-3 text-red-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Live</span>
        </div>
        <Marquee speed={40} className="py-2.5" pauseOnHover gradient gradientColor="white" gradientWidth={50}>
          {recentRefusals.map((refusal, idx) => (
            <Link
              key={refusal.id}
              href={`/report/${refusal.id}`}
              className="mx-8 flex items-center gap-2 text-sm group"
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${
                refusal.status === 'refused' ? 'text-red-500' : 
                refusal.status === 'detained' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <span className="font-medium text-slate-700 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {refusal.importerName}
              </span>
              <span className="text-slate-400 dark:text-zinc-500">—</span>
              <span className="text-amber-600 dark:text-amber-500">{refusal.violationCode}</span>
              <span className="text-slate-300 dark:text-zinc-600">|</span>
            </Link>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
