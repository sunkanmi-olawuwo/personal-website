import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { mockPostEdges, mockPublication } from "../../src/lib/mock-blog-data";
import { siteProfile } from "../../src/lib/site-profile";

async function seedNewsletterPreference(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
}

async function clearNewsletterPreference(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.removeItem("newsletter");
  });
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(seriousViolations).toEqual([]);
}

test("newsletter dialog appears for new visitors and can be dismissed", async ({
  page,
}) => {
  await clearNewsletterPreference(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Join the newsletter!" }),
  ).toBeVisible({ timeout: 10000 });
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByPlaceholder("Email")).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();
  await expect(dialog).not.toBeVisible();
});

test("navbar keeps the core navigation affordances available", async ({
  page,
}) => {
  await seedNewsletterPreference(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("link", { name: mockPublication.displayTitle }).first(),
  ).toHaveAttribute("href", "/");
  await expect(page.getByRole("button", { name: "Theme menu" })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/atharvadeosthale/hashnode-headless-blog",
  );
  await expect(page.getByRole("banner").getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "target",
    "_blank",
  );
});

test("home hero surfaces the local profile content and latest writing entrypoint", async ({
  page,
}) => {
  await seedNewsletterPreference(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: new RegExp(siteProfile.heroHeadline),
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: `Portrait of ${siteProfile.name}`,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Articles" })).toHaveAttribute(
    "href",
    "#latest-writing",
  );
  await expect(
    page.getByRole("heading", { level: 2, name: "Articles" }),
  ).toBeVisible();
  await expect(page.locator("[data-writing-mark]")).toBeVisible();
});

test("offline home page has no serious accessibility violations", async ({
  page,
}) => {
  await seedNewsletterPreference(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expectNoSeriousAccessibilityViolations(page);
});

test("offline post page has no serious accessibility violations", async ({
  page,
}) => {
  await seedNewsletterPreference(page);
  await page.goto(`/${mockPostEdges[0].node.slug}`, {
    waitUntil: "domcontentloaded",
  });

  await expectNoSeriousAccessibilityViolations(page);
});
