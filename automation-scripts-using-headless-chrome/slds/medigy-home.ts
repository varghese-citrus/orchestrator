import { getBrowser } from "../start-browser.ts";
import { Browser, Page } from "../../deps-test.ts";
import { HomeSelectors as hs } from "./selectors/home.ts";

//Created by: Vaysage Vasudevan
//Created on: 07/05/2021
//Objective: To ensure user can login to application
//Module: General
//Last modified on: 06/01/2022
//Last modified by: Sneha

interface OpenBrowser {
  browser: Browser;
  page: Page;
}

async function openBrowser(
  site = "https://devl.medigy.com/",
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
      hs.cookieBtn,
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
