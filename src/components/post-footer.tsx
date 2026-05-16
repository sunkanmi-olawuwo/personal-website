"use client";

import Image from "next/image";
import Link from "next/link";

import { getPosts } from "@/lib/requests";
import { siteProfile } from "@/lib/site-profile";
import type { PostDetails } from "@/lib/types";
import { cn, formatPublishedDate, getReadingMinutes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type Props = {
  slug: string;
  post: PostDetails;
};

const LOCAL_AUTHOR_AVATAR = "/blog-profile-photo.png";

export default function PostFooter({ slug, post }: Props) {
  const primaryTagSlug = post.tags[0]?.slug;
  const authorBio = post.author.bio || siteProfile.heroSummary;

  const { data: relatedEdges } = useQuery({
    enabled: Boolean(primaryTagSlug),
    queryKey: ["related-posts", primaryTagSlug ?? "", slug],
    queryFn: () => getPosts({ first: 4, tagSlug: primaryTagSlug }),
    staleTime: 60_000,
  });

  const relatedPosts =
    relatedEdges
      ?.filter((edge) => edge.node.slug !== slug)
      .slice(0, 3) ?? [];

  function handleShare() {
    if (typeof window === "undefined") {
      return;
    }

    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({ title: post.title, url })
        .catch(() => {
          navigator.clipboard?.writeText(url);
        });
      return;
    }

    navigator.clipboard?.writeText(url);
  }

  return (
    <section
      data-post-footer
      aria-label="About the author and related reading"
      className="mt-8 flex flex-col gap-10"
    >
      <div className="flex flex-col gap-5 rounded-[1.8rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] p-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:gap-7 sm:p-8">
        <Image
          src={LOCAL_AUTHOR_AVATAR}
          alt={`${post.author.name} portrait`}
          width={84}
          height={84}
          className="h-20 w-20 flex-none rounded-full object-cover ring-2 ring-border/90 shadow-[var(--shadow-soft)] sm:h-24 sm:w-24"
        />
        <div className="flex flex-col gap-3">
          <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
            Written by
          </p>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
            {post.author.name}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
            {authorBio}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
            {siteProfile.socialLinks?.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface))] px-3 py-1.5 font-display text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface))] px-3 py-1.5 font-display text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Share essay
            </button>
          </div>
        </div>
      </div>

      {relatedPosts.length ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
              Up next
            </p>
            <Link
              href="/#latest-writing"
              className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse all →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((edge) => {
              const date = formatPublishedDate(edge.node.publishedAt);
              const readingMinutes =
                edge.node.readingMinutes ?? getReadingMinutes(edge.node.content);

              return (
                <li key={edge.cursor}>
                  <Link
                    href={`/${edge.node.slug}`}
                    className={cn(
                      "interactive-surface flex h-full flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-[hsl(var(--surface)/0.96)] p-5 shadow-[var(--shadow-soft)]",
                    )}
                  >
                    {edge.node.tags[0] ? (
                      <span className="inline-flex w-fit items-center rounded-full border border-border/60 bg-[hsl(var(--surface-strong))] px-2.5 py-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {edge.node.tags[0].name}
                      </span>
                    ) : null}
                    <p className="font-display text-base font-bold leading-snug tracking-[-0.02em] text-foreground">
                      {edge.node.title}
                    </p>
                    <p className="mt-auto flex flex-wrap items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {date ? <span className="font-display">{date}</span> : null}
                      {date ? <span aria-hidden>·</span> : null}
                      <span className="font-display">{readingMinutes} min</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
