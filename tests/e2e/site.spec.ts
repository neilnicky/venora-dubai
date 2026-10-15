import { expect, test, type Page } from "@playwright/test";
import { properties } from "../../src/content/properties.ts";

const routes = ["/", "/homes", "/enquire", ...properties.map((p) => `/homes/${p.slug}`)];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test.describe("routes", () => {
  for (const route of routes) {
    test(`${route} renders with one h1 and no errors`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }

  test("unknown routes get the 404 page", async ({ page }) => {
    const res = await page.goto("/homes/not-a-home");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /view the homes/i })).toBeVisible();
  });

  test("every internal link on the home page resolves", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThan(10);
    for (const href of hrefs) {
      const res = await request.get(href.split("#")[0]!);
      expect(res.status(), href).toBe(200);
    }
  });

  test("external links open safely and only go to Venora's Instagram", async ({ page }) => {
    await page.goto("/homes/villa-2026-10-13");
    const external = await page.locator("a[target='_blank']").evaluateAll((as) => as.map((a) => [a.getAttribute("href"), a.getAttribute("rel")]));
    expect(external.length).toBeGreaterThan(0);
    for (const [href, rel] of external) {
      expect(rel).toContain("noopener");
      expect(href).toMatch(/^https:\/\/(www\.instagram\.com\/venora_dubai\/|ig\.me\/m\/venora_dubai)/);
    }
  });

  test("referenced media files exist", async ({ page, request }) => {
    await page.goto("/homes");
    const srcs = await page.locator("video[data-src], img").evaluateAll((els) =>
      els.map((el) => (el instanceof HTMLVideoElement ? el.dataset.src! : (el as HTMLImageElement).getAttribute("src")!)),
    );
    for (const src of new Set(srcs)) {
      const res = await request.head(src);
      expect(res.status(), src).toBe(200);
    }
  });
});

test.describe("homes archive", () => {
  test("filters by type and keeps the URL in sync", async ({ page }) => {
    await page.goto("/homes");
    const filters = page.getByRole("group", { name: "Property type" });
    await filters.getByRole("link", { name: /^Penthouses/ }).click();
    await expect(page).toHaveURL(/\?type=penthouse$/);
    await expect(page.locator("[data-home-card]:visible")).toHaveCount(2);
    await expect(page.locator("[data-homes-count]")).toHaveText("Showing 2 penthouses");
    await filters.getByRole("link", { name: /^All/ }).click();
    await expect(page.locator("[data-home-card]:visible")).toHaveCount(properties.length);
  });

  test("reads the filter from a direct link and sorts oldest first", async ({ page }) => {
    await page.goto("/homes?type=villa&sort=oldest");
    const slugs = await page.locator("[data-home-card]:visible").evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.slug));
    expect(slugs[0]).toBe("villa-2026-09-09");
    expect(slugs.every((s) => s!.startsWith("villa-"))).toBe(true);
    await expect(page.locator("[data-sort]")).toHaveValue("oldest");
  });

  test("a card opens its own home page", async ({ page }) => {
    await page.goto("/homes");
    const first = page.locator("[data-home-card]").first();
    const slug = await first.getAttribute("data-slug");
    await first.locator(".pcard__link").click();
    await expect(page).toHaveURL(new RegExp(`/homes/${slug}$`));
    await expect(page.locator("h1")).toHaveText(properties.find((p) => p.slug === slug)!.title);
  });

  test("unverified facts read 'On request' instead of invented values", async ({ page }) => {
    await page.goto("/homes/penthouse-2026-09-28");
    for (const label of ["Price", "Bedrooms", "Size", "Developer"]) {
      await expect(page.locator(".facts__row", { hasText: label }).locator("dd")).toHaveText("On request");
    }
  });
});

test.describe("enquiry", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("composes a DM about the home and never claims it was sent", async ({ page }) => {
    const home = properties.find((p) => p.slug === "villa-2026-10-06")!;
    await page.goto(`/homes/${home.slug}`);
    await page.getByRole("link", { name: "Ask about this home" }).first().click();
    const dialog = page.getByRole("dialog", { name: /start an enquiry/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("[data-home-title]")).toHaveText(home.title);
    await expect(dialog.getByLabel("Property type")).toHaveValue("villa");

    await dialog.getByRole("button", { name: "Write my message" }).click();
    await expect(dialog.getByText("Tell us your name")).toBeVisible();
    await expect(dialog.getByLabel("Your name")).toBeFocused();

    await dialog.getByLabel("Your name").fill("Test Buyer");
    await dialog.getByLabel(/Budget/).selectOption("10-20m");
    await dialog.getByRole("button", { name: "Write my message" }).click();

    const composed = dialog.locator("[data-composed]");
    await expect(composed).toBeVisible();
    await expect(composed).toHaveValue(/Hello Venora, I'm Test Buyer\./);
    await expect(composed).toHaveValue(new RegExp(`/homes/${home.slug}`));
    await expect(composed).toHaveValue(/Budget: AED 10M to 20M/);
    await expect(dialog.getByText("Nothing has been sent yet")).toBeVisible();
    await expect(dialog.getByRole("link", { name: /open instagram chat/i })).toHaveAttribute("href", "https://ig.me/m/venora_dubai");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("Test Buyer");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("the enquiry page applies presets from the URL", async ({ page }) => {
    await page.goto("/enquire?interest=invest&type=penthouse&home=penthouse-2026-09-14");
    await expect(page.getByLabel("Investing")).toBeChecked();
    await expect(page.getByLabel("Property type")).toHaveValue("penthouse");
    await expect(page.locator("[data-home-title]")).toHaveText("Sea-view penthouse with a terrace pool");
  });

  test("CTAs fall back to /enquire without JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/homes/villa-2026-10-13");
    await expect(page.getByRole("link", { name: "Ask about this home" }).first()).toHaveAttribute("href", "/enquire?type=villa&home=villa-2026-10-13");
    await ctx.close();
  });
});

test.describe("navigation", () => {
  test("mobile menu opens, traps focus and closes with Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/homes");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("header hides on scroll down and returns on scroll up", async ({ page }) => {
    await page.goto("/homes");
    const header = page.locator("[data-header]");
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveAttribute("data-hidden", "true");
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toHaveAttribute("data-hidden", "false");
  });
});

test.describe("layout and motion", () => {
  for (const width of [320, 390, 768, 1280]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const route of ["/", "/homes", "/homes/villa-2026-10-09", "/enquire"]) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, route).toBeLessThanOrEqual(0);
      }
    });
  }

  test("the hero scene scrubs with scroll", async ({ page }) => {
    await page.goto("/");
    const composite = page.locator("[data-hero-composite]");
    await expect(composite).toHaveCSS("opacity", "0");
    const travel = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>("[data-hero]")!;
      return hero.offsetHeight - window.innerHeight;
    });
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(travel * 0.65));
    await expect(composite).toHaveCSS("opacity", "1");
  });

  test("reduced motion: static hero, no smooth scroll, no autoplay", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/");
    const heroHeight = await page.locator("[data-hero]").evaluate((el) => el.getBoundingClientRect().height);
    expect(heroHeight).toBeLessThanOrEqual(900);
    expect(await page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
    await page.waitForTimeout(500);
    expect(await page.locator("video[data-loop][src]").count()).toBe(0);
    await expect(page.locator("[data-wipe] .wipe-cover")).toHaveCount(0);
    await ctx.close();
  });
});
