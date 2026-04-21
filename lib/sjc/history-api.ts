import type { SjcDailyPricePayload, SjcDailyPricePayloadItem } from '../supabase/types';

export type GoldProductOption = 'vang-mieng-1l' | 'vang-nhan-1l';

type ProductMapping = {
  typeName: string;
  branchName: string;
};

export type HistoryRequestParams = {
  goldProductOptions: GoldProductOption;
  fromDate: string;
  toDate: string;
};

export type SjcHistoryRow = {
  data: string | SjcDailyPricePayload;
  latest_day: string | null;
};

export type SjcHistoryResponse = {
  success: true;
  data: SjcDailyPricePayloadItem[];
  latestDate: string | null;
};

const PRODUCT_MAPPINGS: Record<GoldProductOption, ProductMapping> = {
  'vang-mieng-1l': {
    typeName: 'Vàng SJC 1L, 10L, 1KG',
    branchName: 'Hồ Chí Minh',
  },
  'vang-nhan-1l': {
    typeName: 'Vàng nhẫn SJC 99,99% 1 chỉ, 2 chỉ, 5 chỉ',
    branchName: 'Hồ Chí Minh',
  },
};

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parsePayload(raw: string | SjcDailyPricePayload) {
  return typeof raw === 'string' ? (JSON.parse(raw) as SjcDailyPricePayload) : raw;
}

export function parseHistoryRequest(searchParams: URLSearchParams):
  | { ok: true; value: HistoryRequestParams }
  | { ok: false; error: string } {
  const goldProductOptions = searchParams.get('goldProductOptions');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  if (!goldProductOptions || !(goldProductOptions in PRODUCT_MAPPINGS)) {
    return {
      ok: false,
      error: 'goldProductOptions is required and must be one of: vang-mieng-1l, vang-nhan-1l.',
    };
  }

  if (!fromDate || !toDate) {
    return {
      ok: false,
      error: 'fromDate and toDate are required in YYYY-MM-DD format.',
    };
  }

  if (!isValidDateString(fromDate) || !isValidDateString(toDate)) {
    return {
      ok: false,
      error: 'fromDate and toDate must be valid dates in YYYY-MM-DD format.',
    };
  }

  if (fromDate > toDate) {
    return {
      ok: false,
      error: 'fromDate must be less than or equal to toDate.',
    };
  }

  return {
    ok: true,
    value: {
      goldProductOptions: goldProductOptions as GoldProductOption,
      fromDate,
      toDate,
    },
  };
}

export function buildSjcHistoryResponse(
  rows: SjcHistoryRow[],
  goldProductOptions: GoldProductOption,
): SjcHistoryResponse {
  const mapping = PRODUCT_MAPPINGS[goldProductOptions];
  const data: SjcDailyPricePayloadItem[] = [];
  let latestDate: string | null = null;

  for (const row of rows) {
    const payload = parsePayload(row.data);

    if (payload.latestDate) {
      latestDate = payload.latestDate;
    }

    for (const item of payload.data) {
      if (item.TypeName === mapping.typeName && item.BranchName === mapping.branchName) {
        data.push(item);
      }
    }
  }

  return {
    success: true,
    data,
    latestDate,
  };
}
