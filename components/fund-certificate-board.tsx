'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { fundRecords, type FundType } from '@/lib/fund-data';
import { cn } from '@/lib/utils';

type FundFilter = 'all' | FundType;

const filterOptions: Array<{ value: FundFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'bond', label: 'Bond' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'stock', label: 'Stock' },
];

function getTypeBadgeTone(type: FundType) {
  switch (type) {
    case 'bond':
      return 'bg-[#eef4ff] text-[#285ea8] border-[#cad9f5]';
    case 'balanced':
      return 'bg-[#f7f0df] text-[#8b5f11] border-[#e8d2a1]';
    case 'stock':
      return 'bg-[#edf8f0] text-[#0f7b47] border-[#c6ead2]';
  }
}

function initials(symbol: string) {
  return symbol
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export function FundCertificateBoard() {
  const searchId = useId();
  const filterId = useId();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<FundFilter>('all');

  const normalizedQuery = query.trim().toLowerCase();
  const filteredFunds = fundRecords.filter((fund) => {
    const matchesType = selectedType === 'all' || fund.type === selectedType;
    const haystack = `${fund.name} ${fund.symbol} ${fund.company}`.toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

    return matchesType && matchesQuery;
  });

  return (
    <section className="min-h-full px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-5">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,252,245,0.92),rgba(255,246,229,0.8))] shadow-[0_30px_80px_-52px_rgba(90,63,13,0.38)]">
          <div className="border-b border-[#eee0c5] bg-white/45 px-5 py-5 md:px-7">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <label htmlFor={searchId} className="text-sm font-semibold text-[#17120d]">
                  Search
                </label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#8d7d66]" />
                  <input
                    id={searchId}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Fund name, fund code, company..."
                    className={cn(
                      'h-14 w-full rounded-[1.2rem] border border-[#dbcdb4] bg-white/85 pl-12 pr-4 text-sm text-[#17120d] outline-none transition',
                      'placeholder:text-[#9b8f7d] hover:border-[#c9b48b] focus:border-[#c89b3c] focus:ring-4 focus:ring-[#d9b255]/15',
                    )}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={filterId} className="text-sm font-semibold text-[#17120d]">
                  Select type
                </label>
                <select
                  id={filterId}
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value as FundFilter)}
                  className={cn(
                    'mt-2 h-14 w-full rounded-[1.2rem] border border-[#dbcdb4] bg-white/85 px-4 text-sm font-medium text-[#17120d] outline-none transition',
                    'hover:border-[#c9b48b] focus:border-[#c89b3c] focus:ring-4 focus:ring-[#d9b255]/15',
                  )}
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="px-2 py-2 md:px-3 md:py-3">
            <div className="overflow-hidden rounded-[1.65rem] border border-[#e7d8be] bg-white/82">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#eee2cc] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(249,241,226,0.9))] text-left">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">No</th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">
                        Name of fund
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">
                        Type
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">
                        Company
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">
                        Price change percent 24h
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">
                        Market price
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7251]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFunds.length > 0 ? (
                      filteredFunds.map((fund, index) => (
                        <tr key={fund.symbol} className="border-b border-[#f1e8d7] last:border-b-0 hover:bg-[#fff9ef]">
                          <td className="px-5 py-4 text-sm font-medium text-[#6b5a43]">
                            {(index + 1).toString().padStart(2, '0')}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#ead8b5] bg-[linear-gradient(180deg,#fff9ee,#f6ead5)] text-sm font-semibold text-[#8a6217] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                {initials(fund.symbol)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold tracking-tight text-[#17120d]">{fund.name}</p>
                                <p className="mt-1 text-sm text-[#756956]">{fund.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                'inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
                                getTypeBadgeTone(fund.type),
                              )}
                            >
                              {fund.type}
                            </span>
                          </td>
                          <td className="max-w-[320px] px-5 py-4 text-sm leading-6 text-[#453c31]">{fund.company}</td>
                          <td
                            className={cn(
                              'px-5 py-4 text-sm font-semibold',
                              fund.change24h >= 0 ? 'text-[#157347]' : 'text-[#b24334]',
                            )}
                          >
                            {fund.change24h >= 0 ? '+' : ''}
                            {fund.change24h.toFixed(2)}%
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[#17120d]">{fund.marketPrice}</td>
                          <td className="px-5 py-4">
                            <Button
                              asChild
                              variant="outline"
                              className="h-10 rounded-full border-[#d8c6a3] bg-white/85 px-4 text-[#17120d] hover:border-[#c89b3c] hover:bg-[#fff6e6]"
                            >
                              <Link href={`/fund-certificates/${fund.symbol.toLowerCase()}`}>
                                Detail
                                <ArrowUpRight className="size-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center">
                          <p className="text-lg font-semibold tracking-tight text-[#17120d]">
                            No funds match your current search.
                          </p>
                          <p className="mt-2 text-sm text-[#756956]">
                            Try another fund code, company name, or switch the type filter back to All.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
