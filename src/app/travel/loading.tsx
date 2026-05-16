export default function TravelLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading travel atlas"
      className="mx-auto flex w-full max-w-[52rem] animate-pulse flex-col gap-7 px-5 pb-12 pt-6 sm:px-10 md:px-11 lg:max-w-[76rem] lg:gap-10 lg:px-8 lg:pt-9"
    >
      <section className="page-reveal flex flex-col gap-4">
        <div className="h-6 w-24 rounded-full bg-[hsl(var(--surface-strong))]" />
        <div className="h-10 w-3/4 rounded-md bg-[hsl(var(--surface-strong))] sm:h-12" />
        <div className="h-10 w-1/2 rounded-md bg-[hsl(var(--surface-strong))] sm:h-12" />
        <div className="h-4 w-full max-w-xl rounded bg-[hsl(var(--surface-strong))]" />
        <div className="flex flex-wrap gap-3">
          {["a", "b", "c", "d"].map((item) => (
            <div
              key={item}
              className="h-5 w-24 rounded bg-[hsl(var(--surface-strong))]"
            />
          ))}
        </div>
      </section>

      <section className="page-reveal travel-shell px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.85fr)] md:items-stretch lg:gap-8">
          <div className="min-h-[19rem] rounded-2xl bg-[hsl(var(--surface-strong))] sm:min-h-[22rem] md:min-h-[28rem] lg:min-h-[30rem]" />
          <div className="min-h-[18rem] rounded-2xl bg-[hsl(var(--surface-strong))]" />
        </div>
      </section>

      <section className="page-reveal flex flex-col gap-4">
        <div className="h-7 w-48 rounded bg-[hsl(var(--surface-strong))]" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[14rem]">
          <div className="h-64 rounded-2xl bg-[hsl(var(--surface-strong))] sm:h-72 lg:col-span-8 lg:row-span-2 lg:h-auto lg:min-h-[28rem]" />
          <div className="h-64 rounded-2xl bg-[hsl(var(--surface-strong))] sm:h-72 lg:col-span-4 lg:h-auto" />
          <div className="h-64 rounded-2xl bg-[hsl(var(--surface-strong))] sm:h-72 lg:col-span-4 lg:h-auto" />
        </div>
      </section>

      <span className="sr-only">Loading atlas…</span>
    </main>
  );
}
