import { testingAsserts as ts } from "../../deps-test.ts";
import { openBrowser } from "../medigy-home.ts";
import { getSitesToInspect } from "../sites.ts";

function googleBasicTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `${site.name} Demo Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await demoTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage = "Error in Google Page Test";
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

async function demoTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await openBrowser(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    await page.waitForNavigation({
      waitUntil: ["domcontentloaded", "networkidle0", "load"],
    });
    const title = await page.title();
    console.log(title);
    ts.assert(title, "Google");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
googleBasicTest();
