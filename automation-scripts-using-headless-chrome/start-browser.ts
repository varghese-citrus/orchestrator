import { Browser, puppeteer } from "../deps-test.ts";

async function getBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized", "--no-sandbox"],
  });
  return browser;
}
export { getBrowser };
