import { expect, test } from "@playwright/test";

import { mockPostEdges, mockPublication } from "../../src/lib/mock-blog-data";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

test("mock home page renders realistic content and paginates", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("link", { name: mockPublication.displayTitle }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: mockPostEdges[0].node.title }),
  ).toBeVisible();
  await expect(page.getByText(mockPostEdges[0].node.subtitle ?? "")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: mockPostEdges[9].node.title }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Load more" }).click();

  await expect(
    page.getByRole("heading", { name: mockPostEdges[9].node.title }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "That's all for today!" }),
  ).toBeDisabled();
});

test("representative mock blog posts render full article pages", async ({
  page,
}) => {
  const representativePosts = [
    mockPostEdges[0].node,
    mockPostEdges[4].node,
    mockPostEdges[11].node,
  ];

  for (const post of representativePosts) {
    await page.goto(`/${post.slug}`, { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: post.title,
      }),
    ).toBeVisible();
    await expect(page.getByText(post.subtitle ?? "")).toBeVisible();
  }
});

test("theme navigation works from the navbar", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const themeButton = page.getByRole("button", { name: "Theme menu" });

  await expect(themeButton).toBeEnabled({ timeout: 15000 });
  await themeButton.click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitem", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await themeButton.click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitem", { name: "Light" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
