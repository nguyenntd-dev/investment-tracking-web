export type FundType = 'bond' | 'balanced' | 'stock';

export type FundHistoryPoint = {
  date: string;
  nav: number;
};

export type FundRecord = {
  id: number;
  name: string;
  fullName: string;
  symbol: string;
  type: FundType;
  company: string;
  companyCode: string;
  supervisingBank: string;
  change24h: number;
  marketPrice: string;
  latestNav: string;
  latestNavDate: string;
  ytd: number;
  inceptionDate: string;
  strategy: string;
  description: string;
  history: FundHistoryPoint[];
};

function history(base: number, offsets: number[]): FundHistoryPoint[] {
  const dates = [
    '2026-01-04',
    '2026-01-13',
    '2026-01-22',
    '2026-02-03',
    '2026-02-22',
    '2026-03-04',
    '2026-03-16',
    '2026-03-26',
    '2026-04-13',
  ];

  return dates.map((date, index) => ({
    date,
    nav: Number((base + offsets[index]).toFixed(2)),
  }));
}

export const fundRecords: FundRecord[] = [
  {
    id: 1,
    name: 'VinaCapital Equity Opportunity',
    fullName: 'Quy Dau Tu Co Phieu Co Tuc Nang Dong VinaCapital',
    symbol: 'VEOF',
    type: 'stock',
    company: 'VinaCapital Fund Management',
    companyCode: 'VCFM',
    supervisingBank: 'Standard Chartered Vietnam',
    change24h: 1.84,
    marketPrice: '36,420.62 đ',
    latestNav: '12,702.19 đ',
    latestNavDate: '2026-04-13',
    ytd: 7.75,
    inceptionDate: '2014-07-09',
    strategy:
      'Focused on listed Vietnamese companies with durable dividend capacity, healthy balance sheets, and room for long-term earnings expansion.',
    description:
      'Built for investors who want equity exposure with a steadier cash-return profile and disciplined allocation into market-leading businesses.',
    history: history(12702.19, [-620, 340, 410, 200, 520, 760, 250, 210, 0]),
  },
  {
    id: 2,
    name: 'Techcom Balanced Growth',
    fullName: 'Techcom Balanced Growth Fund',
    symbol: 'TCBF',
    type: 'balanced',
    company: 'Techcom Capital',
    companyCode: 'TCC',
    supervisingBank: 'HSBC Vietnam',
    change24h: 0.92,
    marketPrice: '24,180.40 đ',
    latestNav: '24,180.40 đ',
    latestNavDate: '2026-04-13',
    ytd: 5.12,
    inceptionDate: '2019-03-18',
    strategy:
      'Combines fixed income stability and selective equity rotation to keep volatility moderate while compounding above deposit benchmarks.',
    description:
      'Designed for investors building medium-risk portfolios that still want measurable upside from Vietnamese equity sectors.',
    history: history(24180.4, [-980, -720, -430, -210, 120, 180, 95, 60, 0]),
  },
  {
    id: 3,
    name: 'Vietcombank Bond Income',
    fullName: 'Vietcombank Bond Income Fund',
    symbol: 'VCBF-FIF',
    type: 'bond',
    company: 'Vietcombank Fund Management',
    companyCode: 'VCBF',
    supervisingBank: 'Vietcombank',
    change24h: 0.41,
    marketPrice: '15,769.90 đ',
    latestNav: '15,769.90 đ',
    latestNavDate: '2026-04-09',
    ytd: 2.60,
    inceptionDate: '2013-08-12',
    strategy:
      'Prioritizes high-quality bonds, bank deposits, and money-market instruments to preserve capital and maintain liquidity.',
    description:
      'Useful as the defensive leg inside a broader portfolio or as a parking layer for near-term investment plans.',
    history: history(15769.9, [-220, -180, -130, -90, -60, -25, -12, -8, 0]),
  },
  {
    id: 4,
    name: 'SSI Sustainable Leaders',
    fullName: 'SSI Sustainable Leaders Fund',
    symbol: 'SSISCA',
    type: 'stock',
    company: 'SSI Asset Management',
    companyCode: 'SSIAM',
    supervisingBank: 'BIDV',
    change24h: 1.22,
    marketPrice: '19,845.00 đ',
    latestNav: '19,845.00 đ',
    latestNavDate: '2026-04-13',
    ytd: 6.18,
    inceptionDate: '2020-10-21',
    strategy:
      'Screens for category leaders with improving governance, cash generation, and room to benefit from Vietnam’s domestic demand cycle.',
    description:
      'A growth-oriented stock fund with a quality tilt, suitable for investors who prefer concentrated conviction over broad indexing.',
    history: history(19845, [-930, -540, -410, -180, 110, 360, 240, 120, 0]),
  },
  {
    id: 5,
    name: 'Dragon Capital Dynamic Allocation',
    fullName: 'Dragon Capital Dynamic Allocation Fund',
    symbol: 'DCDA',
    type: 'balanced',
    company: 'Dragon Capital Vietnam',
    companyCode: 'DCVFM',
    supervisingBank: 'Deutsche Bank Vietnam',
    change24h: -0.18,
    marketPrice: '21,642.55 đ',
    latestNav: '21,642.55 đ',
    latestNavDate: '2026-04-13',
    ytd: 3.48,
    inceptionDate: '2018-05-07',
    strategy:
      'Adjusts between equities, bonds, and cash based on market regime to reduce drawdowns while retaining upside participation.',
    description:
      'An allocation-first fund for investors who want smoother portfolio behavior across changing liquidity and valuation conditions.',
    history: history(21642.55, [-510, -280, -210, 90, 170, 120, 80, 35, 0]),
  },
  {
    id: 6,
    name: 'MB Bond Shield',
    fullName: 'MB Bond Shield Fund',
    symbol: 'MBBF',
    type: 'bond',
    company: 'MB Capital',
    companyCode: 'MBCapital',
    supervisingBank: 'Military Bank',
    change24h: 0.27,
    marketPrice: '12,610.30 đ',
    latestNav: '12,610.30 đ',
    latestNavDate: '2026-04-13',
    ytd: 2.14,
    inceptionDate: '2021-01-14',
    strategy:
      'Invests across sovereign debt, high-grade corporate issues, and cash instruments to protect principal and limit rate shocks.',
    description:
      'Geared toward income-focused investors who need a low-volatility reserve sleeve in their asset mix.',
    history: history(12610.3, [-190, -140, -120, -90, -65, -40, -28, -12, 0]),
  },
  {
    id: 7,
    name: 'VNDirect Growth Select',
    fullName: 'VNDirect Growth Select Fund',
    symbol: 'VNDGF',
    type: 'stock',
    company: 'VNDirect Fund Management',
    companyCode: 'VNDAM',
    supervisingBank: 'ACB',
    change24h: 2.06,
    marketPrice: '17,382.10 đ',
    latestNav: '17,382.10 đ',
    latestNavDate: '2026-04-13',
    ytd: 8.34,
    inceptionDate: '2022-06-02',
    strategy:
      'Targets sectors with accelerating earnings revisions and uses liquidity screens to keep rebalancing efficient.',
    description:
      'Fits investors comfortable with stronger momentum and slightly wider performance swings in exchange for faster capture of trend changes.',
    history: history(17382.1, [-920, -480, -260, -110, 330, 540, 280, 140, 0]),
  },
  {
    id: 8,
    name: 'AFA Balanced Reserve',
    fullName: 'AFA Balanced Reserve Fund',
    symbol: 'AFABR',
    type: 'balanced',
    company: 'An Binh Fund Advisory',
    companyCode: 'AFA',
    supervisingBank: 'Sacombank',
    change24h: 0.13,
    marketPrice: '18,905.88 đ',
    latestNav: '18,905.88 đ',
    latestNavDate: '2026-04-13',
    ytd: 4.06,
    inceptionDate: '2017-11-28',
    strategy:
      'Balances income instruments with measured equity exposure to support capital growth while avoiding aggressive drawdowns.',
    description:
      'A middle-ground option for investors moving from deposits into funds and wanting a clearer risk ceiling.',
    history: history(18905.88, [-430, -220, -150, -80, 70, 120, 95, 40, 0]),
  },
];

export function getFundBySymbol(symbol: string) {
  return fundRecords.find((fund) => fund.symbol.toLowerCase() === symbol.toLowerCase());
}
