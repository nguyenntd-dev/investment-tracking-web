'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, ArrowUpRight, BadgePercent, Building2, CalendarDays, Landmark, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { FundRecord } from '@/lib/fund-data';

const rangeOptions = [
  { key: 'YTD', label: 'YTD', points: 9 },
  { key: '6M', label: '6M', points: 7 },
  { key: '3M', label: '3M', points: 5 },
  { key: '1M', label: '1M', points: 3 },
] as const;

type RangeKey = (typeof rangeOptions)[number]['key'];

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function formatNavTick(value: number) {
  return `${(value / 1000).toFixed(0)}k`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length || !label) {
    return null;
  }

  return (
    <div className="rounded-[1.2rem] border border-white/12 bg-[#0f0f0f]/95 px-4 py-3 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur">
      <p className="text-sm font-medium text-white">NAV at {formatDateLabel(label)}</p>
      <p className="mt-2 text-lg font-semibold text-[#48d598]">
        {payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} đ
      </p>
    </div>
  );
}

export function FundCertificateDetail({ fund }: { fund: FundRecord }) {
  const [range, setRange] = useState<RangeKey>('YTD');

  const selectedRange = rangeOptions.find((option) => option.key === range) ?? rangeOptions[0];
  const chartData = fund.history.slice(-selectedRange.points);
  const minNav = Math.min(...chartData.map((point) => point.nav));
  const maxNav = Math.max(...chartData.map((point) => point.nav));

  return (
    <section className="min-h-full px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-5">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,252,245,0.94),rgba(255,245,229,0.88))] shadow-[0_30px_80px_-52px_rgba(90,63,13,0.38)]">
          <div className="border-b border-[#eadcc4] px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <Link
                  href="/fund-certificates"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#7a6544] transition hover:text-[#17120d]"
                >
                  <ArrowLeft className="size-4" />
                  Back to fund list
                </Link>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-[#17120d] md:text-6xl">{fund.symbol}</h1>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#e7f8ee] px-4 py-2 text-sm font-semibold text-[#0f8b53]">
                    <ArrowUpRight className="size-4" />+{fund.ytd.toFixed(2)}% YTD
                  </div>
                  <div className="inline-flex rounded-full border border-[#e6d7ba] px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-[#7a6544]">
                    {fund.type}
                  </div>
                </div>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-[#605243] md:text-2xl">{fund.fullName}</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7a6c5b] md:text-base">{fund.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px]">
                <div className="rounded-[1.5rem] border border-[#ead8b5] bg-white/72 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#8d7555]">Latest NAV</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-[#17120d]">{fund.latestNav}</p>
                  <p className="mt-1 text-sm text-[#7a6c5b]">{formatDateLabel(fund.latestNavDate)}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[#1f1a14] bg-[#17120d] px-4 py-4 text-[#f7e2a9]">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#c9a451]">Market price</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{fund.marketPrice}</p>
                  <p className="mt-1 text-sm text-[#d4bb82]">Daily move {fund.change24h.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 py-2 md:px-3 md:py-3">
            <section className="overflow-hidden rounded-[1.8rem] border border-[#232323] bg-[#0c0c0c] text-white">
              <div className="border-b border-white/8 px-5 py-5 md:px-7">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8f8f8f]">Price history</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">NAV / unit trend</h2>
                    <p className="mt-2 text-sm leading-6 text-[#909090]">
                      Current NAV {fund.latestNav} on {formatDateLabel(fund.latestNavDate)}
                    </p>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                    {rangeOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setRange(option.key)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-medium transition',
                          range === option.key ? 'bg-white text-[#17120d]' : 'text-[#b4b4b4] hover:text-white',
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 md:px-6 md:py-6">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#0d3423] px-4 py-2 text-sm font-semibold text-[#48d598]">
                    <BadgePercent className="size-4" />+{fund.ytd.toFixed(2)}% YTD / unit
                  </div>
                  <p className="text-sm text-[#8f8f8f]">
                    Range focus: {selectedRange.label} with {chartData.length} tracked points
                  </p>
                </div>

                <div className="h-[420px] w-full md:h-[520px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 12 }}>
                      <defs>
                        <linearGradient id="fund-nav-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00c784" stopOpacity={0.42} />
                          <stop offset="100%" stopColor="#00c784" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.18)" strokeDasharray="4 6" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#8f8f8f"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatDateLabel}
                        tickMargin={14}
                        minTickGap={18}
                      />
                      <YAxis
                        stroke="#8f8f8f"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatNavTick}
                        tickMargin={14}
                        domain={[Math.floor(minNav - 200), Math.ceil(maxNav + 200)]}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.14)' }} />
                      <Area
                        type="monotone"
                        dataKey="nav"
                        stroke="#00c784"
                        strokeWidth={3}
                        fill="url(#fund-nav-fill)"
                        activeDot={{ r: 6, fill: '#ffffff', stroke: '#00c784', strokeWidth: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>

          <div className="grid gap-4 px-2 pb-2 md:grid-cols-[1.15fr_0.85fr] md:px-3 md:pb-3">
            <section className="rounded-[1.6rem] border border-[#eadbc1] bg-white/75 px-5 py-5 md:px-6 md:py-6">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17120d]">Fund details</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Landmark className="mt-0.5 size-5 text-[#9b6c12]" />
                    <div>
                      <p className="text-sm text-[#7a6c5b]">Fund code</p>
                      <p className="mt-1 text-lg font-semibold text-[#17120d]">{fund.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowUpRight className="mt-0.5 size-5 text-[#9b6c12]" />
                    <div>
                      <p className="text-sm text-[#7a6c5b]">Type</p>
                      <p className="mt-1 text-lg font-semibold uppercase text-[#17120d]">{fund.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 size-5 text-[#9b6c12]" />
                    <div>
                      <p className="text-sm text-[#7a6c5b]">Company</p>
                      <p className="mt-1 text-lg font-semibold text-[#17120d]">{fund.company}</p>
                      <p className="mt-1 text-sm text-[#7a6c5b]">{fund.companyCode}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-5 text-[#9b6c12]" />
                    <div>
                      <p className="text-sm text-[#7a6c5b]">Supervising bank</p>
                      <p className="mt-1 text-lg font-semibold text-[#17120d]">{fund.supervisingBank}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-5 text-[#9b6c12]" />
                    <div>
                      <p className="text-sm text-[#7a6c5b]">Inception date</p>
                      <p className="mt-1 text-lg font-semibold text-[#17120d]">{formatDateLabel(fund.inceptionDate)}</p>
                    </div>
                  </div>
                  <div className="rounded-[1.3rem] border border-[#eadbc1] bg-[#fffaf0] px-4 py-4">
                    <p className="text-sm text-[#7a6c5b]">Investment strategy</p>
                    <p className="mt-2 text-base leading-7 text-[#17120d]">{fund.strategy}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-[#eadbc1] bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(253,248,238,0.95))] px-5 py-5 md:px-6 md:py-6">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17120d]">Latest NAV info</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-[#efe4cf] pb-4">
                  <div>
                    <p className="text-sm text-[#7a6c5b]">Date</p>
                    <p className="mt-1 text-lg font-semibold text-[#17120d]">{formatDateLabel(fund.latestNavDate)}</p>
                  </div>
                  <CalendarDays className="size-5 text-[#9b6c12]" />
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-[#efe4cf] pb-4">
                  <div>
                    <p className="text-sm text-[#7a6c5b]">NAV price</p>
                    <p className="mt-1 text-lg font-semibold text-[#17120d]">{fund.latestNav}</p>
                  </div>
                  <BadgePercent className="size-5 text-[#9b6c12]" />
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-[#efe4cf] pb-4">
                  <div>
                    <p className="text-sm text-[#7a6c5b]">24h move</p>
                    <p
                      className={cn(
                        'mt-1 text-lg font-semibold',
                        fund.change24h >= 0 ? 'text-[#157347]' : 'text-[#b24334]',
                      )}
                    >
                      {fund.change24h >= 0 ? '+' : ''}
                      {fund.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <ArrowUpRight className="size-5 text-[#9b6c12]" />
                </div>
                <div className="rounded-[1.3rem] border border-[#eadbc1] bg-[#17120d] px-4 py-4 text-[#f7e2a9]">
                  <p className="text-sm text-[#ccb27b]">Quick take</p>
                  <p className="mt-2 text-base leading-7 text-[#fff4d9]">
                    {fund.type === 'bond'
                      ? 'Lower-volatility fund profile with income-first positioning.'
                      : fund.type === 'balanced'
                        ? 'Blend of defense and upside, suitable for medium-risk allocation.'
                        : 'Equity-led fund profile with stronger upside and wider movement.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </section>
  );
}
