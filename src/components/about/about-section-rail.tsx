"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type AboutSection = {
  id: string;
  label: string;
  accent?: string;
};

type Props = {
  sections: readonly AboutSection[];
};

type AccentStyle = CSSProperties & { "--section-accent"?: string };

export default function AboutSectionRail({ sections }: Props) {
  const [activeId, setActiveId] = useState<string | undefined>(sections[0]?.id);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

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
  }, [sections]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id);

      if (!target) {
        return;
      }

      event.preventDefault();
      setActiveId(id);
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${id}`);
      }
    },
    [],
  );

  return (
    <>
      <nav
        data-about-rail="horizontal"
        aria-label="On this page"
        className="sticky top-16 z-30 -mx-4 overflow-x-auto border-b border-border/70 bg-background/85 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:hidden"
      >
        <ul className="flex w-max items-center gap-1">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            const accentStyle: AccentStyle = section.accent
              ? { "--section-accent": section.accent }
              : {};

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(event) => handleClick(event, section.id)}
                  data-active={isActive ? "true" : undefined}
                  aria-current={isActive ? "location" : undefined}
                  style={accentStyle}
                  className={cn(
                    "inline-flex items-center rounded-full border border-transparent px-3 py-1.5 font-display text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground",
                    isActive &&
                      "border-[color-mix(in_srgb,var(--section-accent,hsl(var(--primary)))_55%,transparent)] bg-[color-mix(in_srgb,var(--section-accent,hsl(var(--primary)))_10%,transparent)] text-foreground",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        data-about-rail="vertical"
        aria-label="On this page"
        className="sticky top-24 hidden h-fit flex-col gap-3 lg:flex"
      >
        <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          On this page
        </p>
        <ol className="flex flex-col gap-1 border-l border-border/70 pl-4 text-sm">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            const accentStyle: AccentStyle = section.accent
              ? { "--section-accent": section.accent }
              : {};

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(event) => handleClick(event, section.id)}
                  data-active={isActive ? "true" : undefined}
                  aria-current={isActive ? "location" : undefined}
                  style={accentStyle}
                  className={cn(
                    "-ml-[1.05rem] block border-l border-transparent py-1 pl-4 font-display text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground",
                    isActive &&
                      "border-[var(--section-accent,hsl(var(--primary)))] text-foreground",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
