"use client";

import { useEffect, useRef } from "react";

import { slugifyHeading } from "@/lib/utils";

type Props = {
  html: string;
};

const codeLanguageLabels: Record<string, string> = {
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  markdown: "Markdown",
  md: "Markdown",
  python: "Python",
  py: "Python",
  shell: "Shell",
  sh: "Shell",
  sql: "SQL",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  yaml: "YAML",
  yml: "YAML",
};

function getCodeLanguage(element: Element | null) {
  if (!element) {
    return undefined;
  }

  for (const className of element.classList) {
    if (!className.startsWith("language-")) {
      continue;
    }

    return className.replace("language-", "").toLowerCase();
  }

  return undefined;
}

function formatCodeLanguage(language: string | undefined) {
  if (!language) {
    return "Code";
  }

  return codeLanguageLabels[language] ?? language.toUpperCase();
}

function createCopyIcon() {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("code-copy-icon");

  const backRect = document.createElementNS(svgNamespace, "rect");
  backRect.setAttribute("x", "9");
  backRect.setAttribute("y", "9");
  backRect.setAttribute("width", "10");
  backRect.setAttribute("height", "10");
  backRect.setAttribute("rx", "2");
  backRect.setAttribute("ry", "2");

  const frontPath = document.createElementNS(svgNamespace, "path");
  frontPath.setAttribute(
    "d",
    "M5 15V7a2 2 0 0 1 2-2h8",
  );

  svg.append(backRect, frontPath);

  return svg;
}

async function copyCodeToClipboard(code: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(code);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = code;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function PostContent({ html }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentRoot = contentRef.current;

    if (!contentRoot) {
      return;
    }

    const cleanupFns: Array<() => void> = [];
    const timeoutIds: number[] = [];

    const headingSlugs = new Map<string, number>();

    for (const heading of contentRoot.querySelectorAll("h2")) {
      if (heading.id) {
        continue;
      }

      const text = (heading.textContent ?? "").trim();
      const base = slugifyHeading(text || "section");
      const occurrence = headingSlugs.get(base) ?? 0;
      headingSlugs.set(base, occurrence + 1);
      heading.id = occurrence === 0 ? base : `${base}-${occurrence}`;
    }

    for (const preElement of contentRoot.querySelectorAll("pre")) {
      const codeElement = preElement.querySelector("code");
      const codeText = codeElement?.textContent ?? preElement.textContent ?? "";
      const parentElement = preElement.parentElement;

      if (!codeText.trim() || !parentElement) {
        continue;
      }

      preElement.setAttribute("data-code-block", "true");

      const language = getCodeLanguage(codeElement) ?? getCodeLanguage(preElement);
      const frameElement = document.createElement("div");
      frameElement.className = "code-block-frame";

      const toolbarElement = document.createElement("div");
      toolbarElement.className = "code-block-toolbar";

      const languageBadge = document.createElement("span");
      languageBadge.className = "code-language-chip";
      languageBadge.textContent = formatCodeLanguage(language);

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "code-copy-button";
      copyButton.setAttribute(
        "aria-label",
        language ? `Copy ${formatCodeLanguage(language)} code` : "Copy code",
      );

      const copyButtonLabel = document.createElement("span");
      copyButtonLabel.textContent = "Copy";

      copyButton.append(createCopyIcon(), copyButtonLabel);

      const handleCopy = async () => {
        try {
          await copyCodeToClipboard(codeText.trimEnd());
          copyButton.dataset.copied = "true";
          copyButtonLabel.textContent = "Copied";

          const timeoutId = window.setTimeout(() => {
            copyButton.dataset.copied = "false";
            copyButtonLabel.textContent = "Copy";
          }, 1800);

          timeoutIds.push(timeoutId);
        } catch {
          copyButtonLabel.textContent = "Select and copy";

          const timeoutId = window.setTimeout(() => {
            copyButtonLabel.textContent = "Copy";
          }, 1800);

          timeoutIds.push(timeoutId);
        }
      };

      copyButton.addEventListener("click", handleCopy);
      toolbarElement.append(languageBadge, copyButton);
      parentElement.insertBefore(frameElement, preElement);
      frameElement.append(toolbarElement, preElement);

      cleanupFns.push(() => {
        copyButton.removeEventListener("click", handleCopy);
        if (frameElement.parentNode) {
          frameElement.parentNode.insertBefore(preElement, frameElement);
          frameElement.remove();
        }
        preElement.removeAttribute("data-code-block");
      });
    }

    return () => {
      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId);
      }

      for (const cleanupFn of cleanupFns) {
        cleanupFn();
      }
    };
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="section-shell page-reveal page-reveal-delay-2 blog-content flex flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
