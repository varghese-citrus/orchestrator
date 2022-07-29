import { Page, testingAsserts as ts } from "../deps-test.ts";
import { openBrowser } from "./medigy-home.ts";
import { getSitesToInspect } from "./sites.ts";

function awardBannertest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name:
        `[AEC-MGYP-CA-FN-GN-0033] Medigy-Website ${site.name} Award Banner Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-MGYP-CA-FN-GN-0033",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.pageUrl("login"),
        });
        try {
          await awardBanner(site.baseURL, site.pageUrl("recognitions"));
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage = "Award banner test failed";
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

async function awardBanner(baseUrl: string, site: string) {
  let browser = null;
  try {
    const openHome = openBrowser(baseUrl);
    const page = (await openHome).page;
    browser = (await openHome).browser;
    await page.setViewport({ width: 1270, height: 980 });
    const awardList: string[] = [
      "#awards-landing > main > div:nth-child(5) > article > h2 > a",
      "#awards-landing > main > div:nth-child(8) > article > h2 > a",
    ];
    await page.goto(site);
    await page.waitForTimeout(3000);
    await awardListCommon(awardList[0], page);
    await page.goto(site);
    await page.waitForTimeout(3000);
    await awardListCommon(awardList[1], page);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
async function awardListCommon(awardList: string, page: Page) {
  try {
    await page.click(awardList);
    await page.waitForTimeout(3000);
    const elementCount: number = (await page.$$(".fhir-list-row")).length;
    for (let index = 1; index <= elementCount; index++) {
      const awardElement: string =
        "body > section.detail-wrapper > article:nth-child(4) > div > div > div > div > div.top-10-most-list > div > main:nth-child(" +
        index + ") > div > article > h2 > strong > a";
      await page.click(awardElement);
      await page.waitForTimeout(4000);
      const elementExist = await page.$$eval<number>(
        "body > div.about-wrapper > main > div:nth-child(2) > div > picture > img",
        (el) => {
          return el.length;
        },
      );
      const len = Number(elementExist.toString());
      console.log("Checking " + awardElement);
      ts.assert(len > 0);
      await page.goBack();
    }
  } catch (error) {
    throw error;
  }
}

awardBannertest();
