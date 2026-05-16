"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function MagneticButton({
  children,
  className,
  radius = 80,
  strength = 0.32,
}: Props) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return undefined;
    }

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia(REDUCED_MOTION_QUERY)
        : null;

    if (motionQuery?.matches) {
      return undefined;
    }

    const moveTarget = wrapper.firstElementChild as HTMLElement | null;

    if (!moveTarget) {
      return undefined;
    }

    function applyTransform() {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.18;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.18;

      const { x, y } = currentRef.current;
      const distance = Math.hypot(x - targetRef.current.x, y - targetRef.current.y);

      if (moveTarget) {
        moveTarget.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }

      if (distance > 0.2 || targetRef.current.x !== 0 || targetRef.current.y !== 0) {
        frameRef.current = window.requestAnimationFrame(applyTransform);
      } else {
        if (moveTarget) {
          moveTarget.style.transform = "translate3d(0, 0, 0)";
        }
        frameRef.current = null;
      }
    }

    function scheduleFrame() {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(applyTransform);
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = wrapper!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > radius) {
        targetRef.current = { x: 0, y: 0 };
      } else {
        targetRef.current = {
          x: deltaX * strength,
          y: deltaY * strength,
        };
      }

      scheduleFrame();
    }

    function handlePointerLeave() {
      targetRef.current = { x: 0, y: 0 };
      scheduleFrame();
    }

    window.addEventListener("pointermove", handlePointerMove);
    wrapper.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      wrapper.removeEventListener("pointerleave", handlePointerLeave);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (moveTarget) {
        moveTarget.style.transform = "";
      }
    };
  }, [radius, strength]);

  return (
    <span
      ref={wrapperRef}
      data-magnetic-button
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </span>
  );
}
