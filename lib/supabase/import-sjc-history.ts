import 'server-only';

import { createSupabaseServiceClient } from '@/lib/supabase/service-client';
import type { SjcDailySnapshot } from '@/lib/sjc/history-import';

export async function getExistingSjcSnapshotDays(fromDate: string, toDate: string) {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('sjc_daily_prices')
    .select('latest_day')
    .gte('latest_day', fromDate)
    .lte('latest_day', toDate);

  if (error) {
    throw new Error(`Failed to read existing sjc_daily_prices rows: ${error.message}`);
  }

  return new Set(
    (data ?? [])
      .map((item) => item.latest_day)
      .filter((value): value is string => Boolean(value)),
  );
}

export async function upsertSjcDailySnapshot(snapshot: SjcDailySnapshot) {
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase.from('sjc_daily_prices').upsert(
    {
      data: snapshot.payload,
      latest_day: snapshot.day,
    },
    {
      onConflict: 'latest_day',
    },
  );

  if (error) {
    throw new Error(`Failed to upsert sjc_daily_prices for ${snapshot.day}: ${error.message}`);
  }
}

export async function importSjcHistoryRange(snapshots: SjcDailySnapshot[], existingDays: Set<string>) {
  let imported = 0;
  let skipped = 0;
  const failed: Array<{ day: string; reason: string }> = [];

  for (const snapshot of snapshots) {
    if (existingDays.has(snapshot.day)) {
      skipped += 1;
      continue;
    }

    try {
      await upsertSjcDailySnapshot(snapshot);
      imported += 1;
    } catch (error) {
      failed.push({
        day: snapshot.day,
        reason: error instanceof Error ? error.message : 'Unknown import error.',
      });
    }
  }

  return {
    imported,
    skipped,
    failed,
  };
}
