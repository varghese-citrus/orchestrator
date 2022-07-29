import { sitesToInspect } from "./sites.ts";
import { testingAsserts as ta } from "../deps-test.ts";
import {
  inspect as insp,
  queryableHTML as qh,
  safeHttpClient as shc,
} from "./deps.ts";

//Created by: Ditty
//Created on: 31/12/2020
//Objective: To ensure topic name is shown in listing page
//Module: News 
//Last modified on: 18/02/2021
//Last modified by: Shanil Sasikumar

for (const site of sitesToInspect) {
  const pagination = await site.getPageHTML(
    site.pageUrl("/news"),
  );
  ta.assert(
    shc.isTraversalResult(pagination),
    `Unable to traverse ${pagination}: should be a TraversalResult object`,
  );
  ta.assert(
    shc.isTraversalHtmlContent(pagination),
    `${pagination.request} should be parsed as HTML`,
  );
  if (qh.isQueryableHtmlContent(pagination.htmlContent)) {
    const i = 2;
    const newsCountHtml = (pagination.htmlContent).document(
      ".custom-pagination-block",
    ).text();
    const newsCountInMedigy = Number(
      newsCountHtml.split("items")[0],
    );
    const numPages = Math.floor(newsCountInMedigy / 10) +
      ((newsCountInMedigy % 10 == 0) ? 0 : 1);
    const allErrors: string[] = [];
    Deno.test({
      name:
        `[Content missing] Medigy-Website ${site.name} Topic Check in News Listing Page`,
      fn: async () => {
        for (let j = 1; j < numPages; j++) {
          const page = await site.getPageHTML(
            site.pageUrl("/news/page/" + j),
          );
          ta.assert(
            shc.isTraversalResult(page),
            `Unable to traverse ${page}: should be a TraversalResult object`,
          );
          ta.assert(
            shc.isTraversalHtmlContent(page),
            `${page.request} should be parsed as HTML`,
          );
          if (qh.isQueryableHtmlContent(page.htmlContent)) {
            const newsCountPerPage = (page.htmlContent).document(
              ".fhir-list-row .blog-card",
            ).length;
            for (let i = 1; i <= newsCountPerPage; i++) {
              const countTopics = (page.htmlContent).document(
                `.fhir-list-row .blog-card:nth-child(${i}) .tag-style-1`,
              ).length;
              const title = (page.htmlContent).document(
                `.fhir-list-row .blog-card:nth-child(${i})`,
              ).find(".card-title").text();
              if (countTopics < 1) {
                allErrors.push(
                  `Expect at least one topic for "${title}" in page no ${j} `,
                );
              }
            }
          }
        }
        if (allErrors.length > 0) {
          throw new Error(
            `Topic issue in News:\n    ${allErrors.join("\n    ")}`,
          );
        }
      },
      sanitizeOps: false,
      sanitizeResources: false,
    });
  }
}
