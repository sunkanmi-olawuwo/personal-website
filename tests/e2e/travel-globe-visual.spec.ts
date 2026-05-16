import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("newsletter", "playwright@example.com");
  });
});

test("travel globe paints a nonblank canvas", async ({ page }, testInfo) => {
  await page.goto("/travel?country=nigeria", { waitUntil: "domcontentloaded" });

  const globe = page.locator("[data-travel-globe]");
  const canvas = globe.locator("canvas").first();

  await expect(canvas).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(1400);
  const screenshot = await globe.screenshot({
    path: testInfo.outputPath("travel-globe.png"),
  });

  const pixelStats = await page.evaluate(async (base64Image) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64Image}`;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Globe screenshot failed to load"));
    });

    const width = Math.max(1, Math.min(128, image.naturalWidth));
    const height = Math.max(1, Math.min(128, image.naturalHeight));
    const scratch = document.createElement("canvas");
    scratch.width = width;
    scratch.height = height;
    const context = scratch.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) {
      return {
        activePixels: 0,
        totalPixels: width * height,
        brightnessRange: 0,
      };
    }

    context.drawImage(image, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height).data;
    let activePixels = 0;
    let minBrightness = Number.POSITIVE_INFINITY;
    let maxBrightness = 0;

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];
      const brightness = data[index] + data[index + 1] + data[index + 2];

      if (alpha > 0 && brightness > 8) {
        activePixels += 1;
        minBrightness = Math.min(minBrightness, brightness);
        maxBrightness = Math.max(maxBrightness, brightness);
      }
    }

    return {
      activePixels,
      totalPixels: width * height,
      brightnessRange:
        minBrightness === Number.POSITIVE_INFINITY
          ? 0
          : maxBrightness - minBrightness,
    };
  }, screenshot.toString("base64"));

  expect(pixelStats.activePixels).toBeGreaterThan(100);
  expect(pixelStats.brightnessRange).toBeGreaterThan(10);
});
