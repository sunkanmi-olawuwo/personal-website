import { expect, test } from "@playwright/test";

const hasLiveHashnodeConfig = Boolean(
  process.env.PLAYWRIGHT_LIVE === "1" &&
    process.env.NEXT_PUBLIC_HASHNODE_ENDPOINT &&
    process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID,
);

test.describe("Hashnode live smoke @live", () => {
  test.skip(
    !hasLiveHashnodeConfig,
    "Live Hashnode env vars are required for the smoke suite.",
  );

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("newsletter", "playwright@example.com");
    });
  });

  test("home page renders non-fallback blog content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("Connect your Hashnode publication"),
    ).toHaveCount(0);
    expect(await page.getByRole("heading").count()).toBeGreaterThan(0);
  });

  test("configured live slug page renders when provided", async ({ page }) => {
    test.skip(
      !process.env.PLAYWRIGHT_HASHNODE_SMOKE_SLUG,
      "Set PLAYWRIGHT_HASHNODE_SMOKE_SLUG to run the live slug smoke test.",
    );

    await page.goto(`/${process.env.PLAYWRIGHT_HASHNODE_SMOKE_SLUG}`);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByText("Connect your Hashnode publication"),
    ).toHaveCount(0);
  });
});
