import { getBrowser } from "./start-browser.ts";
import { Browser, Page } from "../deps-test.ts";

interface OpenBrowser {
  browser: Browser;
  page: Page;
}

async function openBrowser(
  site = "https://google.com/",
): Promise<OpenBrowser> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36",
    );
    page.setDefaultNavigationTimeout(120000);
    await page.setViewport({ width: 1270, height: 1080 });
    await page.goto(site);
    await page.waitForTimeout(1000);
    const cookieButton = await page.$(
      "body > article > div.cookie-bottom > div > div > div:nth-child(2) > div > form > button",
    );
    const buttonVisible = await cookieButton?.boundingBox();
    if (buttonVisible) {
      await cookieButton?.click().catch((e) => {
        console.log(e);
      });
    }
    await page.waitForTimeout(4000);
    return { browser, page };
  } catch (error) {
    console.error(error);
    await browser?.close();
    throw error;
  }
}
export { openBrowser };
