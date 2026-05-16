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
