import { PostMetadata } from "@/lib/types";
import { cn, formatPublishedDate, getReadingMinutes } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import TagLink from "./tag-link";

type Props = {
  post: PostMetadata;
  loading?: "eager" | "lazy";
  variant?: "default" | "featured";
};

export default function BlogCard({ post, loading, variant = "default" }: Props) {
  const usesRemoteMockImage = post.coverImage.url.includes("images.unsplash.com/");
  const isFeatured = variant === "featured";
  const formattedDate = formatPublishedDate(post.publishedAt);
  const readingMinutes = post.readingMinutes ?? getReadingMinutes(post.content);
  const viewTransitionName = post.slug ? `post-cover-${post.slug}` : undefined;
  const excerpt = post.subtitle || post.content.text;

  return (
    <Card
      data-blog-card
      data-variant={variant}
      className={cn(
        "interactive-surface group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-border/70 bg-[hsl(var(--surface)/0.96)] shadow-[var(--shadow-soft)]",
        isFeatured && "rounded-[2rem] sm:flex-row lg:col-span-2",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent"
      />
      <CardHeader
        className={cn(
          "p-4 pb-4 sm:p-5",
          isFeatured && "p-4 sm:flex-1 sm:p-5",
        )}
      >
        <div
          className={cn(
            "interactive-media relative aspect-[16/10] w-full overflow-hidden rounded-[1.2rem] border border-border/60 bg-[hsl(var(--surface-strong))]",
            isFeatured && "rounded-[1.4rem] sm:h-full sm:min-h-[260px]",
          )}
          style={
            viewTransitionName
              ? ({ viewTransitionName } as React.CSSProperties)
              : undefined
          }
        >
          <div
            aria-hidden
            data-media-target
            className="absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-white/5"
          />
          <Image
            fill
            src={post.coverImage.url}
            alt={post.title}
            className="object-cover"
            sizes={
              isFeatured
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 1024px) 33vw, 100vw"
            }
            loading={loading}
            unoptimized={usesRemoteMockImage}
          />
          {isFeatured ? (
            <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Featured essay
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          "flex flex-1 flex-col p-5 pt-0",
          isFeatured && "sm:flex-1 sm:justify-center sm:p-6 sm:pl-2",
        )}
      >
        {post.tags.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagLink key={tag.slug} tag={tag} />
            ))}
          </div>
        ) : null}
        <h2
          className={cn(
            "font-display font-bold leading-tight tracking-[-0.03em]",
            isFeatured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl",
          )}
        >
          <Link
            href={`/${post.slug}`}
            className="interactive-link group/title inline-flex items-baseline gap-2 underline-offset-4 decoration-transparent transition-[color,text-decoration-color] hover:text-primary hover:underline hover:decoration-primary"
          >
            <span>{post.title}</span>
            <span
              aria-hidden
              className="inline-block translate-x-0 text-primary/55 opacity-0 transition-[transform,opacity] duration-200 group-hover/title:translate-x-1 group-hover/title:opacity-100"
            >
              →
            </span>
          </Link>
        </h2>
        <PostMetaRow
          publishedAt={formattedDate}
          publishedAtISO={post.publishedAt}
          readingMinutes={readingMinutes}
        />
        <p
          className={cn(
            "mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground sm:text-[0.95rem]",
            isFeatured && "line-clamp-5 sm:text-base sm:leading-8",
          )}
        >
          {excerpt}
        </p>
      </CardContent>
    </Card>
  );
}

function PostMetaRow({
  publishedAt,
  publishedAtISO,
  readingMinutes,
}: {
  publishedAt: string | null;
  publishedAtISO?: string;
  readingMinutes: number;
}) {
  if (!publishedAt && !readingMinutes) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
      {publishedAt ? (
        <time
          dateTime={publishedAtISO ?? publishedAt}
          className="font-display"
        >
          {publishedAt}
        </time>
      ) : null}
      {publishedAt ? <span aria-hidden className="h-px w-3 bg-border" /> : null}
      <span className="font-display">{readingMinutes} min read</span>
    </div>
  );
}
