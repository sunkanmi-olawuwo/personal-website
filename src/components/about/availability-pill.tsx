import type { AvailabilityStatus, AvailabilityTone } from "@/lib/site-profile";
import { cn } from "@/lib/utils";

type Props = {
  status: AvailabilityStatus;
  className?: string;
};

const toneDotClass: Record<AvailabilityTone, string> = {
  open: "bg-emerald-500",
  writing: "bg-[hsl(var(--accent))]",
  "heads-down": "bg-muted-foreground",
};

export default function AvailabilityPill({ status, className }: Props) {
  const tone = status.tone ?? "open";

  return (
    <span
      data-availability-pill
      data-tone={tone}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-[hsl(var(--surface)/0.85)] px-3 py-1 font-display text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", toneDotClass[tone])} />
      <span>{status.label}</span>
    </span>
  );
}
