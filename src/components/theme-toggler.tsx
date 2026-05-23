"use client";

import React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export default function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = mounted ? resolvedTheme === "dark" : false;
  const nextTheme = isDarkTheme ? "light" : "dark";
  const label = mounted ? `Switch to ${nextTheme} theme` : "Toggle theme";
  const icon = isDarkTheme ? <SunIcon /> : <MoonIcon />;

  function handleClick() {
    if (typeof document === "undefined") {
      setTheme(nextTheme);
      return;
    }

    const doc = document as DocumentWithViewTransition;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      doc.documentElement.style.setProperty("--vt-toggle-x", `${x}px`);
      doc.documentElement.style.setProperty("--vt-toggle-y", `${y}px`);
    }

    doc.documentElement.setAttribute("data-theme-transitioning", "true");
    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready
      .catch(() => undefined)
      .finally(() => {
        doc.documentElement.removeAttribute("data-theme-transitioning");
      });
  }

  return (
    <button
      ref={buttonRef}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-[hsl(var(--surface))] text-foreground outline-none transition hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      onClick={handleClick}
      title={label}
      type="button"
    >
      {icon}
    </button>
  );
}
