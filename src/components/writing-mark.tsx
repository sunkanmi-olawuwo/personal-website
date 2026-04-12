"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

export default function WritingMark() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setShouldAnimate(!mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-writing-mark
      className="mx-auto w-full max-w-[20.5rem] lg:mx-0"
    >
      <div className="writing-mark-frame">
        <span className="writing-mark-line" />
        <div className="writing-mark-player">
          <DotLottieReact
            key={shouldAnimate ? "pen-writing-motion" : "pen-writing-static"}
            src="/pen-writing-loop.json"
            autoplay={shouldAnimate}
            loop={shouldAnimate}
            speed={0.9}
            className="writing-mark-canvas"
          />
        </div>
        <span className="writing-mark-line writing-mark-line-fade" />
      </div>
    </div>
  );
}
