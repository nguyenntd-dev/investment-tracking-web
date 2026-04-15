import { notFound } from 'next/navigation';

import { FundCertificateDetail } from '@/components/fund-certificate-detail';
import { fundRecords, getFundBySymbol } from '@/lib/fund-data';

export function generateStaticParams() {
  return fundRecords.map((fund) => ({
    symbol: fund.symbol.toLowerCase(),
  }));
}

export default async function FundCertificateDetailPage(
  props: PageProps<'/fund-certificates/[symbol]'>,
) {
  const { symbol } = await props.params;
  const fund = getFundBySymbol(symbol);

  if (!fund) {
    notFound();
  }

  return <FundCertificateDetail fund={fund} />;
}
