import { config, testingAsserts as ts } from "../deps-test.ts";
import { medigyCommonLogin } from "./login.ts";
import { getSitesToInspect } from "./sites.ts";

function sendInvite() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: "Test Case Name: AEC-MGYP-CA-FN-GN-0020",
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-MGYP-CA-FN-GN-0020",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.pageUrl("topic"),
        });
        try {
          const isSendInvite = await doSendInvite(
            site.pageUrl("login"),
            site.pageUrl("topic"),
          );
          ts.assertEquals(isSendInvite, true);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage = "Not able to Login";
          execMetrics.labels.object.finalizeOn = new Date();
          metrics.record(execMetrics);
          await metrics.persistUitMetrics(metrics);
          throw new Error("Error while Login");
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

async function doSendInvite(baseUrl: string, site: string): Promise<boolean> {
  let browser = null;
  try {
    const some = medigyCommonLogin(baseUrl);
    const page = (await some).page;
    browser = (await some).browser;
    const loggedUser = (await some).LoggedUser;
    const configuration = config();
    console.log("Is user logged in? :" + loggedUser.toString());

    if (loggedUser.toString() == "true") {
      console.log("Redirecting to topics page");
      await page.goto(site);
      await page.waitForTimeout(10000);
      const topicLink = await page.$(
        "body > section.commun-wrapper.community_page > article > div > div > main > section:nth-child(1) > div > div.description.col-md-8 > h2 > a:nth-child(1)",
      );
      console.log("Redirecting to first topics category page");
      await topicLink?.click();
      await page.waitForTimeout(10000);

      const detailsLink = await page.$$(
        "#content > div > div:nth-child(3) > div > article > div > ul > li > a",
      );
      if (detailsLink.length == 0) {
        throw Error("There are no topic detail link");
      }
      console.log("Redirecting to first topics detail page");
      for (let index = 0; index < detailsLink.length; index++) {
        const element = detailsLink[index];
        const countText = await element?.$eval(
          ".category-count",
          (el: { textContent: string }) => el.textContent,
        );
        console.log("Topic Count :" + countText);
        if (countText.toString().trim() == "(0)") {
          continue;
        } else {
          console.log("Clicking on details");
          await element.click();
          break;
        }
      }

      await page.waitForTimeout(10000);
      const inviteLink = await page.$(
        "body > section.detail-wrapper.section-collection > div > div > article:nth-child(2) > div > div.row > div.col-lg-4 > div > div > div > div > a",
      );
      console.log("Clicking on topic detail invite Link");
      await inviteLink?.click();
      await page.waitForTimeout(15000);
      await page.type("#inviteFirstName", configuration.LOGGED_NAME);
      await page.type("#inviteLastName", configuration.LOGGED_NAME);
      await page.type("#inviteEmail", configuration.USERNAME);
      await page.waitForSelector("#inviteButton");
      await page.waitForTimeout(2000);
      const inviteButton = await page.$("#inviteButton");
      console.log("Clicking on Send invite Button");
      await inviteButton?.click();
      await page.waitForTimeout(20000);
      const successMessage = await page.$("#inviteMessage.alert.alert-success");
      console.log(
        "Did Success message come? " + (successMessage == null ? "No" : "Yes"),
      );
      return successMessage == null ? false : true;
    } else {
      throw Error("Not able to Login in Topic detail send invite");
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}

// sendInvite();
