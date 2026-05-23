"use client";

import { getPosts } from "@/lib/requests";
import { PostEdge, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import BlogCard from "./blog-card";
import TagLink from "./tag-link";
import { Button } from "./ui/button";

type Props = {
  tagSlug?: string;
};

const tagLabelWordOverrides: Record<string, string> = {
  ai: "AI",
};

function collectTags(postEdges: PostEdge[]) {
  const tagMap = new Map<string, Tag>();

  for (const post of postEdges) {
    for (const tag of post.node.tags) {
      tagMap.set(tag.slug, tag);
    }
  }

  return Array.from(tagMap.values()).sort((firstTag, secondTag) =>
    firstTag.name.localeCompare(secondTag.name),
  );
}

function formatTagLabel(tagSlug: string) {
  return tagSlug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      const normalizedWord = word.toLowerCase();

      return (
        tagLabelWordOverrides[normalizedWord] ??
        normalizedWord[0]?.toUpperCase() + normalizedWord.slice(1)
      );
    })
    .join(" ");
}

export default function Posts({ tagSlug }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", tagSlug ?? "all"],
      queryFn: ({ pageParam }) => getPosts({ pageParam, tagSlug }),
      getNextPageParam: (lastPage) =>
        lastPage.length < 9 ? undefined : lastPage[lastPage.length - 1].cursor,
      initialPageParam: "",
    });
  const postEdges = data?.pages.flatMap((group) => group ?? []) ?? [];
  const availableTags = collectTags(postEdges);
  const activeTag = tagSlug
    ? availableTags.find((tag) => tag.slug === tagSlug) ?? {
        id: `tag-${tagSlug}`,
        name: formatTagLabel(tagSlug),
        slug: tagSlug,
      }
    : null;
  const hasPosts = postEdges.length > 0;
  const allArticlesHref = "/#latest-writing";

  return (
    <>
      {availableTags.length > 0 || activeTag ? (
        <div className="col-span-1 flex flex-col gap-3 lg:col-span-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Filter articles by tag"
              className="flex flex-wrap gap-2"
            >
              <Link
                href={allArticlesHref}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 font-display text-[0.66rem] font-semibold uppercase tracking-[0.18em] transition-[border-color,background-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  activeTag
                    ? "border-border/70 bg-[hsl(var(--surface)/0.72)] text-muted-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground"
                    : "border-primary/45 bg-primary/10 text-primary shadow-[var(--shadow-soft)]",
                )}
              >
                All Articles
              </Link>
              {availableTags.map((tag) => (
                <TagLink
                  key={tag.slug}
                  tag={tag}
                  active={tag.slug === tagSlug}
                />
              ))}
            </nav>
            {activeTag ? (
              <p className="text-sm text-muted-foreground">
                Showing {postEdges.length} article{postEdges.length === 1 ? "" : "s"} tagged{" "}
                <span className="font-semibold text-foreground">{activeTag.name}</span>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {!hasPosts && activeTag ? (
        <div className="col-span-1 flex min-h-52 flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-border/80 bg-[hsl(var(--surface)/0.68)] px-6 py-10 text-center lg:col-span-3">
          <p className="font-display text-xl font-semibold tracking-[-0.02em]">
            No articles yet for {activeTag.name}.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Try another tag or jump back to the full journal to browse everything.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full px-6">
            <Link href={allArticlesHref}>Show all articles</Link>
          </Button>
        </div>
      ) : null}

      {postEdges.map((post, index) => {
        const isFeatured = !activeTag && index === 0;
        return (
          <BlogCard
            key={post.cursor}
            post={post.node}
            loading={index < 3 ? "eager" : undefined}
            variant={isFeatured ? "featured" : "default"}
          />
        );
      })}
      {hasPosts ? (
        <div className="col-span-1 mt-4 flex w-full justify-center sm:mt-5 lg:col-span-3">
          <Button
            className="w-full rounded-full border-border/80 bg-[hsl(var(--surface))] px-8 py-6 text-sm font-semibold tracking-[0.18em] text-foreground disabled:bg-[hsl(var(--surface))] disabled:text-muted-foreground disabled:opacity-100 sm:w-auto"
            variant="outline"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage
              ? "Loading..."
              : hasNextPage
              ? "Load more"
              : "That's all for today!"}
          </Button>
        </div>
      ) : null}
    </>
  );
}
