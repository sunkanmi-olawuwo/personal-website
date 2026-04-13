import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const subscribeToNewsletterMock = vi.hoisted(() => vi.fn());
const toastMock = vi.hoisted(() => ({
  error: vi.fn(),
  info: vi.fn(),
  success: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  isHashnodeConfigured: false,
  isNewsletterConfigured: false,
}));

vi.mock("@/lib/requests", () => ({
  subscribeToNewsletter: subscribeToNewsletterMock,
}));

vi.mock("sonner", () => ({
  toast: toastMock,
}));

import NewsletterCard from "@/components/newsletter-card";

const DESKTOP_QUERY = "(min-width: 1024px)";

function setDesktopViewport(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === DESKTOP_QUERY ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function setScrollPosition({
  innerHeight = 1_000,
  scrollHeight = 2_000,
  scrollY = 0,
}: {
  innerHeight?: number;
  scrollHeight?: number;
  scrollY?: number;
} = {}) {
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
}

function renderNewsletterCard(newsletterEnabled = true) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <NewsletterCard newsletterEnabled={newsletterEnabled} />
    </QueryClientProvider>,
  );
}

describe("NewsletterCard", () => {
  it("stays hidden on non-desktop viewports", async () => {
    vi.useFakeTimers();
    setDesktopViewport(false);
    setScrollPosition();

    renderNewsletterCard(true);

    await act(async () => {
      vi.advanceTimersByTime(45_000);
      fireEvent.scroll(window);
    });

    expect(
      screen.queryByRole("heading", { name: "New essays, no noise." }),
    ).not.toBeInTheDocument();
  });

  it("opens after the reader scrolls past the threshold on desktop", async () => {
    setDesktopViewport(true);
    setScrollPosition({ scrollY: 0 });

    renderNewsletterCard(true);

    setScrollPosition({ scrollY: 700 });
    await act(async () => {
      fireEvent.scroll(window);
    });

    expect(
      screen.getByRole("heading", { name: "New essays, no noise." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeDisabled();
  });

  it("opens after the timer elapses when the reader has not scrolled", async () => {
    vi.useFakeTimers();
    setDesktopViewport(true);
    setScrollPosition();

    renderNewsletterCard(true);

    expect(
      screen.queryByRole("heading", { name: "New essays, no noise." }),
    ).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(45_000);
    });

    expect(
      screen.getByRole("heading", { name: "New essays, no noise." }),
    ).toBeInTheDocument();
  });

  it("remembers dismissals for 30 days", async () => {
    setDesktopViewport(true);
    setScrollPosition();

    const firstRender = renderNewsletterCard(true);

    setScrollPosition({ scrollY: 700 });
    await act(async () => {
      fireEvent.scroll(window);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss newsletter prompt" }),
    );

    expect(
      Number(window.localStorage.getItem("newsletterDismissedAt")),
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole("heading", { name: "New essays, no noise." }),
    ).not.toBeInTheDocument();

    firstRender.unmount();

    setScrollPosition();
    renderNewsletterCard(true);
    setScrollPosition({ scrollY: 700 });

    await act(async () => {
      fireEvent.scroll(window);
    });

    expect(
      screen.queryByRole("heading", { name: "New essays, no noise." }),
    ).not.toBeInTheDocument();
  });

  it("does not reopen when the session has already seen it", async () => {
    vi.useFakeTimers();
    setDesktopViewport(true);
    setScrollPosition();
    window.sessionStorage.setItem("newsletterNudgeShown", "1");

    renderNewsletterCard(true);

    await act(async () => {
      vi.advanceTimersByTime(45_000);
      fireEvent.scroll(window);
    });

    expect(
      screen.queryByRole("heading", { name: "New essays, no noise." }),
    ).not.toBeInTheDocument();
  });

  it("does not open when the reader is already subscribed", async () => {
    vi.useFakeTimers();
    setDesktopViewport(true);
    setScrollPosition();
    window.localStorage.setItem("newsletter", "reader@example.com");

    renderNewsletterCard(true);

    await act(async () => {
      vi.advanceTimersByTime(45_000);
      fireEvent.scroll(window);
    });

    expect(
      screen.queryByRole("heading", { name: "New essays, no noise." }),
    ).not.toBeInTheDocument();
  });
});
