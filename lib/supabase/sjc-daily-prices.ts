import 'server-only';

import { createSupabaseServiceClient } from '@/lib/supabase/service-client';
import type { SjcDailyPricePayload, SjcDailyPricePayloadItem } from '@/lib/supabase/types';

export type GoldBoardEntry = {
  id: number;
  type: string;
  branch: string;
  buy: string;
  sell: string;
  buyValue: number;
  sellValue: number;
  buyDifferValue: number;
  sellDifferValue: number;
};

export type GoldBoardSnapshot = {
  latestDate: string | null;
  latestDay: string | null;
  entries: GoldBoardEntry[];
};

function parsePayload(raw: string): SjcDailyPricePayload {
  return JSON.parse(raw) as SjcDailyPricePayload;
}

function normalizeEntry(item: SjcDailyPricePayloadItem): GoldBoardEntry {
  return {
    id: item.Id,
    type: item.TypeName,
    branch: item.BranchName,
    buy: item.Buy,
    sell: item.Sell,
    buyValue: item.BuyValue,
    sellValue: item.SellValue,
    buyDifferValue: item.BuyDifferValue,
    sellDifferValue: item.SellDifferValue,
  };
}

export async function getSjcDailyPrices(branchName?: string) {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('sjc_daily_prices')
    .select('id, data, latest_day')
    .order('latest_day', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch sjc_daily_prices: ${error.message}`);
  }

  if (!data) {
    return {
      latestDate: null,
      latestDay: null,
      entries: [],
    } satisfies GoldBoardSnapshot;
  }

  const payload = typeof data.data === 'string' ? parsePayload(data.data) : (data.data as SjcDailyPricePayload);
  const entries = (branchName
    ? payload.data.filter((item) => item.BranchName === branchName)
    : payload.data
  ).map(normalizeEntry);

  return {
    latestDate: payload.latestDate ?? null,
    latestDay: data.latest_day,
    entries,
  } satisfies GoldBoardSnapshot;
}
