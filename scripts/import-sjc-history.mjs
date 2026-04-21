#!/usr/bin/env node

function printUsage() {
  console.log(`
Usage:
  pnpm import:sjc-history --from=YYYY-MM-DD --to=YYYY-MM-DD [--goldPriceId=1] [--baseUrl=http://localhost:3000]

Environment variables:
  SJC_IMPORT_BASE_URL   Optional. Defaults to http://localhost:3000
  SJC_IMPORT_SECRET     Optional. Sent as x-import-secret when present

Examples:
  pnpm import:sjc-history --from=2026-01-01 --to=2026-04-20
  pnpm import:sjc-history --from=2026-01-01 --to=2026-04-20 --goldPriceId=1
  SJC_IMPORT_SECRET=my-secret pnpm import:sjc-history --from=2026-01-01 --to=2026-04-20
`.trim());
}

function parseArgs(argv) {
  const args = {};

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      args.help = 'true';
      continue;
    }

    if (!arg.startsWith('--')) {
      continue;
    }

    const [key, ...rest] = arg.slice(2).split('=');
    args[key] = rest.join('=') || 'true';
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help === 'true') {
    printUsage();
    process.exit(0);
  }

  const fromDate = args.from;
  const toDate = args.to;

  if (!fromDate || !toDate) {
    printUsage();
    throw new Error('Missing required --from and --to arguments.');
  }

  const goldPriceId = Number(args.goldPriceId ?? '1');

  if (!Number.isInteger(goldPriceId) || goldPriceId <= 0) {
    throw new Error('--goldPriceId must be a positive integer.');
  }

  const baseUrl = (args.baseUrl || process.env.SJC_IMPORT_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const secret = process.env.SJC_IMPORT_SECRET?.trim();

  const response = await fetch(`${baseUrl}/api/sjc/import-history`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(secret ? { 'x-import-secret': secret } : {}),
    },
    body: JSON.stringify({
      fromDate,
      toDate,
      goldPriceId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(JSON.stringify(data, null, 2));
    throw new Error(`Import request failed with status ${response.status}.`);
  }

  console.log('SJC history import completed.');
  console.log(JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
