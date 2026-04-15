'use client';

import { useMemo, useState } from 'react';
import { ChartSpline, ChevronDown } from 'lucide-react';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getGoldChartSeries,
  goldPeriodOptions,
  goldProductOptions,
  type GoldPeriod,
  type GoldProduct,
} from '@/lib/gold-history-data';
import { cn } from '@/lib/utils';

function formatVndMillions(value: number) {
  return `${(value / 10000).toFixed(2)}`;
}

function GoldTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    payload?: {
      summaryLabel: string;
      buyDisplay: string;
      sellDisplay: string;
    };
  }>;
}) {
  if (!active || !payload?.length || !payload[0]?.payload) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-[#0f0f0f]/95 px-4 py-3 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur">
      <p className="text-sm text-white/62">Giá vàng ngày</p>
      <p className="mt-1 text-base font-semibold text-white">{point.summaryLabel}</p>
      <div className="mt-3 grid gap-2 text-sm">
        <p className="text-white/82">
          Mua vào: <span className="ml-2 font-semibold text-[#31e063]">{point.buyDisplay}</span>
        </p>
        <p className="text-white/82">
          Bán ra: <span className="ml-2 font-semibold text-[#ff4a3d]">{point.sellDisplay}</span>
        </p>
      </div>
    </div>
  );
}

export function GoldPriceHistory() {
  const [period, setPeriod] = useState<GoldPeriod>('7d');
  const [product, setProduct] = useState<GoldProduct>('vang-mieng-1l');

  const chartSeries = useMemo(() => getGoldChartSeries(product, period), [product, period]);
  const lastPoint = chartSeries.points.at(-1);
  const allValues = chartSeries.points.flatMap((point) => [point.buy, point.sell]);
  const minValue = Math.min(...allValues) - 500;
  const maxValue = Math.max(...allValues) + 500;

  return (
    <section className="rounded-[2rem] bg-[#050505] px-3 py-4 text-white shadow-[0_30px_70px_-44px_rgba(0,0,0,0.75)] md:px-5 md:py-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight md:text-[2rem]">Vang miếng SJC - Hồ Chí Minh</h2>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/78 md:inline-flex"
          >
            <select
              value={product}
              onChange={(event) => setProduct(event.target.value as GoldProduct)}
              className="appearance-none bg-transparent pr-6 outline-none"
            >
              {goldProductOptions.map((option) => (
                <option key={option.id} value={option.id} className="bg-[#121212] text-white">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="size-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {goldPeriodOptions.map((option) => {
            const active = option.id === period;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPeriod(option.id)}
                className={cn(
                  'shrink-0 rounded-[1.35rem] border px-5 py-3 text-base font-medium transition',
                  active
                    ? 'border-[#f7a11a] bg-[#f7a11a] text-white shadow-[0_0_22px_rgba(247,161,26,0.45)]'
                    : 'border-white/12 bg-[#1f1f1f] text-white/92 hover:border-white/22 hover:bg-[#272727]',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#121212] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:px-6 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#0f2847] text-[#2f8cff]">
                  <ChartSpline className="size-4.5" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight md:text-[1.9rem]">{chartSeries.title}</h3>
              </div>
              <p className="mt-4 text-base text-white/55">{chartSeries.subtitle}</p>
              <p className="mt-1 text-sm text-white/36">Khoảng dữ liệu {chartSeries.range}</p>
            </div>

            <div className="flex items-center gap-5 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#31e063]" />
                <span>Mua</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#ff4a3d]" />
                <span>Bán</span>
              </div>
            </div>
          </div>

          <div className="mt-5 h-[360px] w-full md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartSeries.points} margin={{ top: 12, right: 12, left: 0, bottom: 6 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 6" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="rgba(255,255,255,0.72)"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={24}
                />
                <YAxis
                  stroke="#3182ff"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={formatVndMillions}
                  domain={[minValue, maxValue]}
                />
                <Tooltip
                  content={<GoldTooltip />}
                  cursor={{ stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="buy"
                  stroke="#31e063"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#31e063', stroke: '#0f0f0f', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="sell"
                  stroke="#ff4a3d"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#ff4a3d', stroke: '#0f0f0f', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {lastPoint ? (
            <div className="mt-6 border-t border-white/7 pt-5">
              <p className="text-sm text-white/62">
                Giá vàng ngày <span className="ml-3 text-2xl font-semibold tracking-tight text-white">{lastPoint.summaryLabel}</span>
              </p>
              <div className="mt-3 grid gap-2 text-lg md:grid-cols-2">
                <p className="text-white/78">
                  Mua vào: <span className="ml-3 font-semibold text-[#31e063]">{lastPoint.buyDisplay}</span>
                </p>
                <p className="text-white/78">
                  Bán ra: <span className="ml-3 font-semibold text-[#ff4a3d]">{lastPoint.sellDisplay}</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
