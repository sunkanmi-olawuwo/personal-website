import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

test("about page shows the four anchored sections", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#identity")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /A few non-negotiables/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /^Experience\.$/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Projects worth pointing at/i }),
  ).toBeVisible();
});

test("about page rail link click updates the URL hash", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });

  const visibleRail = page.locator('nav[aria-label="On this page"]:visible');
  await visibleRail.getByRole("link", { name: "Projects" }).click();

  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(
    "#projects",
  );
});

test("about deep links scroll to the requested section", async ({ page }) => {
  await page.goto("/about#projects", { waitUntil: "domcontentloaded" });

  const projects = page.locator("#projects");
  await expect(projects).toBeInViewport();
});

test("navbar marks About as active when on /about", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });

  const aboutLink = page
    .getByRole("banner")
    .getByRole("link", { name: "About" });
  await expect(aboutLink).toHaveAttribute("data-active", "true");
  await expect(aboutLink).toHaveAttribute("aria-current", "page");
});

test("projects archive link points at the internal /archive route", async ({ page }) => {
  await page.goto("/about#projects", { waitUntil: "domcontentloaded" });

  const archive = page.getByRole("link", { name: /Browse the full archive/i });
  await expect(archive).toBeVisible();
  await expect(archive).toHaveAttribute("href", "/archive");
});
