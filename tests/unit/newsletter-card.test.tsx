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

function renderNewsletterCard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <NewsletterCard />
    </QueryClientProvider>,
  );
}

describe("NewsletterCard", () => {
  it("opens after the timer elapses when there is no newsletter key", async () => {
    vi.useFakeTimers();

    renderNewsletterCard();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Join the newsletter!" }),
    ).toBeInTheDocument();
  });

  it("does not open when the newsletter key already exists", async () => {
    vi.useFakeTimers();
    window.localStorage.setItem("newsletter", "reader@example.com");

    renderNewsletterCard();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the offline toast instead of submitting when config is missing", async () => {
    vi.useFakeTimers();

    renderNewsletterCard();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "reader@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(toastMock.info).toHaveBeenCalledWith(
      "Configure the Hashnode environment variables to enable newsletter signups.",
    );
    expect(subscribeToNewsletterMock).not.toHaveBeenCalled();
  });

  it("disables submit while the email field is empty", async () => {
    vi.useFakeTimers();

    renderNewsletterCard();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByRole("button", { name: "Subscribe" }),
    ).toBeDisabled();
  });
});
