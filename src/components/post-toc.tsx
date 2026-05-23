"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { cn, slugifyHeading } from "@/lib/utils";

type Heading = {
  id: string;
  text: string;
};

type Variant = "desktop" | "mobile";

type Props = {
  html: string;
  variant?: Variant;
};

function extractHeadings(html: string): Heading[] {
  const matches = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi));
  const seen = new Map<string, number>();

  return matches.map((match) => {
    const text = match[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const base = slugifyHeading(text || "section");
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);

    return {
      id: occurrence === 0 ? base : `${base}-${occurrence}`,
      text,
    };
  });
}

export default function PostToc({ html, variant = "desktop" }: Props) {
  const [headings, setHeadings] = useState<Heading[]>(() => extractHeadings(html));
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setHeadings(extractHeadings(html));
  }, [html]);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.intersectionRatio - second.intersectionRatio)
          .pop();

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const target of targets) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  if (variant === "mobile") {
    const activeHeading =
      headings.find((heading) => heading.id === activeId) ?? headings[0];

    return (
      <details
        data-post-toc-mobile
        className="group rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.85)] px-4 py-3 lg:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-primary/75">
              On this page
            </span>
            <span className="truncate text-foreground/90">
              {activeHeading.text}
            </span>
          </span>
          <ChevronDownIcon
            aria-hidden
            className="h-4 w-4 flex-none text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <ol className="mt-4 flex flex-col gap-2 border-l border-border/70 pl-4 text-sm leading-6">
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block -ml-[1.05rem] border-l border-transparent py-1 pl-4 text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "border-primary text-foreground",
                  )}
                  data-active={isActive ? "true" : undefined}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ol>
      </details>
    );
  }

  return (
    <nav
      data-post-toc
      aria-label="Table of contents"
      className="sticky top-24 hidden h-fit max-h-[calc(100vh-9rem)] overflow-y-auto pr-4 lg:block"
    >
      <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
        On this page
      </p>
      <ol className="mt-4 flex flex-col gap-2 border-l border-border/70 pl-4 text-sm leading-6">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block -ml-[1.05rem] border-l border-transparent py-1 pl-4 text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "border-primary text-foreground",
                )}
                data-active={isActive ? "true" : undefined}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
