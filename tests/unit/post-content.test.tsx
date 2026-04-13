import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PostContent from "@/components/post-content";

const execCommandMock = vi.fn();

describe("PostContent", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });

    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommandMock,
    });
  });

  afterEach(() => {
    execCommandMock.mockReset();
  });

  it("adds a copy button for code blocks and copies the block content", async () => {
    execCommandMock.mockReturnValueOnce(true);

    render(
      <PostContent
        html={`<pre><code class="language-ts">const answer = 42;</code></pre>`}
      />,
    );

    const copyButton = await screen.findByRole("button", {
      name: "Copy TypeScript code",
    });

    fireEvent.click(copyButton);

    expect(execCommandMock).toHaveBeenCalledWith("copy");
    await waitFor(() => {
      expect(copyButton).toHaveTextContent("Copied");
    });
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders rich html content like figures and captions from mock posts", () => {
    render(
      <PostContent
        html={`<figure><img src="https://images.unsplash.com/example-photo" alt="Mock article diagram" /><figcaption>Structured mock content should include media.</figcaption></figure>`}
      />,
    );

    expect(screen.getByAltText("Mock article diagram")).toBeInTheDocument();
    expect(
      screen.getByText("Structured mock content should include media."),
    ).toBeInTheDocument();
  });
});
