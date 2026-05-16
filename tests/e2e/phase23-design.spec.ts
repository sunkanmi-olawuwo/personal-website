import { expect, test } from "@playwright/test";

import { mockPostEdges } from "../../src/lib/mock-blog-data";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

test("home page promotes the first post to the featured variant with date and reading time", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const cards = page.locator("[data-blog-card]");
  await expect(cards.first()).toHaveAttribute("data-variant", "featured");
  await expect(cards.first().getByText(/Featured essay/i)).toBeVisible();

  await expect(
    cards.first().getByText(/\d+ min read/i).first(),
  ).toBeVisible();
});

test("tag filter never promotes a featured card", async ({ page }) => {
  await page.goto("/?tag=backend", { waitUntil: "domcontentloaded" });

  const cards = page.locator("[data-blog-card]");
  const first = cards.first();
  await expect(first).toHaveAttribute("data-variant", "default");
});

test("post page renders the reading progress bar and author bio", async ({
  page,
}) => {
  const post = mockPostEdges[0].node;
  await page.goto(`/${post.slug}`, { waitUntil: "domcontentloaded" });

  await expect(page.locator("[data-reading-progress]")).toBeAttached();
  await expect(
    page.getByRole("heading", { level: 1, name: post.title }),
  ).toBeVisible();
  await expect(page.getByText(/min read/i).first()).toBeVisible();
  await expect(
    page.getByRole("region", { name: /About the author/i }),
  ).toBeVisible();
});

test("about page surfaces identity and principles", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#identity")).toBeVisible();
  await expect(page.getByText("Adoption beats elegance")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Browse the full archive/i }),
  ).toBeVisible();
});

test("now page lists current focus and last-updated stamp", async ({ page }) => {
  await page.goto("/now", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: /focused/i }),
  ).toBeVisible();
  await expect(page.getByText("Writing").first()).toBeVisible();
  await expect(page.getByText(/Last updated/i)).toBeVisible();
});

test("rss feed returns valid xml with mock posts", async ({ page }) => {
  const response = await page.request.get("/rss.xml");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/rss+xml");

  const body = await response.text();
  expect(body).toContain("<?xml");
  expect(body).toContain("<rss");
  expect(body).toContain(mockPostEdges[0].node.title);
});
