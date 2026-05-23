import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { mockPostEdges } from "../../src/lib/mock-blog-data";
import { siteProfile } from "../../src/lib/site-profile";

async function seedNewsletterPreference(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(seriousViolations).toEqual([]);
}

test("navbar keeps the core navigation affordances available", async ({
  page,
}) => {
  await seedNewsletterPreference(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const brandText =
    siteProfile.wordmark ?? "Sunkanmi Olawuwo";
  await expect(
    page.getByRole("banner").getByRole("link", {
      name: brandText,
    }),
  ).toHaveAttribute("href", "/");
  await expect(
    page.getByRole("button", {
      name: /switch to (dark|light) theme|toggle theme/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("link", { name: "GitHub" }),
  ).toHaveAttribute(
    "href",
    siteProfile.secondaryCta.href,
  );
  await expect(
    page.getByRole("banner").getByRole("link", { name: "GitHub" }),
  ).toHaveAttribute(
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
      name: siteProfile.heroHeadline,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: `Portrait of ${siteProfile.name}`,
    }),
  ).toBeVisible();
  await expect(page.getByText(siteProfile.heroSummary)).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", {
      name: siteProfile.primaryCta.label,
      exact: true,
    }),
  ).toHaveAttribute(
    "href",
    siteProfile.primaryCta.href,
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
