export default function TravelLoading() {
  return (
    <main className="mx-auto flex w-full max-w-[52rem] flex-col gap-7 px-5 pb-10 pt-6 sm:px-10 md:px-11 lg:max-w-[76rem] lg:gap-9 lg:px-8 lg:pt-9">
      <section className="grid animate-pulse gap-5 md:grid-cols-[minmax(0,1fr)_16rem] lg:gap-8">
        <div className="space-y-3">
          <div className="h-6 w-16 rounded bg-primary/10 dark:bg-cyan-300/10" />
          <div className="h-4 w-full max-w-xl rounded bg-muted/80 dark:bg-slate-800/70" />
          <div className="h-4 w-3/4 rounded bg-muted/80 dark:bg-slate-800/70" />
        </div>
        <div className="grid max-w-sm grid-cols-2 gap-2 md:max-w-none">
          {["countries", "continents", "cities", "memories"].map((item) => (
            <div
              key={item}
              className="h-16 rounded-md border border-border/70 bg-[hsl(var(--surface)/0.9)] dark:border-cyan-200/20 dark:bg-slate-900/40"
            />
          ))}
        </div>
      </section>

      <section className="animate-pulse">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.85fr)] md:items-center lg:gap-8">
          <div className="min-h-[19rem] rounded-md border border-primary/20 bg-[radial-gradient(ellipse_at_50%_46%,hsl(var(--primary)/0.18),transparent_58%),linear-gradient(135deg,hsl(var(--surface)/0.98)_0%,hsl(var(--surface-strong)/0.78)_48%,hsl(var(--background)/0.9)_100%)] dark:border-transparent dark:bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.18),transparent_45%)] sm:min-h-[22rem] md:min-h-[30rem] lg:min-h-[32rem]" />
          <div className="min-h-[15rem] rounded-md border border-border/80 bg-[hsl(var(--surface)/0.96)] dark:border-cyan-200/20 dark:bg-slate-900/60" />
        </div>
      </section>

      <section className="animate-pulse">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 rounded-md bg-muted/80 dark:bg-slate-800/70 sm:h-60 md:h-64 lg:h-72"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
