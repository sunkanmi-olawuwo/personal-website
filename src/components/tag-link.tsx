import type { Tag } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  tag: Tag;
  active?: boolean;
  className?: string;
  href?: string;
};

export function getTagHref(tagSlug: string) {
  return `/?tag=${tagSlug}#latest-writing`;
}

export default function TagLink({
  tag,
  active = false,
  className,
  href = getTagHref(tag.slug),
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-display text-[0.66rem] font-semibold uppercase tracking-[0.18em] transition-[border-color,background-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active
          ? "border-primary/45 bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
          : "border-border/70 bg-[hsl(var(--surface)/0.82)] text-muted-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground",
        className,
      )}
    >
      {tag.name}
    </Link>
  );
}
