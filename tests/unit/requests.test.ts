import { afterEach, describe, expect, it, vi } from "vitest";

const requestMock = vi.hoisted(() => vi.fn());

vi.mock("graphql-request", () => ({
  default: requestMock,
  request: requestMock,
  gql: (strings: TemplateStringsArray, ...values: unknown[]) =>
    strings.reduce(
      (result, current, index) => result + current + (values[index] ?? ""),
      "",
    ),
}));

const ORIGINAL_ENV = { ...process.env };

async function importRequests(
  envOverrides: Record<string, string | undefined> = {},
) {
  vi.resetModules();

  process.env = { ...ORIGINAL_ENV };
  delete process.env.NEXT_PUBLIC_HASHNODE_ENDPOINT;
  delete process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID;

  for (const [key, value] of Object.entries(envOverrides)) {
    if (value === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = value;
  }

  return import("@/lib/requests");
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  requestMock.mockReset();
});

describe("requests", () => {
  it("returns the fallback blog name when Hashnode config is missing", async () => {
    const { getBlogName } = await importRequests();

    await expect(getBlogName()).resolves.toEqual({
      title: "Personal Website",
      displayTitle: "Personal Website",
      favicon: "/favicon.ico",
    });
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("returns the fallback blog name when the request fails", async () => {
    requestMock.mockRejectedValueOnce(new Error("network down"));
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getBlogName()).resolves.toEqual({
      title: "Personal Website",
      displayTitle: "Personal Website",
      favicon: "/favicon.ico",
    });
    expect(requestMock).toHaveBeenCalledOnce();
  });

  it("returns live blog data when the request succeeds", async () => {
    requestMock.mockResolvedValueOnce({
      publication: {
        title: "Live Title",
        displayTitle: "Live Display Title",
        favicon: "https://example.com/favicon.ico",
      },
    });
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getBlogName()).resolves.toEqual({
      title: "Live Title",
      displayTitle: "Live Display Title",
      favicon: "https://example.com/favicon.ico",
    });
  });

  it("returns fallback posts when Hashnode config is missing", async () => {
    const { getPosts } = await importRequests();

    await expect(getPosts({ first: 9 })).resolves.toEqual([
      expect.objectContaining({
        cursor: "fallback-welcome",
        node: expect.objectContaining({
          title: "Connect your Hashnode publication",
          slug: "welcome",
        }),
      }),
    ]);
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("returns fallback posts when the request fails", async () => {
    requestMock.mockRejectedValueOnce(new Error("network down"));
    const { getPosts } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getPosts({ first: 9 })).resolves.toEqual([
      expect.objectContaining({
        cursor: "fallback-welcome",
      }),
    ]);
  });

  it("returns live posts when the request succeeds", async () => {
    requestMock.mockResolvedValueOnce({
      publication: {
        posts: {
          edges: [
            {
              cursor: "cursor-1",
              node: {
                title: "Live Post",
                slug: "live-post",
                subtitle: "Subtitle",
                content: { text: "Preview" },
                coverImage: { url: "https://example.com/post.jpg" },
                author: {
                  name: "Author",
                  profilePicture: "https://example.com/author.jpg",
                },
              },
            },
          ],
        },
      },
    });
    const { getPosts } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getPosts({ first: 9 })).resolves.toEqual([
      expect.objectContaining({
        cursor: "cursor-1",
        node: expect.objectContaining({
          title: "Live Post",
          slug: "live-post",
        }),
      }),
    ]);
  });

  it("returns the fallback welcome post when offline", async () => {
    const { getPostBySlug } = await importRequests();

    await expect(getPostBySlug("welcome")).resolves.toEqual(
      expect.objectContaining({
        title: "Connect your Hashnode publication",
      }),
    );
  });

  it("returns null for an unknown slug when offline", async () => {
    const { getPostBySlug } = await importRequests();

    await expect(getPostBySlug("missing-post")).resolves.toBeNull();
  });

  it("returns a live post when the request succeeds", async () => {
    requestMock.mockResolvedValueOnce({
      publication: {
        post: {
          title: "Live Post",
          subtitle: "Live Subtitle",
          coverImage: { url: "https://example.com/post.jpg" },
          content: { html: "<p>Live content</p>" },
          author: {
            name: "Live Author",
            profilePicture: "https://example.com/author.jpg",
          },
        },
      },
    });
    const { getPostBySlug } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getPostBySlug("live-post")).resolves.toEqual(
      expect.objectContaining({
        title: "Live Post",
        content: { html: "<p>Live content</p>" },
      }),
    );
  });

  it("throws when subscribing without Hashnode config", async () => {
    const { subscribeToNewsletter } = await importRequests();

    await expect(
      subscribeToNewsletter("reader@example.com"),
    ).rejects.toThrow(
      "Newsletter signups are unavailable until the Hashnode environment variables are configured.",
    );
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("submits the newsletter request when Hashnode config exists", async () => {
    requestMock.mockResolvedValueOnce({
      subscribeToNewsletter: { status: "PENDING" },
    });
    const { subscribeToNewsletter } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(
      subscribeToNewsletter("reader@example.com"),
    ).resolves.toEqual({
      subscribeToNewsletter: { status: "PENDING" },
    });
    expect(requestMock).toHaveBeenCalledOnce();
  });
});
