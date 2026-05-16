import { expect, test } from "@playwright/test";

import { mockPostEdges, mockPublication } from "../../src/lib/mock-blog-data";
import { siteProfile } from "../../src/lib/site-profile";

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
    page.getByRole("heading", {
      level: 1,
      name: new RegExp(siteProfile.heroHeadline),
    }),
  ).toBeVisible();
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

test("home footer renders multi-column layout with socials, RSS, and inline subscribe", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const footer = page.getByRole("contentinfo");

  await expect(footer.getByText("Stay in touch")).toBeVisible();
  await expect(footer.getByText("Short list. Real essays. Never spam.")).toBeVisible();
  await expect(footer.getByPlaceholder("email@address.com")).toBeVisible();
  await expect(footer.getByRole("link", { name: "Latest essays" })).toHaveAttribute(
    "href",
    "/#latest-writing",
  );
  await expect(footer.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/about",
  );
  await expect(footer.getByRole("link", { name: "Now" })).toHaveAttribute(
    "href",
    "/now",
  );
  await expect(footer.getByRole("link", { name: "RSS" })).toHaveAttribute(
    "href",
    "/rss.xml",
  );
  await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    siteProfile.socialLinks?.[0].href ?? "",
  );
  await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    siteProfile.socialLinks?.[1].href ?? "",
  );
});

test("homepage reduces card motion when the user prefers reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const transitionsDisabled = await page
    .locator("[data-blog-card]")
    .first()
    .evaluate((element) =>
      getComputedStyle(element)
        .transitionDuration.split(",")
        .every((value) => parseFloat(value) === 0)
    );

  expect(transitionsDisabled).toBe(true);
});

test("home hero keeps the portrait above the heading on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const portrait = page.getByRole("img", {
    name: `Portrait of ${siteProfile.name}`,
  });
  const heading = page.getByRole("heading", {
    level: 1,
    name: new RegExp(siteProfile.heroHeadline),
  });

  await expect(portrait).toBeVisible();
  await expect(heading).toBeVisible();

  const portraitBox = await portrait.boundingBox();
  const headingBox = await heading.boundingBox();

  expect(portraitBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect((portraitBox?.y ?? 0) + (portraitBox?.height ?? 0)).toBeLessThan(
    headingBox?.y ?? 0,
  );
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
    await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/#latest-writing",
    );
    await expect(page.getByText(post.subtitle ?? "")).toBeVisible();
    await expect(page.getByRole("img", { name: post.title })).toBeVisible();
  }
});

test("theme navigation works from the navbar", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const themeButton = page.getByRole("button", {
    name: /switch to (dark|light) theme|toggle theme/i,
  });

  await expect(themeButton).toBeEnabled({ timeout: 15000 });
  await themeButton.click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await themeButton.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
