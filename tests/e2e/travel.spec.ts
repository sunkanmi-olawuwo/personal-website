import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

async function waitForTravelAtlas(page: Page) {
  await expect(page.locator('[data-travel-atlas-hydrated="true"]')).toBeVisible();
}

test("header navigation reaches the travel atlas", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByRole("banner").getByRole("link", { name: "Travel" }).click();

  await waitForTravelAtlas(page);
  await expect(page).toHaveURL(/\/travel/);
  await expect(
    page.getByText(/A personal atlas of places that left texture behind/),
  ).toBeVisible();
});

test("travel hero renders a visible H1 and stats line", async ({ page }) => {
  await page.goto("/travel", { waitUntil: "domcontentloaded" });
  await waitForTravelAtlas(page);

  await expect(
    page.getByRole("heading", { level: 1, name: /Notes from the road/i }),
  ).toBeVisible();
  await expect(page.getByLabel("Travel statistics")).toBeVisible();
});

test("travel navbar reflects active section", async ({ page }) => {
  await page.goto("/travel", { waitUntil: "domcontentloaded" });
  await waitForTravelAtlas(page);

  const travelLink = page
    .getByRole("banner")
    .getByRole("link", { name: "Travel" });
  await expect(travelLink).toHaveAttribute("data-active", "true");
  await expect(travelLink).toHaveAttribute("aria-current", "page");
});

test("visited countries are grouped by continent", async ({ page }) => {
  await page.goto("/travel", { waitUntil: "domcontentloaded" });
  await waitForTravelAtlas(page);

  const visitedSection = page.locator(
    'section[aria-labelledby="visited-countries-title"]',
  );
  await expect(
    visitedSection.getByText("Africa", { exact: true }),
  ).toBeVisible();
  await expect(
    visitedSection.getByText("Europe", { exact: true }),
  ).toBeVisible();
});

test("per-country accent is applied as a CSS custom property", async ({
  page,
}) => {
  await page.goto("/travel?country=united-kingdom", {
    waitUntil: "domcontentloaded",
  });
  await waitForTravelAtlas(page);

  const accent = await page.evaluate(() => {
    const main = document.querySelector(
      "main[data-travel-atlas-hydrated]",
    ) as HTMLElement | null;

    return main?.style.getPropertyValue("--country-accent") ?? "";
  });

  expect(accent).toBe("#3b82f6");
});

test("lightbox surfaces the memory quote and a thumbnail strip", async ({
  page,
}) => {
  await page.goto("/travel?country=nigeria", { waitUntil: "domcontentloaded" });
  await waitForTravelAtlas(page);

  await page.getByRole("button", { name: "Open Lagos lagoon light" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Other memories")).toBeVisible();

  const active = dialog
    .getByRole("button", { name: /Show Lagos lagoon light/ });
  await expect(active).toHaveAttribute("aria-current", "true");

  await dialog
    .getByRole("button", { name: /Show Abuja evening calm/ })
    .click();

  await expect(
    dialog.getByRole("heading", { name: "Abuja evening calm" }),
  ).toBeVisible();
});

test("travel deep links preselect the requested country", async ({ page }) => {
  await page.goto("/travel?country=united-kingdom", {
    waitUntil: "domcontentloaded",
  });
  await waitForTravelAtlas(page);

  await expect(
    page.getByRole("heading", { level: 3, name: "United Kingdom" }),
  ).toBeVisible();
  await expect(page.getByText("Home base and slow exploration")).toBeVisible();
});

test("country rail interaction updates the panel and URL", async ({ page }) => {
  await page.goto("/travel?country=united-kingdom", {
    waitUntil: "domcontentloaded",
  });
  await waitForTravelAtlas(page);

  await page.getByRole("button", { name: "Select Nigeria" }).click();

  await expect(page).toHaveURL(/country=nigeria/);
  await expect(
    page.getByRole("heading", { level: 3, name: "Nigeria" }),
  ).toBeVisible();
  await expect(page.getByText("Family roots and return visits")).toBeVisible();
});

test("travel gallery lightbox opens and closes", async ({ page }) => {
  await page.goto("/travel?country=nigeria", { waitUntil: "domcontentloaded" });
  await waitForTravelAtlas(page);

  await page.getByRole("button", { name: "Open Lagos lagoon light" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Lagos lagoon light" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
});
