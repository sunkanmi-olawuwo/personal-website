import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

test("archive page renders header + project table", async ({ page }) => {
  await page.goto("/archive", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: /All the things/i }),
  ).toBeVisible();

  await expect(page.locator("[data-archive-table]")).toBeVisible();
  const rows = page.locator("[data-archive-row]");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(0);
});

test("about archive link navigates to /archive", async ({ page }) => {
  await page.goto("/about#projects", { waitUntil: "domcontentloaded" });

  await page.getByRole("link", { name: /Browse the full archive/i }).click();

  await expect(page).toHaveURL(/\/archive$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /All the things/i }),
  ).toBeVisible();
});

test("archive back link returns to /about projects section", async ({ page }) => {
  await page.goto("/archive", { waitUntil: "domcontentloaded" });

  const back = page.getByRole("link", { name: /Back to about/i });
  await expect(back).toHaveAttribute("href", "/about#projects");
});
