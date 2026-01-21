'use client';

import { CheckCircle, TrendingUp } from 'lucide-react';
import Marquee from 'react-fast-marquee';

const savedCargoWins = [
  { company: 'Seafood Shipment', port: 'Newark', amount: 45000 },
  { company: 'Electronics Container', port: 'Long Beach', amount: 120000 },
  { company: 'Pharmaceutical Batch', port: 'Miami', amount: 89000 },
  { company: 'Textile Cargo', port: 'Los Angeles', amount: 67000 },
  { company: 'Agricultural Products', port: 'Houston', amount: 34000 },
  { company: 'Medical Devices', port: 'San Francisco', amount: 156000 },
  { company: 'Food Products', port: 'Boston', amount: 78000 },
  { company: 'Chemical Shipment', port: 'Seattle', amount: 92000 },
];

export function WinsTicker() {
  return (
    <div className="border-b border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/30">
      <div className="flex items-center">
        <div className="flex items-center gap-2 border-r border-emerald-200 dark:border-emerald-900/30 bg-emerald-100 dark:bg-emerald-900/50 px-4 py-2">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Recent Wins</span>
        </div>
        <Marquee speed={35} className="py-2" pauseOnHover gradient={false}>
          {savedCargoWins.map((win, idx) => (
            <div
              key={idx}
              className="mx-6 flex items-center gap-2 text-sm"
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium text-emerald-700 dark:text-emerald-300">
                {win.company}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Released at {win.port}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                (Saved ${win.amount.toLocaleString()})
              </span>
              <span className="text-emerald-400 dark:text-emerald-600">•</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
