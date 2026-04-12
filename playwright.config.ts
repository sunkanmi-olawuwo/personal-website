import { defineConfig, devices } from "@playwright/test";

const isLiveMode = process.env.PLAYWRIGHT_LIVE === "1";
const stringEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  ),
);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3400",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3400",
    url: "http://127.0.0.1:3400",
    reuseExistingServer: false,
    env: isLiveMode
      ? stringEnv
      : {
          ...stringEnv,
          NEXT_PUBLIC_HASHNODE_ENDPOINT:
            stringEnv.NEXT_PUBLIC_HASHNODE_ENDPOINT ?? "https://gql.hashnode.com",
          NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "",
        },
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
});
