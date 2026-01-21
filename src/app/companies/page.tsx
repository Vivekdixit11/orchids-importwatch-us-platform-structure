'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockCompanies, Company } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Building2, 
  ArrowUpDown, 
  CheckCircle2, 
  MapPin,
  AlertTriangle,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

type SortOption = 'name' | 'refusals' | 'risk' | 'country';
type ViewMode = 'grid' | 'list';

const riskGradeOrder = { A: 1, B: 2, C: 3, F: 4 };

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('refusals');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const companies = Object.values(mockCompanies);
  
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(companies.map(c => c.country))];
    return uniqueCountries.sort();
  }, [companies]);

  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query)
      );
    }

    if (filterGrade !== 'all') {
      result = result.filter(c => c.riskGrade === filterGrade);
    }

    if (filterCountry !== 'all') {
      result = result.filter(c => c.country === filterCountry);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'refusals':
          comparison = a.totalRefusals - b.totalRefusals;
          break;
        case 'risk':
          comparison = riskGradeOrder[a.riskGrade] - riskGradeOrder[b.riskGrade];
          break;
        case 'country':
          comparison = a.country.localeCompare(b.country);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [companies, searchQuery, sortBy, sortOrder, filterGrade, filterCountry]);

  const gradeConfig = {
    A: { color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', bgLight: 'bg-emerald-50 dark:bg-emerald-500/10' },
    B: { color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400', bgLight: 'bg-yellow-50 dark:bg-yellow-500/10' },
    C: { color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400', bgLight: 'bg-orange-50 dark:bg-orange-500/10' },
    F: { color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', bgLight: 'bg-red-50 dark:bg-red-500/10' },
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Companies</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-500">
              {filteredAndSortedCompanies.length} of {companies.length} companies
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-amber-500 hover:bg-amber-400' : 'border-slate-200 dark:border-zinc-700'}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-amber-500 hover:bg-amber-400' : 'border-slate-200 dark:border-zinc-700'}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <Input
              placeholder="Search by name, country, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 pl-10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-32 border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
                  <SelectValue placeholder="Risk Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                  <SelectItem value="F">Grade F</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-40 border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-36 border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refusals">Refusals</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="risk">Risk Grade</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
              >
                <ArrowUpDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedCompanies.map(company => (
            <Link
              key={company.slug}
              href={`/company/${company.slug}`}
              className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-amber-500/5 to-transparent" />
              
              <div className="mb-4 flex items-start justify-between">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${gradeConfig[company.riskGrade].bgLight}`}>
                  <div className={`h-2 w-2 rounded-full ${gradeConfig[company.riskGrade].color}`} />
                  <span className={`text-xs font-bold ${gradeConfig[company.riskGrade].textColor}`}>
                    {company.riskGrade}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors line-clamp-1">
                    {company.name}
                  </h3>
                  {company.verified && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {company.country}
                </p>
              </div>

              <p className="mb-4 text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">
                {company.about}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-3">
                <Badge variant="outline" className="border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-xs">
                  {company.industry}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`h-3 w-3 ${company.totalRefusals > 10 ? 'text-red-500' : 'text-amber-500'}`} />
                  <span className={`text-sm font-mono font-semibold ${company.totalRefusals > 10 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {company.totalRefusals}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Industry</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Risk</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Refusals</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Verified</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCompanies.map((company, idx) => (
                <tr 
                  key={company.slug}
                  className={`border-b border-slate-100 dark:border-zinc-800/50 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/30 ${idx % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-slate-50/50 dark:bg-zinc-800/20'}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/company/${company.slug}`} className="flex items-center gap-3 group">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-800">
                        <Image src={company.logo} alt={company.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500">
                        {company.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">{company.country}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">{company.industry}</td>
                  <td className="px-4 py-3 text-center">
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${gradeConfig[company.riskGrade].bgLight}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${gradeConfig[company.riskGrade].color}`} />
                      <span className={`text-xs font-bold ${gradeConfig[company.riskGrade].textColor}`}>{company.riskGrade}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono text-sm font-semibold ${company.totalRefusals > 10 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {company.totalRefusals}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {company.verified && <CheckCircle2 className="mx-auto h-4 w-4 text-blue-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredAndSortedCompanies.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/30 py-16">
          <Building2 className="h-12 w-12 text-slate-300 dark:text-zinc-700" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No Companies Found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setFilterGrade('all');
              setFilterCountry('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
