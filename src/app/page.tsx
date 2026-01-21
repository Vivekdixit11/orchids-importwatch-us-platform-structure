'use client';

import { InteractiveGlobe } from '@/components/InteractiveGlobe';
import { DataStream } from '@/components/DataStream';
import { TrustFooter } from '@/components/TrustFooter';
import { ActiveUsersCounter } from '@/components/ActiveUsersCounter';
import { countryHotspots, mockRefusals, mockCompanies, ports, violationCodes } from '@/lib/mock-data';
import { TrendingUp, AlertTriangle, Globe, BarChart3, Building2, MapPin, ArrowRight, Shield, Clock, Database } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function AuditTimestamp({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-600 font-mono">
      <Clock className="h-3 w-3" />
      <span>{label}:</span>
      <span className="text-slate-500 dark:text-zinc-500">{time}</span>
    </div>
  );
}

function LegalTooltip({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  const violation = Object.values(violationCodes).find(v => v.code === code);
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b border-dotted border-amber-500 text-amber-600 dark:text-amber-400 font-medium">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-zinc-900 dark:bg-zinc-950 border-zinc-700 p-4">
          <p className="font-semibold text-white mb-1">{code} - {title}</p>
          <p className="text-xs text-zinc-400 mb-2">
            The article appears to be in violation of FDA import regulations...
          </p>
          <Link href={`/violation/${violation?.slug || ''}`} className="text-xs text-amber-400 hover:text-amber-300">
            Click to read full statute →
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function Dashboard() {
  const totalRefusals = mockRefusals.length * 12;
  const activeAlerts = mockRefusals.filter(r => r.status === 'detained').length;
  const topCountry = countryHotspots[0];
  const companies = Object.values(mockCompanies);
  const highRiskCompanies = companies.filter(c => c.riskGrade === 'F' || c.riskGrade === 'C');

  const now = new Date();
  const lastUpdate = new Date(now.getTime() - 14 * 60 * 1000);
  const lastUpdateStr = `${lastUpdate.getHours().toString().padStart(2, '0')}:${lastUpdate.getMinutes().toString().padStart(2, '0')} EST`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Import Refusal Intelligence
          </h1>
          <p className="mt-1 text-slate-500 dark:text-zinc-500">
            Real-time FDA import alerts and compliance monitoring
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ActiveUsersCounter />
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 border border-slate-200 dark:border-zinc-700">
            <Database className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-500" />
            <span className="text-xs text-slate-600 dark:text-zinc-400">
              Source: FDA IRR • Updated {lastUpdateStr}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-all hover:shadow-lg hover:shadow-red-500/5">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-red-500/10 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">Total Refusals (YTD)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-mono text-slate-900 dark:text-white">{totalRefusals.toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
              <TrendingUp className="h-3 w-3" />
              +12%
            </span>
            <AuditTimestamp label="Calculated" time="14 mins ago" />
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-all hover:shadow-lg hover:shadow-yellow-500/5">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-yellow-500/10 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">Active Detentions</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-mono text-slate-900 dark:text-white">{activeAlerts}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Pending at ports</span>
            <AuditTimestamp label="Live" time="Real-time" />
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-all hover:shadow-lg hover:shadow-amber-500/5">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-amber-500/10 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">Highest Risk Origin</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Globe className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{topCountry.country}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-medium">{topCountry.count} refusals</span>
            <AuditTimestamp label="Source" time="CBP ACE" />
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-all hover:shadow-lg hover:shadow-blue-500/5">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-blue-500/10 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">Companies Tracked</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-mono text-slate-900 dark:text-white">{companies.length}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{highRiskCompanies.length} high risk</span>
            <AuditTimestamp label="Updated" time="06:00 EST" />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <div className="border-b border-slate-200 dark:border-zinc-800 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Global Risk Hotspots</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-500">Interactive 3D visualization • Drag to rotate</p>
              </div>
              <AuditTimestamp label="Data" time="FDA IRR 06:00 EST" />
            </div>
            <div className="p-5">
              <InteractiveGlobe />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <div className="border-b border-slate-200 dark:border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-slate-900 dark:text-white">Top Risk Countries</h2>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {countryHotspots.slice(0, 8).map((hotspot, idx) => (
                  <div key={hotspot.code} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-xs font-bold font-mono text-slate-600 dark:text-zinc-400">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{hotspot.country}</span>
                        <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">{hotspot.count}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                          style={{ width: `${(hotspot.count / countryHotspots[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Major Ports</h3>
            </div>
            <div className="space-y-2">
              {ports.slice(0, 8).map((port, idx) => (
                <div key={port} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-zinc-800/50 px-3 py-2">
                  <span className="text-sm text-slate-700 dark:text-zinc-300">{port}</span>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">High Risk Companies</h3>
            </div>
            <div className="space-y-3">
              {highRiskCompanies.slice(0, 5).map(company => (
                <Link
                  key={company.slug}
                  href={`/company/${company.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/30 px-3 py-2 transition-colors hover:border-amber-500/50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{company.name}</p>
                      {company.riskGrade === 'F' && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded uppercase tracking-wider">
                          High Risk
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">{company.country}</p>
                  </div>
                  <div className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${
                    company.riskGrade === 'F' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {company.riskGrade}
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/companies"
              className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
            >
              View all companies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Refusal Trends by Violation</h3>
              </div>
              <AuditTimestamp label="Updated" time="06:00 EST" />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Adulteration', code: 'Section 801(a)(3)', count: 312, color: 'bg-red-500', slug: '801a3' },
                { name: 'Insanitary Conditions', code: 'Section 402(a)(4)', count: 189, color: 'bg-orange-500', slug: '402a4' },
                { name: 'Misbranding', code: 'Section 801(a)(2)', count: 156, color: 'bg-yellow-500', slug: '801a2' },
                { name: 'Unsafe Additives', code: 'Section 801(a)(1)', count: 98, color: 'bg-amber-500', slug: '801a1' },
                { name: 'Label Issues', code: 'Section 403(i)', count: 67, color: 'bg-emerald-500', slug: '403i' },
              ].map((violation) => (
                <div key={violation.code} className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${violation.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{violation.name}</span>
                        <Link href={`/violation/${violation.slug}`} className="ml-2">
                          <LegalTooltip code={violation.code} title={violation.name}>
                            {violation.code}
                          </LegalTooltip>
                        </Link>
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-700 dark:text-zinc-300">{violation.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                      <div 
                        className={`h-full rounded-full ${violation.color} transition-all duration-500`}
                        style={{ width: `${(violation.count / 312) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Refusals</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-500">Latest FDA import actions • Source: FDA Import Refusal Report (IRR)</p>
          </div>
          <AuditTimestamp label="Updated" time="06:00 EST" />
        </div>
        <DataStream />
      </div>

      <TrustFooter />
    </div>
  );
}
