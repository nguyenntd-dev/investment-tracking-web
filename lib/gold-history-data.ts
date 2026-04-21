export const goldPeriodOptions = [
  { id: '1d', label: '1 day' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
] as const;

export type GoldPeriod = (typeof goldPeriodOptions)[number]['id'];
export type GoldProduct = 'vang-nhan-1l' | 'vang-mieng-1l';

type GoldHistoryApiItem = {
  TypeName: string;
  BuyValue: number;
  SellValue: number;
  GroupDate: string;
};

type GoldHistoryApiResponse = {
  success: boolean;
  data: GoldHistoryApiItem[];
};

export type GoldChartPoint = {
  label: string;
  summaryLabel: string;
  buy: number;
  sell: number;
  buyDisplay: string;
  sellDisplay: string;
};

export type GoldChartSeries = {
  range: string;
  title: string;
  subtitle: string;
  points: GoldChartPoint[];
};

export const goldProductOptions: Array<{ id: GoldProduct; label: string; title: string }> = [
  { id: 'vang-nhan-1l', label: 'Vàng Nhẫn 1L', title: 'Bảng giá Vàng Nhẫn 1L' },
  { id: 'vang-mieng-1l', label: 'Vàng Miếng 1L', title: 'Bảng giá Vàng Miếng 1L' },
];

const endDate = new Date('2026-04-14T09:00:00');

function formatShortDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${day}-${month}`;
}

function formatFullDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatRange(dayCount: number) {
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (dayCount - 1));
  return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
}

function formatApiDate(date: Date) {
  return `\\/Date(${date.getTime()})\\/`;
}

function parseApiDate(raw: string) {
  const matched = raw.match(/Date\((\d+)\)/);
  return matched ? new Date(Number(matched[1])) : new Date(raw);
}

function createMockApiResponse(
  dayCount: number,
  typeName: string,
  baseBuy: number,
  spreadBase: number,
  trendStrength: number,
  volatility: number,
  intraday = false,
): GoldHistoryApiResponse {
  const dates = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(endDate);
    if (intraday) {
      const intradayHours = [0, 2, 4, 6, 8, 8.5, 9];
      const totalHours = intradayHours[index] ?? index;
      date.setHours(Math.floor(totalHours), totalHours % 1 === 0.5 ? 30 : 0, 0, 0);
    } else {
      date.setDate(endDate.getDate() - (dayCount - 1 - index));
      date.setHours(9, 0, 0, 0);
    }
    return date;
  });

  const data = dates.map((date, index) => {
    const trend = index * trendStrength;
    const swingA = Math.sin(index * 0.41) * volatility;
    const swingB = Math.cos(index * 0.17 + 0.6) * (volatility * 0.72);
    const swingC = Math.sin(index * 0.08 + 1.1) * (volatility * 1.18);
    const pullback = index % 9 === 3 ? -volatility * 1.6 : 0;
    const burst = index % 11 === 5 ? volatility * 1.4 : 0;
    const buyValue = Math.round(baseBuy + trend + swingA + swingB + swingC + pullback + burst) * 1000;
    const sellValue = Math.round(
      buyValue + spreadBase * 1000 + Math.cos(index * 0.23) * 48000 + Math.sin(index * 0.09 + 0.7) * 34000,
    );

    return {
      TypeName: typeName,
      BuyValue: buyValue,
      SellValue: sellValue,
      GroupDate: formatApiDate(date),
    } satisfies GoldHistoryApiItem;
  });

  return { success: true, data };
}

const goldHistoryByProduct: Record<GoldProduct, Record<GoldPeriod, GoldHistoryApiResponse>> = {
  'vang-mieng-1l': {
    '1d': createMockApiResponse(7, 'Vàng Miếng 1L', 168920, 2960, 110, 280, true),
    '7d': {
      success: true,
      data: [
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 169240000,
          SellValue: 172120000,
          GroupDate: '\\/Date(1775610000000)\\/',
        },
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 170310000,
          SellValue: 173420000,
          GroupDate: '\\/Date(1775696400000)\\/',
        },
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 168920000,
          SellValue: 171480000,
          GroupDate: '\\/Date(1775782800000)\\/',
        },
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 169640000,
          SellValue: 172260000,
          GroupDate: '\\/Date(1775869200000)\\/',
        },
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 169420000,
          SellValue: 172030000,
          GroupDate: '\\/Date(1775955600000)\\/',
        },
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 168980000,
          SellValue: 171510000,
          GroupDate: '\\/Date(1776042000000)\\/',
        },
        {
          TypeName: 'Vàng Miếng 1L',
          BuyValue: 169954000,
          SellValue: 173070000,
          GroupDate: '\\/Date(1776128400000)\\/',
        },
      ],
    },
    '30d': createMockApiResponse(30, 'Vàng Miếng 1L', 162400, 2860, 192, 210),
  },
  'vang-nhan-1l': {
    '1d': createMockApiResponse(7, 'Vàng Nhẫn 1L', 165880, 2450, 80, 220, true),
    '7d': {
      success: true,
      data: [
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 165420000, SellValue: 167940000, GroupDate: '\\/Date(1775610000000)\\/' },
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 166180000, SellValue: 168760000, GroupDate: '\\/Date(1775696400000)\\/' },
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 165260000, SellValue: 167760000, GroupDate: '\\/Date(1775782800000)\\/' },
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 165940000, SellValue: 168420000, GroupDate: '\\/Date(1775869200000)\\/' },
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 165710000, SellValue: 168180000, GroupDate: '\\/Date(1775955600000)\\/' },
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 165380000, SellValue: 167860000, GroupDate: '\\/Date(1776042000000)\\/' },
        { TypeName: 'Vàng Nhẫn 1L', BuyValue: 166310000, SellValue: 168860000, GroupDate: '\\/Date(1776128400000)\\/' },
      ],
    },
    '30d': createMockApiResponse(30, 'Vàng Nhẫn 1L', 158600, 2480, 164, 175),
  },
};

export function getGoldChartSeries(product: GoldProduct, period: GoldPeriod): GoldChartSeries {
  const response = goldHistoryByProduct[product][period];
  const selectedProduct = goldProductOptions.find((item) => item.id === product)!;
  const points = response.data.map((item) => {
    const date = parseApiDate(item.GroupDate);
    return {
      label:
        period === '1d'
          ? `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`
          : formatShortDate(date),
      summaryLabel: `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}:${`${date.getSeconds()}`.padStart(2, '0')} ${formatFullDate(date)}`,
      buy: Math.round(item.BuyValue / 1000),
      sell: Math.round(item.SellValue / 1000),
      buyDisplay: item.BuyValue.toLocaleString('en-US'),
      sellDisplay: item.SellValue.toLocaleString('en-US'),
    };
  });

  return {
    range: period === '1d' ? '14-04 - 14-04' : formatRange(points.length),
    title: selectedProduct.title,
    subtitle:
      period === '1d'
        ? 'trong hôm nay tại SJC'
        : `trong ${goldPeriodOptions.find((item) => item.id === period)?.label.toLowerCase()} qua tại SJC`,
    points,
  };
}
