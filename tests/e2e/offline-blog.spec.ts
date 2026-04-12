import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

test("offline home page renders the fallback publication and post list", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Personal Website" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Connect your Hashnode publication" }),
  ).toBeVisible();
  await expect(
    page.getByText("The app is running locally with placeholder content."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "That's all for today!" }),
  ).toBeDisabled();
});

test("offline blog post page renders the fallback article", async ({ page }) => {
  await page.goto("/welcome");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Connect your Hashnode publication",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "This app has been upgraded and can now build without external services.",
    ),
  ).toBeVisible();
});

test("theme navigation works from the navbar", async ({ page }) => {
  await page.goto("/");

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
