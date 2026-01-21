'use client';

import { Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 md:hidden shadow-lg">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 border-slate-300 dark:border-zinc-700 py-5"
        >
          <Bell className="mr-2 h-4 w-4" />
          Alert Me
        </Button>
        <Button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-5"
        >
          <Zap className="mr-2 h-4 w-4" />
          Fix This Refusal
        </Button>
      </div>
    </div>
  );
}
