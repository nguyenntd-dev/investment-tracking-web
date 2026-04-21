import 'server-only';

export type SjcHistoryApiItem = {
  Id: number;
  Buy: string;
  Sell: string;
  BuyValue: number;
  TypeName: string;
  BuyDiffer: string | null;
  GroupDate: string;
  SellValue: number;
  BranchName: string;
  SellDiffer: string | null;
  BuyDifferValue: number;
  SellDifferValue: number;
};

export type SjcHistoryApiResponse = {
  data: SjcHistoryApiItem[];
  success: boolean;
  latestDate?: string;
};

export type SjcDailySnapshot = {
  day: string;
  payload: SjcHistoryApiResponse;
};

const SJC_HISTORY_ENDPOINT = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx';

function formatSjcDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatIsoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function createDateRange(fromDate: string, toDate: string) {
  const start = new Date(`${fromDate}T00:00:00+07:00`);
  const end = new Date(`${toDate}T00:00:00+07:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid fromDate or toDate. Expected format YYYY-MM-DD.');
  }

  if (start > end) {
    throw new Error('fromDate must be earlier than or equal to toDate.');
  }

  const dates: Date[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export async function fetchSjcDailySnapshot(day: Date, goldPriceId = 1) {
  const body = new URLSearchParams({
    method: 'GetGoldPriceHistory',
    goldPriceId: `${goldPriceId}`,
    fromDate: formatSjcDate(day),
    toDate: formatSjcDate(day),
  });

  const response = await fetch(SJC_HISTORY_ENDPOINT, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://sjc.com.vn',
      referer: 'https://sjc.com.vn/',
      'x-requested-with': 'XMLHttpRequest',
    },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SJC history request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as SjcHistoryApiResponse;

  console.log('payload', payload);

  return {
    day: formatIsoDay(day),
    payload,
  } satisfies SjcDailySnapshot;
}

export async function fetchSjcSnapshotsInRange(fromDate: string, toDate: string, goldPriceId = 1) {
  const dates = createDateRange(fromDate, toDate);
  const snapshots: SjcDailySnapshot[] = [];

  for (const day of dates) {
    snapshots.push(await fetchSjcDailySnapshot(day, goldPriceId));
  }

  return snapshots;
}
