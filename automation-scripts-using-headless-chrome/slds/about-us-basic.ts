import { testingAsserts as ts } from "../../deps-test.ts";
import { openBrowser } from "../medigy-home.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "./selectors/home.ts";
import { AboutUsSelectors as aus } from "./selectors/about-us.ts";

//Created by: Vaysage Vasudevan
//Created on: 05/11/2021
//Objective: The podcast’s banner image on the top of ‘About Us’ page correctly redirects the user to https://thehcbiz.com/decision-support-for-selecting-digital-health-tools/ page.
//Module: About-Us
//Last modified on: 27/12/2021
//Last modified by: Vaysage Vasudevan

function aboutUsBasicTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name:
        `[AEC-MGYP-CA-FN-GN-0156] Medigy-Website ${site.name} About Us Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-MGYP-CA-FN-GN-0156",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await aboutUsBasic(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in About Us Page Test";
          execMetrics.labels.object.finalizeOn = new Date();
          metrics.record(execMetrics);
          await metrics.persistUitMetrics(metrics);
          throw error;
        }
        metrics.record(execMetrics);
        execMetrics.labels.object.finalizeOn = new Date();
        await metrics.persistUitMetrics(metrics);
      },
      sanitizeOps: false,
      sanitizeResources: false,
    });
  });
}

async function aboutUsBasic(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await openBrowser(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = page.waitForNavigation({
      waitUntil: ["domcontentloaded", "networkidle0", "load"],
    });
    await page.waitForSelector(hs.aboutUs);
    await page.click(hs.aboutUs);
    await navigationPromise;
    await page.waitForTimeout(4000);
    const podcastItem = await page.$(aus.podCast);
    ts.assert(podcastItem != null, `PODcast Item is null`);
    const hrefURL = String(
      await (await podcastItem?.getProperty("href"))?.jsonValue(),
    );
    const expectedURL =
      "https://thehcbiz.com/decision-support-for-selecting-digital-health-tools/";
    ts.assert(
      hrefURL == expectedURL,
      `PodCast url is invalid. PODcastURL: ${hrefURL}`,
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}

aboutUsBasicTest();
