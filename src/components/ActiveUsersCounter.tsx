'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export function ActiveUsersCounter() {
  const [count, setCount] = useState(127);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        const newCount = prev + change;
        return Math.max(85, Math.min(165, newCount));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 border border-emerald-200 dark:border-emerald-500/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        {count} importers monitoring cargo now
      </span>
    </div>
  );
}
