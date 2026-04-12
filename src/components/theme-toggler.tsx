"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const icon = mounted && resolvedTheme === "light" ? <SunIcon /> : <MoonIcon />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Theme menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-[hsl(var(--surface))] text-foreground outline-none transition hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
        >
          {icon}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="rounded-2xl border-border/80 bg-[hsl(var(--surface))]/95 p-2">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
