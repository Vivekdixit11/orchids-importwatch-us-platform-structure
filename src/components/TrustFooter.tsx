'use client';

import { Shield, Lock, Scale, FileCheck, BadgeCheck } from 'lucide-react';

export function TrustFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-12">
      <div className="px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4">
            Data Sources & Compliance
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                <span className="text-[8px] font-bold text-white leading-none">FDA</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">FDA</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Official Source</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600">
                <span className="text-[8px] font-bold text-white leading-none">CBP</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">CBP</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Customs Data</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600">
                <FileCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">IRR Database</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Import Refusal Reports</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 dark:text-zinc-600">
            Data sourced directly from FDA Import Refusal Reports (IRR) & CBP ACE databases. Updated every 6 hours.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4">
            Security & Compliance
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 border border-emerald-200 dark:border-emerald-500/20">
              <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">256-Bit SSL</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 border border-blue-200 dark:border-blue-500/20">
              <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">GDPR Compliant</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-500/10 px-3 py-1.5 border border-violet-200 dark:border-violet-500/20">
              <BadgeCheck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">SOC2 Type II Ready</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 border border-amber-200 dark:border-amber-500/20">
              <Shield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">CCPA Compliant</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-4">
            Legal Partners & Associations
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800">
              <Scale className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">ABA</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">American Bar Association</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800">
              <Scale className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">AILA</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Immigration Lawyers Assoc.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800">
              <Scale className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">NCBFAA</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Customs Brokers & Forwarders</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 dark:text-zinc-600">
            Our legal partners are verified members of these professional associations.
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-zinc-800 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">ImportWatch.us</p>
              <p className="text-xs text-slate-500 dark:text-zinc-500">© 2024 All rights reserved. Trade Intelligence Platform.</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-500">
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400">Privacy Policy</a>
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400">Terms of Service</a>
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400">API Documentation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
