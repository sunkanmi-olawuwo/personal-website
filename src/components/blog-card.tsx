import { PostMetadata } from "@/lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import TagLink from "./tag-link";

type Props = {
  post: PostMetadata;
  loading?: "eager" | "lazy";
};

export default function BlogCard({ post, loading }: Props) {
  const usesRemoteMockImage = post.coverImage.url.includes("images.unsplash.com/");

  return (
    <Card
      data-blog-card
      className="interactive-surface group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-border/70 bg-[hsl(var(--surface)/0.96)] shadow-[var(--shadow-soft)]"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent"
      />
      <CardHeader className="p-4 pb-4 sm:p-5">
        <div className="interactive-media relative aspect-[16/10] w-full overflow-hidden rounded-[1.2rem] border border-border/60 bg-[hsl(var(--surface-strong))]">
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
            sizes="(min-width: 1024px) 33vw, 100vw"
            loading={loading}
            unoptimized={usesRemoteMockImage}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-5 pt-0">
        {post.tags.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagLink key={tag.slug} tag={tag} />
            ))}
          </div>
        ) : null}
        <h2 className="font-display text-xl font-bold leading-tight tracking-[-0.03em]">
          <Link
            href={`/${post.slug}`}
            className="interactive-link underline-offset-4 decoration-transparent transition-[color,text-decoration-color] hover:text-primary hover:underline hover:decoration-primary"
          >
            {post.title}
          </Link>
        </h2>
        <div aria-hidden className="mt-4 flex items-center gap-3 text-primary/55">
          <span className="h-px w-8 bg-gradient-to-r from-primary/70 to-primary/10" />
          <span className="rounded-full border border-primary/20 bg-primary/[0.08] px-2 py-0.5 font-mono text-[0.68rem] font-semibold tracking-tight text-primary/75">
            {"</>"}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <p className="mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
          {post.subtitle || post.content.text}
        </p>
      </CardContent>
    </Card>
  );
}
