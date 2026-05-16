"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  maxOffset?: number;
  factor?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function ParallaxPortrait({
  children,
  className,
  maxOffset = 15,
  factor = 0.06,
}: Props) {
  const elementRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia(REDUCED_MOTION_QUERY)
        : null;

    if (motionQuery?.matches) {
      return undefined;
    }

    let initialTop: number | null = null;

    function update() {
      if (!element) {
        return;
      }

      if (initialTop === null) {
        const rect = element.getBoundingClientRect();
        initialTop = rect.top + window.scrollY;
      }

      const distance = window.scrollY - initialTop;
      const offset = Math.max(
        -maxOffset,
        Math.min(maxOffset, -distance * factor),
      );

      element.style.setProperty(
        "--parallax-y",
        `${offset.toFixed(2)}px`,
      );

      frameRef.current = null;
    }

    function scheduleUpdate() {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      element.style.removeProperty("--parallax-y");
    };
  }, [factor, maxOffset]);

  return (
    <div
      ref={elementRef}
      data-parallax-portrait
      className={cn("translate-y-[var(--parallax-y,0)]", className)}
    >
      {children}
    </div>
  );
}
