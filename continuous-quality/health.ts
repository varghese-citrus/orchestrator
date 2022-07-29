import { sitesToInspect } from "./sites.ts";
import { testingAsserts as ta } from "../deps-test.ts";

//Created by: Shanil Sasikumar
//Created on: 21/12/2020
//Objective: To ensure versions of library in health check ofthe site
//Module: Health
//Last modified on: 21/12/2020
//Last modified by: Shanil Sasikumar

export interface TestCase {
  readonly path: string;
  readonly name: string;
  readonly query: Record<string, unknown>;
}

sitesToInspect.forEach((site) => {
  Deno.test(
    {
      name:
        `[AEC-MGYP-CA-FN-GN-0028] Medigy-Website ${site.name} Health Checks ("/health") Validations`,
      fn: async function () {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = {
          method: "GET",
          headers: headers,
        };
        const resp = await fetch(
          site.pageUrl("/health"),
          requestOptions,
        );
        ta.assertEquals(
          resp.status,
          200,
          `${
            site.pageUrl("/health")
          } should return HTTP 200 OK status, not ${resp.status}`,
        );
        const response = await resp.json();
        ta.assertEquals(
          response.status,
          "pass",
          `${
            site.pageUrl("/health")
          } response should return "pass" status, not ${response.status}`,
        );
      },
      sanitizeOps: false,
      sanitizeResources: false,
    },
  );
});
