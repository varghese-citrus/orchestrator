import { testingAsserts as ts } from "../../deps-test.ts";
import { medigyCommonLogin } from "./login.ts";
import { getSitesToInspect } from "../sites.ts";

//Created by: Vaysage Vasudevan
//Created on: 11/05/2021
//Objective: To ensure user can login to application
//Module: Login
//Last modified on: 11/05/2021
//Last modified by: Vaysage Vasudevan

function medigyLogin() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-MGYP-CA-FN-GN-0090] Medigy-Website ${site.name} Login Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-MGYP-CA-FN-GN-0090",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.pageUrl("login"),
        });
        try {
          console.log("Login URL " + site.pageUrl("login"));
          const isLoggedIn = await doLogin(site.baseURL);
          ts.assertEquals(isLoggedIn, true);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage = "Not able to Login";
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

async function doLogin(site: string): Promise<boolean> {
  let browser;
  try {
    console.log("Running Login Test");
    const newLogin = await medigyCommonLogin(site);
    browser = newLogin.browser;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await browser?.close();
  }
}

medigyLogin();
