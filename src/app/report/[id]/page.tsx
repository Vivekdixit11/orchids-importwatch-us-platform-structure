'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockRefusals, mockCompanies, mockViolations } from '@/lib/mock-data';
import { SmartText } from '@/components/SmartText';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Scale, 
  Building2,
  ArrowRight,
  Gavel
} from 'lucide-react';
import { format } from 'date-fns';

export default function RefusalReport() {
  const params = useParams();
  const id = params.id as string;
  const refusal = mockRefusals.find(r => r.id === id);

  if (!refusal) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-white">Report Not Found</h2>
          <p className="mt-2 text-zinc-400">This refusal report doesn't exist or has been removed.</p>
          <Link href="/" className="mt-4 inline-block text-amber-500 hover:text-amber-400">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const company = mockCompanies[refusal.importerSlug];
  const violation = mockViolations[refusal.violationSlug];
  
  const similarByPort = mockRefusals.filter(
    r => r.port === refusal.port && r.id !== refusal.id
  ).slice(0, 3);
  
  const similarByViolation = mockRefusals.filter(
    r => r.violationSlug === refusal.violationSlug && r.id !== refusal.id
  ).slice(0, 3);

  const aiAnalysis = `
On ${format(new Date(refusal.date), 'MMMM d, yyyy')}, a shipment of ${refusal.productDescription} from ${refusal.importerName} (${refusal.originCountry}) was ${refusal.status} at the Port of ${refusal.port}.

The U.S. Food and Drug Administration (FDA) issued this action under ${refusal.violationCode}, which addresses ${violation?.title?.toLowerCase() || 'regulatory violations'}. ${violation?.plainEnglish || ''}

This is not the first time ${refusal.importerName} has faced regulatory action. According to our records, this company has a history of compliance issues, which is reflected in their current risk assessment.

The goods were inspected upon arrival and found to be in violation of federal import regulations. ${refusal.status === 'refused' ? 'The shipment has been refused entry and must be re-exported or destroyed.' : refusal.status === 'detained' ? 'The goods are currently being held pending further review.' : 'After review, the goods have been released.'}

Importers working with this supplier should conduct enhanced due diligence and may want to consider alternative sourcing options until compliance issues are resolved.
  `.trim();

  return (
    <div className="p-6">
      <div className="mb-2">
        <Link 
          href="/" 
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          Dashboard
        </Link>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-sm text-zinc-400">Refusal Report</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <article className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge 
                  className={`${
                    refusal.status === 'refused' ? 'bg-red-500/10 text-red-400' :
                    refusal.status === 'detained' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}
                >
                  {refusal.status.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                  {refusal.originCountry}
                </Badge>
                <span className="text-sm text-zinc-500">
                  Report ID: {refusal.id}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-white">
                {refusal.productDescription} Import {refusal.status === 'refused' ? 'Refused' : refusal.status === 'detained' ? 'Detained' : 'Released'} at Port of {refusal.port}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(refusal.date), 'MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {refusal.port}
                </span>
                <Link 
                  href={`/company/${refusal.importerSlug}`}
                  className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400"
                >
                  <Building2 className="h-4 w-4" />
                  {refusal.importerName}
                </Link>
              </div>
            </header>

            <div className="prose prose-invert max-w-none">
              {aiAnalysis.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 leading-relaxed text-zinc-300">
                  <SmartText text={paragraph} />
                </p>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="flex items-start gap-4">
                <Scale className="h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-white">Applicable Regulation</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    <SmartText text={refusal.violationCode} /> — {violation?.title}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    {violation?.definition}
                  </p>
                  <Link 
                    href={`/violation/${refusal.violationSlug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400"
                  >
                    Learn more about this violation
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-white">Need Legal Assistance?</h3>
                <p className="text-sm text-zinc-400">
                  Connect with trade compliance attorneys
                </p>
              </div>
              <Button className="bg-amber-500 text-black hover:bg-amber-400">
                <Gavel className="mr-2 h-4 w-4" />
                Consult a Lawyer
              </Button>
            </div>
          </article>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: `${refusal.productDescription} Import ${refusal.status === 'refused' ? 'Refused' : 'Detained'} at Port of ${refusal.port}`,
                datePublished: refusal.date,
                author: {
                  '@type': 'Organization',
                  name: 'ImportWatch.us',
                },
                description: `FDA action under ${refusal.violationCode} against ${refusal.importerName}`,
              }),
            }}
          />
        </div>

        <aside className="space-y-6 lg:col-span-1">
          {company && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Company Profile
              </h3>
              <Link 
                href={`/company/${company.slug}`}
                className="group block"
              >
                <p className="font-medium text-white group-hover:text-amber-500">
                  {company.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{company.country}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    company.riskGrade === 'F' ? 'bg-red-500' :
                    company.riskGrade === 'C' ? 'bg-orange-500' :
                    company.riskGrade === 'B' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm text-zinc-400">
                    Risk Grade: {company.riskGrade}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  {company.totalRefusals} total refusals on record
                </p>
              </Link>
            </div>
          )}

          {similarByPort.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Same Port ({refusal.port})
              </h3>
              <div className="space-y-3">
                {similarByPort.map(r => (
                  <Link 
                    key={r.id}
                    href={`/report/${r.id}`}
                    className="block rounded-lg border border-zinc-800 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                  >
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {r.productDescription}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {r.importerName}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {similarByViolation.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Same Violation
              </h3>
              <div className="space-y-3">
                {similarByViolation.map(r => (
                  <Link 
                    key={r.id}
                    href={`/report/${r.id}`}
                    className="block rounded-lg border border-zinc-800 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                  >
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {r.productDescription}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {r.importerName} • {r.originCountry}
                    </p>
                  </Link>
                ))}
              </div>
              <Link 
                href={`/violation/${refusal.violationSlug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400"
              >
                View all cases
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
