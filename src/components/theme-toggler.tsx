"use client";

import React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = mounted ? resolvedTheme === "dark" : false;
  const nextTheme = isDarkTheme ? "light" : "dark";
  const label = mounted ? `Switch to ${nextTheme} theme` : "Toggle theme";
  const icon = isDarkTheme ? <SunIcon /> : <MoonIcon />;

  return (
    <button
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-[hsl(var(--surface))] text-foreground outline-none transition hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => setTheme(nextTheme)}
      title={label}
      type="button"
    >
      {icon}
    </button>
  );
}
