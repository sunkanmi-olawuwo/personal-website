import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const WORDS_PER_MINUTE = 220;

export function getReadingMinutes(input: { text?: string; html?: string } | string | undefined | null) {
  if (!input) {
    return 1;
  }

  const source =
    typeof input === "string"
      ? input
      : (input.text ?? input.html ?? "");

  if (!source) {
    return 1;
  }

  const stripped = source.replace(/<[^>]+>/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean);

  return Math.max(1, Math.round(words.length / WORDS_PER_MINUTE));
}

export function formatPublishedDate(value: string | undefined | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
