type AssetOverviewProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
    tone?: 'warm' | 'neutral';
  }>;
};

export function AssetOverview({ eyebrow, title, description, stats }: AssetOverviewProps) {
  return (
    <section className="flex min-h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10">
      <div className="max-w-3xl">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.3em]">{eyebrow}</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 md:text-lg">{description}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-border/70 rounded-3xl border bg-white/75 px-5 py-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.45)] backdrop-blur"
          >
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p
              className={
                stat.tone === 'warm'
                  ? 'mt-3 text-2xl font-semibold tracking-tight text-[#9b6c12]'
                  : 'mt-3 text-2xl font-semibold tracking-tight'
              }
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
