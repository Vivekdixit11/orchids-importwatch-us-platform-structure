'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockViolations, mockRefusals } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Scale,
  ArrowRight,
  BookOpen,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';

export default function ViolationGlossary() {
  const params = useParams();
  const slug = params.slug as string;
  const violation = mockViolations[slug];

  if (!violation) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-white">Violation Not Found</h2>
          <p className="mt-2 text-zinc-400">This violation code doesn't exist in our database.</p>
          <Link href="/" className="mt-4 inline-block text-amber-500 hover:text-amber-400">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const allCases = mockRefusals.filter(r => r.violationSlug === slug);

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
        <span className="text-sm text-zinc-400">Violation Glossary</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
            <Scale className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <Badge className="mb-1 bg-amber-500/10 text-amber-400">
              {violation.code}
            </Badge>
            <h1 className="text-3xl font-bold text-white">{violation.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-white">What is {violation.code}?</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-2">
                  Legal Definition
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {violation.definition}
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-2">
                  Plain English Explanation
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {violation.plainEnglish}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Cases</h2>
            
            {allCases.length > 0 ? (
              <div className="space-y-3">
                {allCases.map(refusal => (
                  <Link
                    key={refusal.id}
                    href={`/report/${refusal.id}`}
                    className="flex items-start gap-4 rounded-lg border border-zinc-800 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                  >
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      refusal.status === 'refused' ? 'bg-red-500' :
                      refusal.status === 'detained' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-white">{refusal.productDescription}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {refusal.importerName} • {refusal.originCountry}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-zinc-600">
                      {format(new Date(refusal.date), 'MMM dd')}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No recent cases for this violation.</p>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-white">Most Wanted</h2>
            </div>
            <p className="mb-4 text-sm text-zinc-500">
              Companies most frequently cited for this violation
            </p>
            
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Company
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Count
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {violation.topCompanies.map((company, idx) => (
                  <TableRow key={company.slug} className="border-zinc-800/50">
                    <TableCell>
                      <Link 
                        href={`/company/${company.slug}`}
                        className="flex items-center gap-2 text-sm text-white hover:text-amber-500"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-xs font-mono text-zinc-500">
                          {idx + 1}
                        </span>
                        {company.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400">
                        {company.count}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="font-semibold text-white">Compliance Tip</h3>
            <p className="mt-2 text-sm text-zinc-400">
              If you're importing products that may be subject to {violation.code}, 
              ensure you work with verified suppliers and maintain complete 
              documentation of your supply chain.
            </p>
            <Link 
              href="/"
              className="mt-4 inline-flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400"
            >
              Learn more
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
