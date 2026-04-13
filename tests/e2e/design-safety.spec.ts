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
    window.localStorage.removeItem("newsletterDismissedAt");
    window.sessionStorage.removeItem("newsletterNudgeShown");
  });
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(seriousViolations).toEqual([]);
}

test("newsletter nudge respects the current desktop and mobile behavior", async ({
  page,
}, testInfo) => {
  await clearNewsletterPreference(page);
  await page.goto("/?newsletterNudge=force", { waitUntil: "domcontentloaded" });

  const isMobileProject = testInfo.project.name.includes("mobile");
  const nudgeHeading = page.getByRole("heading", {
    level: 2,
    name: "New essays, no noise.",
  });

  if (isMobileProject) {
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    await expect(nudgeHeading).toHaveCount(0);
    return;
  }

  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });

  await expect(nudgeHeading).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("complementary").getByPlaceholder("email@address.com"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Dismiss newsletter prompt" }).click();
  await expect(nudgeHeading).not.toBeVisible();
});

test("navbar keeps the core navigation affordances available", async ({
  page,
}) => {
  await seedNewsletterPreference(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("banner").getByRole("link", {
      name: mockPublication.displayTitle,
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
