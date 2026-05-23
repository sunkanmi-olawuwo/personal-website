"use client";

import { isNewsletterConfigured } from "@/lib/env";
import { getPostBySlug } from "@/lib/requests";
import { formatPublishedDate, getReadingMinutes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import NewsletterInline from "./newsletter-inline";
import PostContent from "./post-content";
import PostFooter from "./post-footer";
import PostPrevNext from "./post-prev-next";
import PostSkeleton from "./post-skeleton";
import PostToc from "./post-toc";
import ReadingProgress from "./reading-progress";
import TagLink from "./tag-link";

type Props = {
  slug: string;
};

export default function Post({ slug }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
  });

  if (isPending) {
    return <PostSkeleton />;
  }

  if (!data) return notFound();

  const usesRemoteMockImage = data.coverImage.url.includes("images.unsplash.com/");
  const localAuthorAvatar = "/blog-profile-photo.png";
  const publishedAtISO =
    "publishedAt" in data && typeof data.publishedAt === "string"
      ? data.publishedAt
      : undefined;
  const publishedDate = formatPublishedDate(publishedAtISO);
  const readingMinutes = data.readingMinutes ?? getReadingMinutes(data.content);
  const tagSummary = data.tags
    .slice(0, 2)
    .map((tag) => tag.name)
    .join(", ");

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-8 lg:col-start-1">
          <div className="page-reveal flex flex-col gap-5">
            <Link
              href="/#latest-writing"
              className="interactive-surface inline-flex w-fit items-center rounded-full border border-border/70 bg-[hsl(var(--surface)/0.8)] px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.28em] text-primary/80 shadow-[var(--shadow-soft)] transition-colors hover:text-primary"
            >
              ← Back to home
            </Link>
            <div className="space-y-4">
              {data.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag) => (
                    <TagLink
                      key={tag.slug}
                      tag={tag}
                      className="bg-[hsl(var(--surface)/0.88)]"
                    />
                  ))}
                </div>
              ) : null}
              <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {data.title}
              </h1>
              {data.subtitle ? (
                <p className="max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                  {data.subtitle}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Image
                src={localAuthorAvatar}
                alt={`${data.author.name} portrait`}
                width={56}
                height={56}
                className="h-14 w-14 rounded-[0.95rem] object-cover ring-1 ring-border/70 shadow-[var(--shadow-soft)]"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{data.author.name}</span>
                <span className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em]">
                  {publishedDate ? (
                    <time dateTime={publishedAtISO}>{publishedDate}</time>
                  ) : (
                    <span>From the journal</span>
                  )}
                  <span aria-hidden>·</span>
                  <span>{readingMinutes} min read</span>
                  {tagSummary ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>{tagSummary}</span>
                    </>
                  ) : null}
                </span>
              </div>
            </div>
          </div>

          <div
            className="interactive-surface interactive-media page-reveal page-reveal-delay-1 relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-border/70 bg-[hsl(var(--surface))] shadow-[var(--shadow-strong)]"
            style={{ viewTransitionName: `post-cover-${slug}` } as React.CSSProperties}
          >
            <Image
              fill
              priority
              src={data.coverImage.url}
              alt={data.title}
              className="object-cover"
              sizes="(min-width: 1024px) 70vw, 100vw"
              unoptimized={usesRemoteMockImage}
            />
          </div>
          <PostToc html={data.content.html} variant="mobile" />
          <PostContent html={data.content.html} />
          <NewsletterInline newsletterEnabled={isNewsletterConfigured} />
          <PostFooter slug={slug} post={data} />
          <PostPrevNext currentSlug={slug} />
        </div>
        <aside className="hidden min-w-0 lg:col-start-2 lg:block">
          <PostToc html={data.content.html} variant="desktop" />
        </aside>
      </article>
    </>
  );
}
