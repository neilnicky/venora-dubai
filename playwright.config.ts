import { defineConfig, devices } from "@playwright/test";

// E2E runs against the production build: `pnpm build && pnpm test:e2e`.
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  workers: 4,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4331" },
  webServer: {
    // Call the binary directly: the pnpm wrapper does not pass the shutdown signal on, so the run hung.
    command: "node_modules/.bin/astro preview --port 4331 --host 127.0.0.1 --ignore-lock",
    url: "http://127.0.0.1:4331",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
