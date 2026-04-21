import type { NextRequest } from 'next/server';

import { parseHistoryRequest } from '@/lib/sjc/history-api';
import { getSjcPriceHistory } from '@/lib/supabase/sjc-daily-prices';

function badRequestResponse(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const parsed = parseHistoryRequest(request.nextUrl.searchParams);

  if (!parsed.ok) {
    return badRequestResponse(parsed.error);
  }

  try {
    const history = await getSjcPriceHistory(
      parsed.value.goldProductOptions,
      parsed.value.fromDate,
      parsed.value.toDate,
    );

    return Response.json(history);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected history fetch error.',
      },
      { status: 500 },
    );
  }
}
