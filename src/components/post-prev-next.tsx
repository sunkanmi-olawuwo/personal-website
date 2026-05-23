"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";

import { getPosts } from "@/lib/requests";
import type { PostEdge, PostMetadata } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  currentSlug: string;
};

type Neighbour = {
  title: string;
  slug: string;
};

function neighbourFrom(post: PostMetadata | undefined): Neighbour | null {
  if (!post?.slug) {
    return null;
  }

  return { title: post.title, slug: post.slug };
}

export default function PostPrevNext({ currentSlug }: Props) {
  const { data } = useInfiniteQuery({
    queryKey: ["posts", "all"],
    queryFn: ({ pageParam }) => getPosts({ pageParam }),
    getNextPageParam: (lastPage: PostEdge[]) =>
      lastPage.length < 9 ? undefined : lastPage[lastPage.length - 1].cursor,
    initialPageParam: "",
  });

  const flat = data?.pages.flatMap((page) => page ?? []) ?? [];
  const index = flat.findIndex((edge) => edge.node.slug === currentSlug);

  if (index === -1 || flat.length < 2) {
    return null;
  }

  const previous = neighbourFrom(flat[index - 1]?.node);
  const next = neighbourFrom(flat[index + 1]?.node);

  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Adjacent essays"
      className="mt-2 grid gap-3 sm:grid-cols-2"
    >
      <NeighbourCard
        neighbour={previous}
        direction="previous"
        align="left"
      />
      <NeighbourCard neighbour={next} direction="next" align="right" />
    </nav>
  );
}

function NeighbourCard({
  neighbour,
  direction,
  align,
}: {
  neighbour: Neighbour | null;
  direction: "previous" | "next";
  align: "left" | "right";
}) {
  if (!neighbour) {
    return <div className="hidden sm:block" aria-hidden />;
  }

  const label = direction === "previous" ? "← Previous essay" : "Next essay →";

  return (
    <Link
      href={`/${neighbour.slug}`}
      className={cn(
        "interactive-surface flex flex-col gap-2 rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.84)] p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-primary/40",
        align === "right" && "sm:text-right",
      )}
    >
      <span className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-primary/75">
        {label}
      </span>
      <span className="text-balance font-display text-base font-bold leading-snug text-foreground sm:text-lg">
        {neighbour.title}
      </span>
    </Link>
  );
}
