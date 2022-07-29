// Dependencies required during engineering/testing only (not in production)
import puppeteer from "https://deno.land/x/puppeteer@14.1.1/mod.ts";
export { puppeteer };
export * as testingAsserts from "https://deno.land/std@0.94.0/testing/asserts.ts";
export { config } from "https://deno.land/x/dotenv/mod.ts";
export type { Page } from "https://deno.land/x/puppeteer@14.1.1/vendor/puppeteer-core/puppeteer/common/Page.d.ts";
export type { Browser } from "https://deno.land/x/puppeteer@14.1.1/vendor/puppeteer-core/puppeteer/common/Browser.d.ts";
