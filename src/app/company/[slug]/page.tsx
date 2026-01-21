'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockCompanies, mockRefusals } from '@/lib/mock-data';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist';
import { CorrectionModal } from '@/components/CorrectionModal';
import { SmartText } from '@/components/SmartText';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff,
  Plus,
  Minus,
  ExternalLink,
  Flag,
  Building2,
  Users,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';

const riskGradeConfig = {
  A: { color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', bgLight: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Low Risk' },
  B: { color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400', bgLight: 'bg-yellow-50 dark:bg-yellow-500/10', label: 'Moderate Risk' },
  C: { color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400', bgLight: 'bg-orange-50 dark:bg-orange-500/10', label: 'High Risk' },
  F: { color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', bgLight: 'bg-red-50 dark:bg-red-500/10', label: 'Critical Risk' },
};

export default function CompanyProfile() {
  const params = useParams();
  const slug = params.slug as string;
  const company = mockCompanies[slug];

  const [isTracked, setIsTracked] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);

  useEffect(() => {
    setIsTracked(isInWatchlist(slug));
  }, [slug]);

  const handleTrack = () => {
    if (isTracked) {
      removeFromWatchlist(slug);
    } else {
      addToWatchlist(slug);
    }
    setIsTracked(!isTracked);
  };

  if (!company) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Company Not Found</h2>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">The company profile you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const allRefusals = [...mockRefusals, ...mockRefusals].filter(r => r.importerSlug === slug || Math.random() > 0.7).slice(0, 10);
  const companyDomain = company.website ? new URL(company.website).hostname.replace('www.', '') : undefined;
  const gradeConfig = riskGradeConfig[company.riskGrade];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6">
      <div className="mb-2">
        <Link href="/companies" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300">
          Companies
        </Link>
        <span className="mx-2 text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-sm text-slate-700 dark:text-zinc-400">{company.name}</span>
      </div>

      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{company.name}</h1>
              {company.verified && (
                <Badge className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${gradeConfig.bgLight}`}>
                <div className={`h-2.5 w-2.5 rounded-full ${gradeConfig.color}`} />
                <span className={`text-sm font-bold ${gradeConfig.textColor}`}>
                  Grade {company.riskGrade}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-500">{gradeConfig.label}</span>
              </div>
              <Badge variant="outline" className="border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400">
                {company.totalRefusals} Total Refusals
              </Badge>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
              <MapPin className="h-4 w-4" />
              {company.country}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleTrack}
            variant={isTracked ? 'outline' : 'default'}
            className={isTracked 
              ? 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-transparent text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800' 
              : 'bg-amber-500 text-white hover:bg-amber-600'
            }
          >
            {isTracked ? (
              <>
                <Minus className="mr-2 h-4 w-4" />
                Untrack
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Track Company
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCorrectionModalOpen(true)}
            className="border-slate-300 dark:border-zinc-700 bg-white dark:bg-transparent text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <Flag className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Company Info
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 text-center">
                  <Building2 className="mx-auto h-5 w-5 text-slate-400 dark:text-zinc-500" />
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Industry</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">{company.industry}</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 text-center">
                  <Users className="mx-auto h-5 w-5 text-slate-400 dark:text-zinc-500" />
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Employees</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">{company.employees}</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 text-center">
                  <Calendar className="mx-auto h-5 w-5 text-slate-400 dark:text-zinc-500" />
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Founded</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">{company.founded}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-500">About</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">{company.about}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-500">Address</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{company.address}</p>
              </div>

              <div className="h-48 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${company.coordinates.lng - 0.05}%2C${company.coordinates.lat - 0.05}%2C${company.coordinates.lng + 0.05}%2C${company.coordinates.lat + 0.05}&layer=mapnik&marker=${company.coordinates.lat}%2C${company.coordinates.lng}`}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Mail className="h-4 w-4" />
                    {showEmail ? company.email : '••••••@' + (companyDomain || 'company.com')}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmail(!showEmail)}
                    className="h-8 px-2 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white"
                  >
                    {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Phone className="h-4 w-4" />
                    {showPhone ? company.phone : '+•• •• •••• ••••'}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPhone(!showPhone)}
                    className="h-8 px-2 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white"
                  >
                    {showPhone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Violation Breakdown
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={company.violationBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {company.violationBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, #18181b)', 
                      border: '1px solid var(--tooltip-border, #27272a)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {company.violationBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600 dark:text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-sm text-slate-500 dark:text-zinc-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Refusal History (Rap Sheet)
            </h3>
            
            <div className="relative space-y-0">
              <div className="absolute left-3 top-0 h-full w-px bg-slate-200 dark:bg-zinc-800" />
              
              {allRefusals.map((refusal, idx) => (
                <div key={`${refusal.id}-${idx}`} className="relative flex gap-4 pb-6">
                  <div className={`relative z-10 h-6 w-6 shrink-0 rounded-full border-2 ${
                    refusal.status === 'refused' ? 'border-red-500 bg-red-50 dark:bg-red-500/20' :
                    refusal.status === 'detained' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/20' :
                    'border-green-500 bg-green-50 dark:bg-green-500/20'
                  }`} />
                  
                  <div className="flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-4 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{refusal.productDescription}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                          Port of Entry: {refusal.port}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-slate-400 dark:text-zinc-600">
                        {format(new Date(refusal.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`border-0 ${
                          refusal.status === 'refused' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                          refusal.status === 'detained' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                          'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {refusal.status.charAt(0).toUpperCase() + refusal.status.slice(1)}
                      </Badge>
                      <Link
                        href={`/violation/${refusal.violationSlug}`}
                        className="text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400"
                      >
                        <SmartText text={refusal.violationCode} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CorrectionModal
        open={correctionModalOpen}
        onOpenChange={setCorrectionModalOpen}
        companyName={company.name}
        companyDomain={companyDomain}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: company.name,
            url: company.website,
            address: {
              '@type': 'PostalAddress',
              streetAddress: company.address,
              addressCountry: company.country,
            },
          }),
        }}
      />
    </div>
  );
}
