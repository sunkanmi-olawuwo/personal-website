export default function PostSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading post"
      data-post-skeleton
      className="mx-auto flex w-full max-w-4xl animate-pulse flex-col gap-8"
    >
      <div className="page-reveal flex flex-col gap-5">
        <div className="h-9 w-32 rounded-full bg-[hsl(var(--surface-strong))]" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-24 rounded-full bg-[hsl(var(--surface-strong))]" />
          <div className="h-6 w-28 rounded-full bg-[hsl(var(--surface-strong))]" />
        </div>
        <div className="space-y-3">
          <div className="h-12 w-11/12 rounded-md bg-[hsl(var(--surface-strong))] sm:h-14" />
          <div className="h-12 w-9/12 rounded-md bg-[hsl(var(--surface-strong))] sm:h-14" />
        </div>
        <div className="h-5 w-2/3 rounded-md bg-[hsl(var(--surface-strong))]" />
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[hsl(var(--surface-strong))]" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 rounded-md bg-[hsl(var(--surface-strong))]" />
            <div className="h-3 w-48 rounded-md bg-[hsl(var(--surface-strong))]" />
          </div>
        </div>
      </div>
      <div className="page-reveal aspect-[16/9] w-full rounded-[1.8rem] bg-[hsl(var(--surface-strong))]" />
      <div className="section-shell flex flex-col gap-4 px-5 py-8 sm:px-8 lg:px-10">
        <div className="h-4 w-full rounded bg-[hsl(var(--surface-strong))]" />
        <div className="h-4 w-11/12 rounded bg-[hsl(var(--surface-strong))]" />
        <div className="h-4 w-10/12 rounded bg-[hsl(var(--surface-strong))]" />
        <div className="h-4 w-9/12 rounded bg-[hsl(var(--surface-strong))]" />
        <div className="h-4 w-11/12 rounded bg-[hsl(var(--surface-strong))]" />
      </div>
      <span className="sr-only">Loading post…</span>
    </div>
  );
}
