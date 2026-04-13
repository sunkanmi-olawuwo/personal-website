"use client";

import { getPostBySlug } from "@/lib/requests";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    return <div className="py-16 text-center text-muted-foreground">Loading post...</div>;
  }

  if (!data) return notFound();

  const usesRemoteMockImage = data.coverImage.url.includes("images.unsplash.com/");
  const localAuthorAvatar = "/blog-profile-photo.png";
  const publishedAt =
    "publishedAt" in data && typeof data.publishedAt === "string"
      ? data.publishedAt
      : undefined;

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="page-reveal flex flex-col gap-5">
        <Link
          href="/#latest-writing"
          className="interactive-surface inline-flex w-fit items-center rounded-full border border-border/70 bg-[hsl(var(--surface)/0.8)] px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.28em] text-primary/80 shadow-[var(--shadow-soft)] transition-colors hover:text-primary"
        >
          Back to home
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
          <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          {data.subtitle ? (
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {data.subtitle}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
          <Image
            src={localAuthorAvatar}
            alt={`${data.author.name} portrait`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-border/90 shadow-[var(--shadow-soft)]"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{data.author.name}</span>
            <span className="text-sm">
              {publishedAt
                ? `Published on: ${new Date(publishedAt).toLocaleDateString()}`
                : "Published on the journal"}
            </span>
          </div>
        </div>
      </div>

      <div className="interactive-surface interactive-media page-reveal page-reveal-delay-1 relative aspect-[16/9] w-full overflow-hidden rounded-[1.8rem] border border-border/70 bg-[hsl(var(--surface))] shadow-[var(--shadow-strong)]">
        <div
          aria-hidden
          data-media-target
          className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/10 via-transparent to-white/5"
        />
        <Image
          fill
          preload
          src={data.coverImage.url}
          alt={data.title}
          className="object-cover"
          sizes="100vw"
          unoptimized={usesRemoteMockImage}
        />
      </div>
      <div
        className="section-shell page-reveal page-reveal-delay-2 blog-content flex flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10"
        dangerouslySetInnerHTML={{ __html: data.content.html }}
      />
    </article>
  );
}
