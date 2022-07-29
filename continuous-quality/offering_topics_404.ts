import { sitesToInspect } from "./sites.ts";
import { testingAsserts as ta } from "../deps-test.ts";
import { queryableHTML as qh, safeHttpClient as shc } from "./deps.ts";

//Created by: Shanil Sasikumar
//Created on: 10/02/2021
//Objective: To ensure all offerings when clicked on topics should not show 404 status.
//Module: Offerings 
//Last modified on: 10/02/2021
//Last modified by: Shanil Sasikumar
export interface Topics404 {
  readonly offeringName: string;
  readonly topicName: string;
  readonly topicURL: string;
}
sitesToInspect.forEach((site) => {
  Deno.test(
    {
      name:
        `Medigy-Website ${site.name} Topics 404 Test in Netspective Offerings`,
      fn: async () => {
        const offeringWith404Topics: Topics404[] = [];
        const allErrors: string[] = [];
        const page = await site.getPageHTML(
          site.pageUrl(
            "profile/offeror/institution/netspective-communications/",
          ),
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
          const offeringCount = (page.htmlContent).document(
            `.tab-content .active .blog-card`,
          ).length;
          for (let i = 1; i <= offeringCount; i++) {
            const offeringName = (page.htmlContent).document(
              `.tab-content .active .blog-card:nth-child(${i}) .card-body .card-title a`,
            ).html();
            const topicsCount = (page.htmlContent).document(
              `.tab-content .active .blog-card:nth-child(${i}) .card-body .post-tags span`,
            ).length;
            for (let j = 1; j <= topicsCount; j++) {
              const topicName = (page.htmlContent).document(
                `.tab-content .active .blog-card:nth-child(${i}) .card-body .post-tags span:nth-child(${j}) a`,
              ).html();
              if (topicName) {
                const topicURL = (page.htmlContent).document(
                  `.tab-content .active .blog-card:nth-child(${i}) .card-body .post-tags span:nth-child(${j}) a`,
                ).attr("href");
                if (topicURL) {
                  const result = await shc.traverse(
                    {
                      request: site.pageUrl(topicURL),
                      options: shc.defaultTraverseOptions(),
                    },
                    shc.inspectHttpStatus,
                  );
                  if (shc.isInvalidHttpStatus(result)) {
                    const issueObject: Topics404 = {
                      offeringName: offeringName ? offeringName : "",
                      topicName: topicName,
                      topicURL: site.pageUrl(topicURL),
                    };
                    offeringWith404Topics.push(issueObject);
                    allErrors.push(
                      `Topic "${topicName}" found with 404 status "(${
                        site.pageUrl(topicURL)
                      })" for the offering "${offeringName}" \n `,
                    );
                  }
                }
              }
            }
          }
          await Deno.writeTextFile(
            "./topics_404.json",
            JSON.stringify(offeringWith404Topics),
            {
              append: true,
            },
          );
        }
        if (allErrors.length > 0) {
          throw new Error(
            `${allErrors.join("\n    ")}`,
          );
        }
      },
      sanitizeOps: false,
      sanitizeResources: false,
    },
  );
});
