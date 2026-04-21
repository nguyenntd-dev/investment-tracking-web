import { fetchSjcSnapshotsInRange } from '@/lib/sjc/history-import';
import { getExistingSjcSnapshotDays, importSjcHistoryRange } from '@/lib/supabase/import-sjc-history';

type ImportHistoryRequestBody = {
  fromDate?: string;
  toDate?: string;
  goldPriceId?: number;
};

function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized.' }, { status: 401 });
}

function badRequestResponse(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

function isAuthorized(request: Request) {
  const configuredSecret = process.env.SJC_IMPORT_SECRET?.trim();

  if (!configuredSecret) {
    return true;
  }

  return request.headers.get('x-import-secret') === configuredSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  let body: ImportHistoryRequestBody;

  try {
    body = (await request.json()) as ImportHistoryRequestBody;
  } catch {
    return badRequestResponse('Invalid JSON body.');
  }

  if (!body.fromDate || !body.toDate) {
    return badRequestResponse('fromDate and toDate are required in YYYY-MM-DD format.');
  }

  try {
    const existingDays = await getExistingSjcSnapshotDays(body.fromDate, body.toDate);
    const snapshots = await fetchSjcSnapshotsInRange(body.fromDate, body.toDate, body.goldPriceId ?? 1);
    const result = await importSjcHistoryRange(snapshots, existingDays);

    return Response.json({
      fromDate: body.fromDate,
      toDate: body.toDate,
      goldPriceId: body.goldPriceId ?? 1,
      requestedDays: snapshots.length,
      imported: result.imported,
      skipped: result.skipped,
      failed: result.failed,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected import error.',
      },
      { status: 500 },
    );
  }
}
