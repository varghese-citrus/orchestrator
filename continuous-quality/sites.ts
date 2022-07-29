// deno-lint-ignore-file
import {
  inspect as insp,
  inspectText as inspT,
  queryableHTML as qh,
  rss,
  safeHttpClient as shc,
  urlcat,
} from "./deps.ts";

import { AssuranceCaseMetrics } from "./metrics.ts";

const EVENT_COUNT_ACCURACY_PERCENTAGE = 5;
const INSTITUTION_COUNT_ACCURACY_PERCENTAGE = 5;
const COMMUNITY_COUNT_ACCURACY_PERCENTAGE = 5;
const TOPIC_COUNT_ACCURACY_PERCENTAGE = 5;
const FEED_COUNT_ACCURACY_PERCENTAGE = 5;
const NEWS_COUNT_ACCURACY_PERCENTAGE = 5;
const OFFERING_ACCURACY_PERCENTAGE_DQA = 5;
const IMAGE_MAX_SIZE = 2000000; // 2MB
const siteID = Deno.env.get("DPO_SITE_ID");

console.log(siteID);

export interface RssFeedDefn {
  readonly feedURL: string;
  readonly maxAgeInHours: number;
  readonly itemPathStartsWith: string;
  readonly caseID?: string;
}

export type RssFeedDefns = { [key: string]: RssFeedDefn };

export interface RssFeed {
  readonly defn: RssFeedDefn;
  readonly feed: rss.JsonFeed;
}

export interface SiteCommon {
  readonly name: string;
  readonly baseURL: string;
  readonly googleTagManagerIdentity: string;
  readonly elasticSearchURL?: string;
  readonly dqaUrl?: string;
  readonly cqaUrl?: string;
  readonly metrics: AssuranceCaseMetrics;
  readonly pageUrl: (path: string, params?: urlcat.ParamMap) => string;
  readonly inspectPage: (
    req: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ) => Promise<RequestInfo | shc.RequestInfoInspectionResult>;
  readonly getPageHTML: (
    req: RequestInfo,
    ...inspectors: shc.RequestInfoInspector[]
  ) => Promise<RequestInfo | shc.RequestInfoInspectionResult>;

  readonly inspectRobotFiles: (
    req: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ) => Promise<RequestInfo | shc.RequestInfoInspectionResult>;
}

export interface Site extends SiteCommon {
  readonly rssFeedDefns: RssFeedDefns;
  readonly communityAccuracyPercentage: number;
  readonly institutionAccuracyPercentage: number;
  readonly eventsAccuracyPercentage: number;
  readonly topicAccuracyPercentage: number;
  readonly feedsAccuracyPercentage: number;
  readonly newsAccuracyPercentage: number;
  readonly inspectRssFeed: (
    name: string,
    feed: RssFeedDefn,
    ...inspectors: insp.Inspector<RssFeed>[]
  ) => Promise<string[] | undefined>;
}

export interface ClaimSite extends SiteCommon {
}

export interface MedigyDQA {
  readonly name: string;
  readonly baseURL: string;
  readonly elasticSearchURL: string;
  readonly gitLabURL: string;
}
export interface MedigyCQA {
  readonly name: string;
  readonly baseURL: string;
}

export interface DemoQA {
  readonly name: string;
  readonly baseURL: string;
}

export function inspectMetaDescription(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const missingMetaMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0028",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyMetaMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0029",
      host: Deno.hostname(),
      status: "pass",
    });
    const duplicateMetaMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0030",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      const allErrors: string[] = [];
      const meta = html.meta();
      if (!meta.description) {
        missingMetaMetric.labels.object.status = "fail";
        missingMetaMetric.labels.object.statusMessage =
          "Meta description should be provided in SEO-friendly sites";
        allErrors.push(
          `Meta description should be provided in SEO-friendly sites \n`,
        );
      } else if (meta.description.length === 0) {
        emptyMetaMetric.labels.object.status = "fail";
        emptyMetaMetric.labels.object.statusMessage =
          "Meta description should be provided in SEO-friendly sites";
        allErrors.push(
          `Meta description should be provided in SEO-friendly sites \n`,
        );
      }
      if (html.document("meta[name='description']").length > 1) {
        duplicateMetaMetric.labels.object.status = "fail";
        duplicateMetaMetric.labels.object.statusMessage =
          "Instance of meta description tag in a page should not be greater than 1 in SEO-friendly sites";
        allErrors.push(
          `Instance of meta description tag in a page should not be greater than 1 in SEO-friendly sites \n`,
        );
      }
      missingMetaMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyMetaMetric.labels.object.pageURL = html.inspectionTarget.uri;
      duplicateMetaMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingMetaMetric.labels.object.finalizeOn = new Date();
      emptyMetaMetric.labels.object.finalizeOn = new Date();
      duplicateMetaMetric.labels.object.finalizeOn = new Date();
      metrics.record(missingMetaMetric);
      metrics.record(emptyMetaMetric);
      metrics.record(duplicateMetaMetric);
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectOgTags(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    if (qh.isQueryableHtmlContent(html)) {
      const meta = html.meta();
      const allErrors: string[] = [];
      const missingOgTitleMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0033",
        host: Deno.hostname(),
        status: "pass",
      });
      const emptyOgTitleMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0034",
        host: Deno.hostname(),
        status: "pass",
      });
      const missingOgLocaleMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0048",
        host: Deno.hostname(),
        status: "pass",
      });
      const emptyOgLocaleMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0049",
        host: Deno.hostname(),
        status: "pass",
      });
      const missingOgDescriptionMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0045",
        host: Deno.hostname(),
        status: "pass",
      });
      const emptyOgDescriptionMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0046",
        host: Deno.hostname(),
        status: "pass",
      });
      const missingOgTypeMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0043",
        host: Deno.hostname(),
        status: "pass",
      });
      const emptyOgTypeMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0044",
        host: Deno.hostname(),
        status: "pass",
      });
      const missingOgUrlMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0035",
        host: Deno.hostname(),
        status: "pass",
      });
      const emptyOgUrlMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0036",
        host: Deno.hostname(),
        status: "pass",
      });
      const incompleteOgUrlMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0038",
        host: Deno.hostname(),
        status: "pass",
      });
      const missingOgImageMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0039",
        host: Deno.hostname(),
        status: "pass",
      });
      const emptyOgImageMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0040",
        host: Deno.hostname(),
        status: "pass",
      });
      const incompleteOgImageMetric = metrics.assuranceCaseExec.instance({
        initOn: new Date(),
        txId: metrics.metricsTransactionId,
        caseID: "AEC-MGYP-CA-ST-SEO-0042",
        host: Deno.hostname(),
        status: "pass",
      });
      if (!meta["og:title"]) {
        missingOgTitleMetric.labels.object.status = "fail";
        missingOgTitleMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:title' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:title' should be provided in SEO-friendly sites`,
        );
      } else if (meta["og:title"].length == 0) {
        emptyOgTitleMetric.labels.object.status = "fail";
        emptyOgTitleMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:title' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:title' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["og:locale"]) {
        missingOgLocaleMetric.labels.object.status = "fail";
        missingOgLocaleMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:locale' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:locale' should be provided in SEO-friendly sites`,
        );
      } else if (meta["og:locale"].length == 0) {
        emptyOgLocaleMetric.labels.object.status = "fail";
        emptyOgLocaleMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:locale' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:locale' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["og:description"]) {
        missingOgDescriptionMetric.labels.object.status = "fail";
        missingOgDescriptionMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:description' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:description' should be provided in SEO-friendly sites`,
        );
      } else if (meta["og:description"].length == 0) {
        emptyOgDescriptionMetric.labels.object.status = "fail";
        emptyOgDescriptionMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:description' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:description' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["og:type"]) {
        missingOgTypeMetric.labels.object.status = "fail";
        missingOgTypeMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:type' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:type' should be provided in SEO-friendly sites`,
        );
      } else if (meta["og:type"].length == 0) {
        emptyOgTypeMetric.labels.object.status = "fail";
        emptyOgTypeMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:type' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:type' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["og:url"]) {
        missingOgUrlMetric.labels.object.status = "fail";
        missingOgUrlMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:url' should not be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:url' should not be provided in SEO-friendly sites`,
        );
      } else if (meta["og:url"].length == 0) {
        emptyOgUrlMetric.labels.object.status = "fail";
        emptyOgUrlMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:url' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:url' should not be empty in SEO-friendly sites`,
        );
      }
      if (meta["og:url"] && meta["og:url"].length !== 0) {
        const fullURL = inspectIsFullURL(meta["og:url"]);
        if (!fullURL) {
          incompleteOgUrlMetric.labels.object.status = "fail";
          incompleteOgUrlMetric.labels.object.statusMessage =
            `The 'content' attribute in 'og:url' contains the full url ${
              meta["og:url"]
            }`;
          allErrors.push(
            `The 'content' attribute in 'og:url' contains the full url ${
              meta["og:url"]
            }`,
          );
        }
      }
      if (!meta["og:image"]) {
        missingOgImageMetric.labels.object.status = "fail";
        missingOgImageMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:image' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:image' should be provided in SEO-friendly sites`,
        );
      } else if (meta["og:image"].length == 0) {
        emptyOgImageMetric.labels.object.status = "fail";
        emptyOgImageMetric.labels.object.statusMessage =
          `The 'content' attribute in 'og:image' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'og:image' should not be empty in SEO-friendly sites`,
        );
      }
      if (meta["og:image"] && meta["og:image"].length !== 0) {
        const fullURL = inspectIsFullURL(meta["og:image"]);
        if (!fullURL) {
          incompleteOgImageMetric.labels.object.status = "fail";
          incompleteOgImageMetric.labels.object.statusMessage =
            `The 'content' attribute in 'og:image' not contains the full url ${
              meta["og:image"]
            }`;
          allErrors.push(
            `The 'content' attribute in 'og:image' not contains the full url ${
              meta["og:image"]
            }`,
          );
        }
      }
      missingOgTitleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyOgTitleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingOgLocaleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyOgLocaleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingOgDescriptionMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      emptyOgDescriptionMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      missingOgTypeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyOgTypeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingOgUrlMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyOgUrlMetric.labels.object.pageURL = html.inspectionTarget.uri;
      incompleteOgUrlMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingOgImageMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyOgImageMetric.labels.object.pageURL = html.inspectionTarget.uri;
      incompleteOgImageMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingOgTitleMetric.labels.object.finalizeOn = new Date();
      emptyOgTitleMetric.labels.object.finalizeOn = new Date();
      missingOgLocaleMetric.labels.object.finalizeOn = new Date();
      emptyOgLocaleMetric.labels.object.finalizeOn = new Date();
      missingOgDescriptionMetric.labels.object.finalizeOn = new Date();
      emptyOgDescriptionMetric.labels.object.finalizeOn = new Date();
      missingOgTypeMetric.labels.object.finalizeOn = new Date();
      emptyOgTypeMetric.labels.object.finalizeOn = new Date();
      missingOgUrlMetric.labels.object.finalizeOn = new Date();
      emptyOgUrlMetric.labels.object.finalizeOn = new Date();
      incompleteOgUrlMetric.labels.object.finalizeOn = new Date();
      missingOgImageMetric.labels.object.finalizeOn = new Date();
      emptyOgImageMetric.labels.object.finalizeOn = new Date();
      incompleteOgImageMetric.labels.object.finalizeOn = new Date();
      metrics.record(missingOgTitleMetric);
      metrics.record(emptyOgTitleMetric);
      metrics.record(missingOgLocaleMetric);
      metrics.record(emptyOgLocaleMetric);
      metrics.record(missingOgDescriptionMetric);
      metrics.record(emptyOgDescriptionMetric);
      metrics.record(missingOgTypeMetric);
      metrics.record(emptyOgTypeMetric);
      metrics.record(missingOgUrlMetric);
      metrics.record(emptyOgUrlMetric);
      metrics.record(incompleteOgUrlMetric);
      metrics.record(missingOgImageMetric);
      metrics.record(emptyOgImageMetric);
      metrics.record(incompleteOgImageMetric);
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectImagesAlt(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0010"
        : "AEC-MGYP-CA-ST-SEO-0031",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyAltMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0011"
        : "AEC-MGYP-CA-ST-SEO-0032",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      const images = html.images();
      const allErrors: string[] = [];
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      emptyAltMetric.labels.object.pageURL = html.inspectionTarget.uri;
      images.map((imageElement, _index) => {
        if (!imageElement.alt || imageElement.alt === undefined) {
          if (
            !(allErrors.includes(
              `Image tag should be provided with alt value in SEO-friendly sites (${imageElement.src})`,
            ))
          ) {
            exeMetric.labels.object.status = "fail";
            exeMetric.labels.object.statusMessage =
              `Image tag should be provided with alt value in SEO-friendly sites (${imageElement.src})`,
              allErrors.push(
                `Image tag should be provided with alt value in SEO-friendly sites (${imageElement.src})`,
              );
          }
        } else if (imageElement.alt.length < 1) {
          emptyAltMetric.labels.object.status = "fail";
          emptyAltMetric.labels.object.statusMessage =
            `Image alt tag value should be empty in SEO-friendly sites (${imageElement.src})`;
          allErrors.push(
            `Image alt tag value should be empty in SEO-friendly sites (${imageElement.src})`,
          );
        }
      });
      exeMetric.labels.object.finalizeOn = new Date();
      emptyAltMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      metrics.record(emptyAltMetric);
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export async function inspectResponsiveMetaTags(
  html: qh.HtmlSourceSupplier | insp.InspectionResult<qh.HtmlSourceSupplier>,
): Promise<
  | qh.HtmlSourceSupplier
  | insp.InspectionResult<qh.HtmlSourceSupplier>
  | insp.InspectionIssue<qh.HtmlSourceSupplier>
> {
  if (qh.isQueryableHtmlContent(html)) {
    if (html.document("meta[name='viewport']").length < 1) {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have responsive meta tag",
      );
    }
    return html;
  } else {
    return insp.inspectionIssue(
      html,
      "SEO-friendly sites should have queryable HTML content",
    );
  }
}

export function inspectTwitterTags(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const missingTwitterSiteMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0052",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyTwitterSiteMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0053",
      host: Deno.hostname(),
      status: "pass",
    });
    const missingTwitterCardMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0050",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyTwitterCardMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0051",
      host: Deno.hostname(),
      status: "pass",
    });
    const missingTwitterTitleMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0054",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyTwitterTitleMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0055",
      host: Deno.hostname(),
      status: "pass",
    });

    const missingTwitterDescriptionMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0056",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyTwitterDescriptionMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0057",
      host: Deno.hostname(),
      status: "pass",
    });

    const missingTwitterImageMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0058",
      host: Deno.hostname(),
      status: "pass",
    });
    const emptyTwitterImageMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0059",
      host: Deno.hostname(),
      status: "pass",
    });
    const invalidTwitterImageMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0060",
      host: Deno.hostname(),
      status: "pass",
    });
    const partialTwitterImageMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0061",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      const meta = html.meta();
      const allErrors: string[] = [];
      if (!meta["twitter:site"]) {
        missingTwitterSiteMetric.labels.object.status = "fail";
        missingTwitterSiteMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:site' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:site' should be provided in SEO-friendly sites`,
        );
      } else if (meta["twitter:site"].length === 0) {
        emptyTwitterSiteMetric.labels.object.status = "fail";
        emptyTwitterSiteMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:site' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:site' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["twitter:card"]) {
        missingTwitterCardMetric.labels.object.status = "fail";
        missingTwitterCardMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:card' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:card' should be provided in SEO-friendly sites`,
        );
      } else if (meta["twitter:card"].length === 0) {
        emptyTwitterCardMetric.labels.object.status = "fail";
        emptyTwitterCardMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:card' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:card' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["twitter:title"]) {
        missingTwitterTitleMetric.labels.object.status = "fail";
        missingTwitterTitleMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:title' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:title' should be provided in SEO-friendly sites`,
        );
      } else if (meta["twitter:title"].length === 0) {
        emptyTwitterTitleMetric.labels.object.status = "fail";
        emptyTwitterTitleMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:title' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:title' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["twitter:description"]) {
        missingTwitterDescriptionMetric.labels.object.status = "fail";
        missingTwitterDescriptionMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:description' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:description' should be provided in SEO-friendly sites`,
        );
      } else if (meta["twitter:description"].length === 0) {
        emptyTwitterDescriptionMetric.labels.object.status = "fail";
        emptyTwitterDescriptionMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:description' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:description' should not be empty in SEO-friendly sites`,
        );
      }
      if (!meta["twitter:image"]) {
        missingTwitterImageMetric.labels.object.status = "fail";
        missingTwitterImageMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:image' should be provided in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:image' should be provided in SEO-friendly sites`,
        );
      } else if (meta["twitter:image"].length === 0) {
        emptyTwitterImageMetric.labels.object.status = "fail";
        emptyTwitterImageMetric.labels.object.statusMessage =
          `The 'content' attribute in 'twitter:image' should not be empty in SEO-friendly sites`;
        allErrors.push(
          `The 'content' attribute in 'twitter:image' should not be empty in SEO-friendly sites`,
        );
      }
      if (meta["twitter:image"] && meta["twitter:image"].length !== 0) {
        const fullURL = inspectIsFullURL(meta["twitter:image"]);
        if (!fullURL) {
          partialTwitterImageMetric.labels.object.status = "fail";
          partialTwitterImageMetric.labels.object.statusMessage =
            `The 'content' attribute in 'twitter:image' contains the full url ${
              meta["twitter:image"]
            }`;
          allErrors.push(
            `The 'content' attribute in 'twitter:image' contains the full url ${
              meta["twitter:image"]
            }`,
          );
        } else {
          const status = await inspect404Status(
            meta["twitter:image"],
            baseURL,
          );
          if (status) {
            invalidTwitterImageMetric.labels.object.status = "fail";
            invalidTwitterImageMetric.labels.object.statusMessage =
              `The url in 'content' attribute of 'twitter:image' is not found ${
                meta["twitter:image"]
              }`;
            allErrors.push(
              `The url in 'content' attribute of 'twitter:image' is not found ${
                meta["twitter:image"]
              }`,
            );
          }
        }
      }
      missingTwitterSiteMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      emptyTwitterSiteMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingTwitterCardMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      emptyTwitterCardMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingTwitterTitleMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      emptyTwitterTitleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      missingTwitterDescriptionMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      emptyTwitterDescriptionMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      missingTwitterImageMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      emptyTwitterImageMetric.labels.object.pageURL = html.inspectionTarget.uri;
      invalidTwitterImageMetric.labels.object.pageURL =
        html.inspectionTarget.uri;
      partialTwitterImageMetric.labels.object.pageURL =
        html.inspectionTarget.uri;

      missingTwitterSiteMetric.labels.object.finalizeOn = new Date();
      emptyTwitterSiteMetric.labels.object.finalizeOn = new Date();
      missingTwitterCardMetric.labels.object.finalizeOn = new Date();
      emptyTwitterCardMetric.labels.object.finalizeOn = new Date();
      missingTwitterTitleMetric.labels.object.finalizeOn = new Date();
      emptyTwitterTitleMetric.labels.object.finalizeOn = new Date();
      missingTwitterDescriptionMetric.labels.object.finalizeOn = new Date();
      emptyTwitterDescriptionMetric.labels.object.finalizeOn = new Date();
      missingTwitterImageMetric.labels.object.finalizeOn = new Date();
      emptyTwitterImageMetric.labels.object.finalizeOn = new Date();
      invalidTwitterImageMetric.labels.object.finalizeOn = new Date();
      partialTwitterImageMetric.labels.object.finalizeOn = new Date();
      metrics.record(missingTwitterSiteMetric);
      metrics.record(emptyTwitterSiteMetric);
      metrics.record(missingTwitterCardMetric);
      metrics.record(emptyTwitterCardMetric);
      metrics.record(missingTwitterTitleMetric);
      metrics.record(emptyTwitterTitleMetric);
      metrics.record(missingTwitterDescriptionMetric);
      metrics.record(emptyTwitterDescriptionMetric);
      metrics.record(missingTwitterImageMetric);
      metrics.record(emptyTwitterImageMetric);
      metrics.record(invalidTwitterImageMetric);
      metrics.record(partialTwitterImageMetric);
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

function inspectHomeContainsGoogleVer(
  baseURL: string,
  request: RequestInfo,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const missingMetaMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-STV-SEO-0071",
      host: Deno.hostname(),
      status: "pass",
    });
    if (request === (baseURL + "/")) {
      if (qh.isQueryableHtmlContent(html)) {
        const allErrors: string[] = [];
        const meta = html.meta();
        if (
          !meta["google-site-verification"] ||
          meta["google-site-verification"].length === 0 ||
          meta["google-site-verification"] !==
            "KXS2SOd2oLSuihfGpGFxOwTOFs5gDvoNQsqekZ5FUOY"
        ) {
          missingMetaMetric.labels.object.status = "fail";
          missingMetaMetric.labels.object.statusMessage =
            "Meta Tag(google-site-verification) should be provided in SEO-friendly sites";
          allErrors.push(
            `Meta Tag(google-site-verification) should be provided in SEO-friendly sites \n`,
          );
        }
        missingMetaMetric.labels.object.pageURL = html.inspectionTarget.uri;
        missingMetaMetric.labels.object.finalizeOn = new Date();
        metrics.record(missingMetaMetric);
        if (allErrors.length > 0) {
          return insp.inspectionIssue(
            html,
            allErrors.join("\n"),
          );
        }
        return html;
      } else {
        return insp.inspectionIssue(
          html,
          "SEO-friendly sites should have queryable HTML content",
        );
      }
    } else {
      return html;
    }
  };
}

function inspectUACodePresent(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const uacodeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-STV-SEO-0067",
      host: Deno.hostname(),
      status: "pass",
    });

    if (qh.isQueryableHtmlContent(html)) {
      const allErrors: string[] = [];

      if (html.htmlSource.includes("UA-93818-16")) {
        uacodeMetric.labels.object.status = "fail";
        uacodeMetric.labels.object.statusMessage =
          "UA Code Should not be present in HTML source";
        allErrors.push(
          `UA Code Should not be present in HTML source \n`,
        );
      }
      uacodeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      uacodeMetric.labels.object.finalizeOn = new Date();
      metrics.record(uacodeMetric);
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectOpenGraphHttpStatus(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const execMetricOgURL = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0037",
      host: Deno.hostname(),
      status: "pass",
    });
    const execMetricOgImage = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0041",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      const meta = html.meta();
      const allErrors: string[] = [];
      if (meta["og:url"] && meta["og:url"].length !== 0) {
        const status = await inspect404Status(meta["og:url"], baseURL);
        if (status) {
          allErrors.push(
            `The url in 'content' attribute of 'og:url' is not found ${
              meta["og:url"]
            }`,
          );
          execMetricOgURL.labels.object.status = "fail";
          execMetricOgURL.labels.object.statusMessage =
            `The url in 'content' attribute of 'og:url' is not found ${
              meta["og:url"]
            }`;
        }
        execMetricOgURL.labels.object.pageURL = html.inspectionTarget.uri;
        execMetricOgURL.labels.object.finalizeOn = new Date();
        metrics.record(execMetricOgURL);
      }
      if (meta["og:image"] && meta["og:image"].length !== 0) {
        const status = await inspect404Status(
          meta["og:image"],
          baseURL,
        );
        if (status) {
          allErrors.push(
            `The url in 'content' attribute of 'og:image' is not found ${
              meta["og:image"]
            }`,
          );
          execMetricOgImage.labels.object.status = "fail";
          execMetricOgImage.labels.object.statusMessage =
            `The url in 'content' attribute of 'og:image' is not found ${
              meta["og:image"]
            }`;
        }
        execMetricOgImage.labels.object.pageURL = html.inspectionTarget.uri;
        execMetricOgImage.labels.object.finalizeOn = new Date();
        metrics.record(execMetricOgImage);
      }
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectInvalidAnchors(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const execMetricBrokenLinks = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0001"
        : "AEC-MGYP-CA-ST-SEO-0001",
      host: Deno.hostname(),
      status: "pass",
    });
    const execMetricBrokenCss = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0004"
        : "AEC-MGYP-CA-ST-SEO-0008",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      const anchors = html.anchors();
      const linkTags = html.document("link").get();
      const allErrors: string[] = [];
      let brokenLinks = false;
      let brokenCss = false;
      await Promise.all(
        anchors.map(async (anchorElement, _index) => {
          if (
            anchorElement.href !== "#" && anchorElement.href !== "/" &&
            anchorElement.href !== "javascript:void(0);"
          ) {
            const fileExtension = (anchorElement.href).split(".").pop();
            if ((anchorElement.href).length > 0 && fileExtension !== "ics") {
              let targetURL = "";
              if (
                (anchorElement.href).indexOf("http://") === 0 ||
                (anchorElement.href).indexOf("https://") === 0
              ) {
                targetURL = anchorElement.href;
              } else {
                targetURL = `${baseURL}${anchorElement.href}`;
              }
              if (targetURL.startsWith(baseURL)) {
                const result = await shc.traverse(
                  {
                    request: targetURL,
                    options: shc.defaultTraverseOptions(),
                  },
                  shc.inspectHttpStatus,
                );
                if (shc.isInvalidHttpStatus(result)) {
                  brokenLinks = true;
                  if (
                    !(allErrors.includes(
                      `The URL found with 404 status ${anchorElement.href}`,
                    ))
                  ) {
                    allErrors.push(
                      `The URL found with 404 status ${anchorElement.href}`,
                    );
                  }
                }
              }
            }
          }
        }),
      );
      if (brokenLinks) {
        execMetricBrokenLinks.labels.object.status = "fail";
        execMetricBrokenLinks.labels.object.statusMessage = allErrors.join(
          "\n",
        );
      }
      await Promise.all(
        linkTags.map(
          async (
            linkElement: { attribs: { href: string } },
            _index: number,
          ) => {
            if (linkElement.attribs.href) {
              const status = await inspect404Status(
                linkElement.attribs.href,
                baseURL,
              );
              if (status) {
                brokenCss = true;
                if (
                  !(allErrors.includes(
                    `Broken link tag found ${linkElement.attribs.href}`,
                  ))
                ) {
                  allErrors.push(
                    `Broken link tag found ${linkElement.attribs.href}`,
                  );
                }
              }
            }
          },
        ),
      );
      if (brokenCss) {
        execMetricBrokenCss.labels.object.status = "fail";
        execMetricBrokenCss.labels.object.statusMessage = allErrors.join(
          "\n",
        );
      }
      execMetricBrokenLinks.labels.object.pageURL = html.inspectionTarget.uri;
      execMetricBrokenLinks.labels.object.finalizeOn = new Date();
      execMetricBrokenCss.labels.object.pageURL = html.inspectionTarget.uri;
      execMetricBrokenCss.labels.object.finalizeOn = new Date();
      metrics.record(execMetricBrokenLinks);
      metrics.record(execMetricBrokenCss);
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectBrokenImages(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0003"
        : "AEC-MGYP-CA-ST-SEO-0007",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const images = html.images();
      const allErrors: string[] = [];
      await Promise.all(
        images.map(async (imageElement, _index) => {
          if (imageElement.src) {
            const status = await inspect404Status(
              imageElement.src,
              baseURL,
            );
            if (status) {
              if (
                !(allErrors.includes(
                  `broken image found ${imageElement.src}`,
                ))
              ) {
                allErrors.push(
                  `broken image found ${imageElement.src}`,
                );
              }
            }
          } else {
            if (
              !(allErrors.includes(
                `Image tag should be provided with 'src' value in SEO-friendly sites`,
              ))
            ) {
              allErrors.push(
                `Image tag should be provided with 'src' value in SEO-friendly sites`,
              );
            }
          }
        }),
      );
      if (allErrors.length > 0) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage = allErrors.join("\n");
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectRobotsFile(
  baseURL: string,
  fileShouldExist: boolean,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-FNV-SEO-0020"
        : "AEC-MGYP-CA-ST-SEO-0019",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const robotsStatus = await inspect404Status(
        "/robots.txt",
        baseURL,
      );
      if (robotsStatus === fileShouldExist) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage = `robots.txt file ${
          fileShouldExist ? "not" : ""
        } found`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          `robots.txt file ${fileShouldExist ? "not" : ""} found`,
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectSitemapFile(
  baseURL: string,
  fileShouldExist: boolean,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-FNV-SEO-0021"
        : "AEC-MGYP-CA-ST-SEO-0021",
      host: Deno.hostname(),
      status: "pass",
    });
    const allErrors: string[] = [];
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const sitemapStatus = await inspect404Status(
        "/sitemap.xml",
        baseURL,
      );
      if (sitemapStatus === fileShouldExist) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage = `sitemap.xml file ${
          fileShouldExist ? "not" : ""
        } found`;
        allErrors.push(
          `sitemap.xml file ${fileShouldExist ? "not" : ""} found`,
        );
      }
      if (siteID?.includes("medigyClaims")) {
        const execHtmlMetric = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-MGYC-CA-FNV-SEO-0022",
          host: Deno.hostname(),
          status: "pass",
          pageURL: html.inspectionTarget.uri,
        });
        const sitemapHTMLStatus = await inspect404Status(
          "/sitemap.html",
          baseURL,
        );
        if (!sitemapHTMLStatus) {
          execHtmlMetric.labels.object.status = "fail";
          execHtmlMetric.labels.object.statusMessage =
            `sitemap.html should not included in the site`;
          execHtmlMetric.labels.object.finalizeOn = new Date();
          metrics.record(execHtmlMetric);
          allErrors.push(`sitemap.html should not included in the site`);
        } else {
          execHtmlMetric.labels.object.finalizeOn = new Date();
          metrics.record(execHtmlMetric);
        }
      }
      if (allErrors.length > 0) {
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          allErrors.join(
            "\n",
          ),
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectDuplicateTitle(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0008"
        : "AEC-MGYP-CA-ST-SEO-0026",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if (html.document("title").length > 1) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage =
          `Instance of title tag in a page should not be greater than 1 in SEO-friendly sites`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          `Instance of title tag in a page should not be greater than 1 in SEO-friendly sites`,
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectDuplicateOgDescription(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0047",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      const meta = html.meta();
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if (
        meta["og:description"] &&
        html.document('meta[property="og:description"]').length > 1
      ) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage =
          `Instance of og:description tag in a page should not be greater than 1 in SEO-friendly sites`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          `Instance of og:description tag in a page should not be greater than 1 in SEO-friendly sites`,
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectDuplicateHead(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0009"
        : "AEC-MGYP-CA-ST-SEO-0027",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if (html.document("head").length > 1) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage =
          `Instance of head tag in a page should not be greater than 1 in SEO-friendly sites`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          `Instance of head tag in a page should not be greater than 1 in SEO-friendly sites`,
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have queryable HTML content",
      );
    }
  };
}

export function inspectWhiteSpacesInOpenGraph(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    if (qh.isQueryableHtmlContent(html)) {
      const meta = html.meta();
      const allErrors = [];
      if (meta.description && meta.description.length !== 0) {
        if ((meta.description).trim() !== meta.description) {
          allErrors.push("Unwanted blank spaces in meta description");
        }
      }
      if (meta["og:title"] && meta["og:title"].length !== 0) {
        if ((meta["og:title"]).trim() !== meta["og:title"]) {
          allErrors.push("Unwanted blank spaces in og:title");
        }
      }
      if (meta["og:description"] && meta["og:description"].length !== 0) {
        if ((meta["og:description"]).trim() !== meta["og:description"]) {
          allErrors.push("Unwanted blank spaces in og:description");
        }
      }
      if (meta["og:url"] && meta["og:url"].length !== 0) {
        if ((meta["og:url"]).trim() !== meta["og:url"]) {
          allErrors.push("Unwanted blank spaces in og:url");
        }
      }
      if (meta["og:image"] && meta["og:image"].length !== 0) {
        if ((meta["og:image"]).trim() !== meta["og:image"]) {
          allErrors.push("Unwanted blank spaces in og:image");
        }
      }
      if (meta["og:type"] && meta["og:type"].length !== 0) {
        if ((meta["og:type"]).trim() !== meta["og:type"]) {
          allErrors.push("Unwanted blank spaces in og:type");
        }
      }
      if (meta["og:locale"] && meta["og:locale"].length !== 0) {
        if ((meta["og:locale"]).trim() !== meta["og:locale"]) {
          allErrors.push("Unwanted blank spaces in og:locale");
        }
      }
      if (meta["twitter:card"] && meta["twitter:card"].length !== 0) {
        if ((meta["twitter:card"]).trim() !== meta["twitter:card"]) {
          allErrors.push("Unwanted blank spaces in twitter:card");
        }
      }
      if (meta["twitter:site"] && meta["twitter:site"].length !== 0) {
        if ((meta["twitter:site"]).trim() !== meta["twitter:site"]) {
          allErrors.push("Unwanted blank spaces in twitter:site");
        }
      }
      if (meta["twitter:title"] && meta["twitter:title"].length !== 0) {
        if ((meta["twitter:title"]).trim() !== meta["twitter:title"]) {
          allErrors.push("Unwanted blank spaces in twitter:title");
        }
      }
      if (
        meta["twitter:description"] && meta["twitter:description"].length !== 0
      ) {
        if (
          (meta["twitter:description"]).trim() !== meta["twitter:description"]
        ) {
          allErrors.push("Unwanted blank spaces in twitter:description");
        }
      }
      if (meta["twitter:image"] && meta["twitter:image"].length !== 0) {
        if ((meta["twitter:image"]).trim() !== meta["twitter:image"]) {
          allErrors.push("Unwanted blank spaces in twitter:image");
        }
      }
      if (allErrors.length > 0) {
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectWhiteSpacesInTitle(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0002"
        : "AEC-MGYP-CA-ST-SEO-0006",
      host: Deno.hostname(),
      status: "pass",
    });
    const exeTitleMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0007"
        : "AEC-MGYP-CA-ST-SEO-0025",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      exeTitleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const title = html.document("title").text();
      if (title && title.length !== 0) {
        if ((title).trim() !== title) {
          exeMetric.labels.object.status = "fail";
          exeMetric.labels.object.statusMessage =
            `Unwanted blank spaces in title tag`;
          exeMetric.labels.object.finalizeOn = new Date();
          metrics.record(exeMetric);
          return insp.inspectionIssue(
            html,
            `Unwanted blank spaces in title tag`,
          );
        }
      } else {
        exeTitleMetric.labels.object.status = "fail";
        exeTitleMetric.labels.object.statusMessage =
          `Title tag is empty for ${html.inspectionTarget.uri}`;
        exeTitleMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeTitleMetric);
      }
      exeMetric.labels.object.finalizeOn = new Date();
      exeTitleMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      metrics.record(exeTitleMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectDevelopmentInTitle(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeTitleMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0075",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeTitleMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const title = html.document("title").text();
      if (title.toUpperCase().includes("DEVELOPMENT")) {
        exeTitleMetric.labels.object.status = "fail";
        exeTitleMetric.labels.object.statusMessage =
          `Development keyword is found in title tag`;
        exeTitleMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeTitleMetric);
        return insp.inspectionIssue(
          html,
          `Development keyword is found in title tag`,
        );
      }
      exeTitleMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeTitleMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectLogoImageSchema(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0012",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if (
        html.inspectionTarget.htmlSource.indexOf('"@type": "Organization"') < 0
      ) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage =
          `No Logo Image schema available`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          "No Logo Image schema available",
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectSearchActionSchema(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0013",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if (
        html.inspectionTarget.htmlSource.indexOf(
          'itemtype="https://schema.org/SearchAction"',
        ) < 0
      ) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage =
          `No search action schema available`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          "No search action schema available",
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectBreadCrumbsSchema(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0014",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if ((html.inspectionTarget.uri).slice(0, -1) !== baseURL) {
        if (
          ((html.inspectionTarget.htmlSource).replaceAll(" ", "")).indexOf(
            'itemtype="https://schema.org/BreadcrumbList"',
          ) < 0
        ) {
          exeMetric.labels.object.status = "fail";
          exeMetric.labels.object.statusMessage =
            `No breadcrumb schema available`;
          exeMetric.labels.object.finalizeOn = new Date();
          metrics.record(exeMetric);
          return insp.inspectionIssue(
            html,
            "No breadcrumb schema available",
          );
        }
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export async function inspectMicrosoftClarityTracking(
  html: qh.HtmlSourceSupplier | insp.InspectionResult<qh.HtmlSourceSupplier>,
): Promise<
  | insp.InspectionResult<qh.HtmlSourceSupplier>
  | insp.InspectionIssue<qh.HtmlSourceSupplier>
> {
  if (qh.isQueryableHtmlContent(html)) {
    if (
      html.inspectionTarget.htmlSource.indexOf(
        'createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;',
      ) < 0
    ) {
      return insp.inspectionIssue(
        html,
        "No Microsoft Clarity Tracking script available",
      );
    }
    return html;
  } else {
    return insp.inspectionIssue(
      html,
      "SEO-friendly sites should have a queryable HTML content",
    );
  }
}

export function inspectMastHead(
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-FN-GN-0039",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      if (
        html.document(".page-name").text() == "" ||
        html.document(".page-name").text() == undefined
      ) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage = `Masthead missing`;
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          "Masthead missing",
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectImageSize(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const exeMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: siteID?.includes("medigyClaims")
        ? "AEC-MGYC-CA-ST-SEO-0005"
        : "AEC-MGYP-CA-ST-SEO-0011",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      exeMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const images = html.images();
      let targetURL = "";
      const allErrors: string[] = [];
      await Promise.all(
        images.map(async (imageElement, _index) => {
          const image = imageElement.src;

          if (image) {
            if (
              (image).indexOf("http://") === 0 ||
              (image).indexOf("https://") === 0
            ) {
              targetURL = image;
            } else {
              targetURL = `${baseURL}${image}`;
            }
            const result = await shc.traverse(
              {
                request: targetURL,
                options: shc.defaultTraverseOptions(),
              },
              shc.inspectHttpStatus,
            );
            if (shc.isSuccessfulTraversal(result)) {
              const contentSize = result.response.headers.get("content-length");
              if (Number(contentSize) > IMAGE_MAX_SIZE) {
                allErrors.push(
                  `The image "(${result.request})" size is greater than ${
                    IMAGE_MAX_SIZE /
                    1000
                  } KB`,
                );
              }
            }
          }
        }),
      );
      if (allErrors.length > 0) {
        exeMetric.labels.object.status = "fail";
        exeMetric.labels.object.statusMessage = allErrors.join("\n");
        exeMetric.labels.object.finalizeOn = new Date();
        metrics.record(exeMetric);
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      exeMetric.labels.object.finalizeOn = new Date();
      metrics.record(exeMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export function inspectCanonicalTags(
  baseURL: string,
  metrics: AssuranceCaseMetrics,
): qh.HtmlContentInspector {
  return async (
    html:
      | qh.HtmlSourceSupplier
      | insp.InspectionResult<qh.HtmlSourceSupplier>,
  ): Promise<
    | qh.HtmlSourceSupplier
    | insp.InspectionResult<qh.HtmlSourceSupplier>
    | insp.InspectionIssue<qh.HtmlSourceSupplier>
  > => {
    const allErrors: string[] = [];
    const canonicalMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0017",
      host: Deno.hostname(),
      status: "pass",
    });
    const canonicalSelfMetric = metrics.assuranceCaseExec.instance({
      initOn: new Date(),
      txId: metrics.metricsTransactionId,
      caseID: "AEC-MGYP-CA-ST-SEO-0018",
      host: Deno.hostname(),
      status: "pass",
    });
    if (qh.isQueryableHtmlContent(html)) {
      canonicalMetric.labels.object.pageURL = html.inspectionTarget.uri;
      canonicalSelfMetric.labels.object.pageURL = html.inspectionTarget.uri;
      const linkTags = html.document("link[rel='canonical']").get();
      if (linkTags.length < 1) {
        canonicalMetric.labels.object.status = "fail";
        canonicalMetric.labels.object.statusMessage =
          `Canonical tags not found`;
        allErrors.push(`Canonical tags not found`);
      } else {
        let canonicalURL = linkTags[0].attribs.href;
        canonicalURL = canonicalURL.replace(/\/$/, "");
        if (html.inspectionTarget.uri === baseURL) {
          if (canonicalURL !== baseURL) {
            canonicalSelfMetric.labels.object.status = "fail";
            canonicalSelfMetric.labels.object.statusMessage =
              `Canonical URL should be ${baseURL}`;
            allErrors.push(`Canonical URL should be ${baseURL}`);
          }
        } else {
          const result = await shc.traverse(
            {
              request: canonicalURL,
              options: shc.defaultTraverseOptions(),
            },
            shc.inspectHttpStatus,
          );
          if (shc.isInvalidHttpStatus(result)) {
            canonicalMetric.labels.object.status = "fail";
            canonicalMetric.labels.object.statusMessage =
              `Provided canonical URL is not found`;
            allErrors.push(`Provided canonical URL is not found`);
          }
        }
      }
      if (allErrors.length > 0) {
        canonicalMetric.labels.object.finalizeOn = new Date();
        canonicalSelfMetric.labels.object.finalizeOn = new Date();
        metrics.record(canonicalMetric);
        metrics.record(canonicalSelfMetric);
        return insp.inspectionIssue(
          html,
          allErrors.join("\n"),
        );
      }
      canonicalMetric.labels.object.finalizeOn = new Date();
      canonicalSelfMetric.labels.object.finalizeOn = new Date();
      metrics.record(canonicalMetric);
      metrics.record(canonicalSelfMetric);
      return html;
    } else {
      return insp.inspectionIssue(
        html,
        "SEO-friendly sites should have a queryable HTML content",
      );
    }
  };
}

export async function inspect404Status(
  URL: string,
  baseURL: string,
): Promise<boolean> {
  let targetURL = "";
  if (
    (URL).indexOf("http://") === 0 ||
    (URL).indexOf("https://") === 0
  ) {
    targetURL = URL;
  } else {
    targetURL = `${baseURL}${URL}`;
  }

  const result = await shc.traverse(
    {
      request: targetURL,
      options: shc.defaultTraverseOptions(),
    },
    shc.inspectHttpStatus,
  );
  return shc.isInvalidHttpStatus(result);
}
export function inspectIsFullURL(URL: string): boolean {
  let fullURL = false;
  if (
    (URL).indexOf("http://") === 0 ||
    (URL).indexOf("https://") === 0
  ) {
    fullURL = true;
  }
  return fullURL;
}

export class MedigyMain {
  constructor(
    readonly name: string,
    readonly baseURL: string,
    readonly googleTagManagerIdentity: string,
    readonly elasticSearchURL?: string,
    readonly dqaUrl?: string,
    readonly cqaUrl?: string,
  ) {
  }

  pageUrl(path: string, params?: urlcat.ParamMap): string {
    return urlcat.default(this.baseURL, path, { ...params });
  }
  siteTraverseOptions(
    metrics: AssuranceCaseMetrics,
    request: RequestInfo,
    override?: Partial<shc.TraverseOptions>,
  ): shc.TraverseOptions {
    return {
      riInspector: override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector: override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent: override?.htmlContent ||
        insp.inspectionPipe<
          qh.HtmlSourceSupplier,
          string,
          Error
        >(
          qh.inspectQueryableHtmlContent,
          qh.inspectCuratableContent,
          qh.inspectCurationTitle,
          qh.inspectTitleSEO,
          qh.inspectTwitterCardSEO,
          qh.inspectOpenGraphSEO,
          qh.googleTagManagerInspector(
            { gtmIdentity: this.googleTagManagerIdentity },
          ),
          inspectHomeContainsGoogleVer(this.baseURL, request, metrics),
          inspectUACodePresent(metrics),
          inspectOpenGraphHttpStatus(this.baseURL, metrics),
          inspectMetaDescription(metrics),
          inspectOgTags(metrics),
          inspectTwitterTags(this.baseURL, metrics),
          inspectResponsiveMetaTags,
          inspectImagesAlt(metrics),
          inspectDuplicateTitle(metrics),
          inspectDuplicateOgDescription(metrics),
          inspectDuplicateHead(metrics),
          inspectInvalidAnchors(this.baseURL, metrics),
          inspectBrokenImages(this.baseURL, metrics),
          inspectWhiteSpacesInOpenGraph(metrics),
          inspectWhiteSpacesInTitle(metrics),
          inspectDevelopmentInTitle(metrics),
          inspectImageSize(this.baseURL, metrics),
          inspectLogoImageSchema(metrics),
          inspectSearchActionSchema(metrics),
          inspectBreadCrumbsSchema(this.baseURL, metrics),
          inspectMastHead(metrics),
          inspectCanonicalTags(this.baseURL, metrics),
        ),
    };
  }
  siteTraverseOptionClaims(
    metrics: AssuranceCaseMetrics,
    override?: Partial<shc.TraverseOptions>,
  ): shc.TraverseOptions {
    return {
      riInspector: override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector: override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent: override?.htmlContent ||
        insp.inspectionPipe<
          qh.HtmlSourceSupplier,
          string,
          Error
        >(
          qh.inspectQueryableHtmlContent,
          qh.inspectCuratableContent,
          qh.inspectCurationTitle,
          qh.googleTagManagerInspector(
            { gtmIdentity: this.googleTagManagerIdentity },
          ),
          inspectResponsiveMetaTags,
          inspectImagesAlt(metrics),
          inspectDuplicateTitle(metrics),
          inspectDuplicateHead(metrics),
          inspectWhiteSpacesInTitle(metrics),
          inspectInvalidAnchors(this.baseURL, metrics),
          inspectBrokenImages(this.baseURL, metrics),
          inspectImageSize(this.baseURL, metrics),
          inspectMicrosoftClarityTracking,
        ),
    };
  }
  queryableHtmlContent(
    override?: Partial<shc.TraverseOptions>,
  ): shc.TraverseOptions {
    return {
      riInspector: override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector: override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent: override?.htmlContent ||
        insp.inspectionPipe<
          qh.HtmlSourceSupplier,
          string,
          Error
        >(
          qh.inspectQueryableHtmlContent,
        ),
    };
  }
  async inspectPage(
    request: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    let isMedigyPrime = true;
    if (siteID?.includes("medigyClaims")) {
      isMedigyPrime = false;
    }
    const result = await shc.traverse(
      {
        request: request,
        options: isMedigyPrime
          ? this.siteTraverseOptions(metrics, request)
          : this.siteTraverseOptionClaims(metrics),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      shc.inspectMetaRefreshRedirect,
      shc.maxPageLoadDurationInspector(4000),
      ...inspectors,
    );
    return result;
  }
  async getPageHTML(
    request: RequestInfo,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    const result = await shc.traverse(
      {
        request: request,
        options: this.queryableHtmlContent(),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      ...inspectors,
    );
    return result;
  }
}

export abstract class MedigySite extends MedigyMain implements Site {
  readonly rssFeedDefns: RssFeedDefns;
  readonly communityAccuracyPercentage;
  readonly institutionAccuracyPercentage;
  readonly eventsAccuracyPercentage;
  readonly topicAccuracyPercentage;
  readonly feedsAccuracyPercentage;
  readonly newsAccuracyPercentage;
  constructor(
    readonly name: string,
    readonly baseURL: string,
    readonly metrics: AssuranceCaseMetrics,
    readonly googleTagManagerIdentity: string,
    readonly elasticSearchURL?: string,
    readonly dqaUrl?: string,
    readonly cqaUrl?: string,
  ) {
    super(
      name,
      baseURL,
      googleTagManagerIdentity,
      elasticSearchURL,
      dqaUrl,
      cqaUrl,
    );
    this.eventsAccuracyPercentage = EVENT_COUNT_ACCURACY_PERCENTAGE;
    this.institutionAccuracyPercentage = INSTITUTION_COUNT_ACCURACY_PERCENTAGE;
    this.communityAccuracyPercentage = COMMUNITY_COUNT_ACCURACY_PERCENTAGE;
    this.topicAccuracyPercentage = TOPIC_COUNT_ACCURACY_PERCENTAGE;
    this.feedsAccuracyPercentage = FEED_COUNT_ACCURACY_PERCENTAGE;
    this.newsAccuracyPercentage = NEWS_COUNT_ACCURACY_PERCENTAGE;

    this.rssFeedDefns = {
      feeds: {
        feedURL: `${this.baseURL}/feed/latest/index.xml`,
        maxAgeInHours: 48,
        itemPathStartsWith: `${this.baseURL}/feed/latest/`,
        caseID: "AEC-MGYP-CA-CF-GN-0001",
      },
      news: {
        feedURL: `${this.baseURL}/news/index.xml`,
        maxAgeInHours: 48,
        itemPathStartsWith: `${this.baseURL}/news/`,
        caseID: "AEC-MGYP-CA-CF-GN-0019",
      },
      offerings: {
        feedURL: `${this.baseURL}/offering/index.xml`,
        maxAgeInHours: 96,
        itemPathStartsWith: `${this.baseURL}/offering/`,
        caseID: "AEC-MGYP-CA-CF-GN-0022",
      },
      events: {
        feedURL: `${this.baseURL}/events/index.xml`,
        maxAgeInHours: 48,
        itemPathStartsWith: `${this.baseURL}/event/`,
      },
    };
  }
  inspectRobotSiteMap(
    metrics: AssuranceCaseMetrics,
    override?: Partial<shc.TraverseOptions>,
  ): shc.TraverseOptions {
    return {
      riInspector: override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector: override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent: override?.htmlContent ||
        insp.inspectionPipe<
          qh.HtmlSourceSupplier,
          string,
          Error
        >(
          qh.inspectQueryableHtmlContent,
          inspectRobotsFile(this.baseURL, true, metrics),
          inspectSitemapFile(this.baseURL, true, metrics),
        ),
    };
  }
  async inspectRssFeed(
    name: string,
    defn: RssFeedDefn,
    ...inspectors: insp.Inspector<RssFeed>[]
  ): Promise<string[] | undefined> {
    const result = await shc.traverse(
      {
        request: defn.feedURL,
        options: shc.defaultTraverseOptions(),
      },
      shc.inspectHttpStatus,
      shc.rssContentInspector(),
    );
    if (shc.isTraversalRssContent(result)) {
      const pipe = insp.inspectionPipeIssuesDiagnostics<RssFeed>(
        ...inspectors,
      );
      return await pipe({ defn: defn, feed: result.feed });
    }
    return undefined;
  }
  async inspectRobotFiles(
    request: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    const result = await shc.traverse(
      {
        request: request,
        options: this.inspectRobotSiteMap(metrics),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      ...inspectors,
    );
    return result;
  }
}

export abstract class MedigyClaimSite extends MedigyMain implements ClaimSite {
  constructor(
    readonly name: string,
    readonly baseURL: string,
    readonly metrics: AssuranceCaseMetrics,
    readonly googleTagManagerIdentity: string,
    readonly elasticSearchURL?: string,
  ) {
    super(name, baseURL, googleTagManagerIdentity, elasticSearchURL);
  }
  inspectRobotSiteMap(
    metrics: AssuranceCaseMetrics,
    override?: Partial<shc.TraverseOptions>,
  ): shc.TraverseOptions {
    return {
      riInspector: override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector: override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent: override?.htmlContent ||
        insp.inspectionPipe<
          qh.HtmlSourceSupplier,
          string,
          Error
        >(
          qh.inspectQueryableHtmlContent,
          inspectRobotsFile(this.baseURL, false, metrics),
          inspectSitemapFile(this.baseURL, false, metrics),
        ),
    };
  }
  async inspectRobotFiles(
    request: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    const result = await shc.traverse(
      {
        request: request,
        options: this.inspectRobotSiteMap(metrics),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      ...inspectors,
    );
    return result;
  }
}

export abstract class MedigyDQASite implements MedigyDQA {
  readonly offeringAccuracyPercentage: number;
  constructor(
    readonly name: string,
    readonly baseURL: string,
    readonly elasticSearchURL: string,
    readonly gitLabURL: string,
  ) {
    this.offeringAccuracyPercentage = OFFERING_ACCURACY_PERCENTAGE_DQA;
  }
}
export abstract class MedigyCQASite implements MedigyCQA {
  readonly offeringAccuracyPercentage: number;
  constructor(
    readonly name: string,
    readonly baseURL: string,
  ) {
    this.offeringAccuracyPercentage = OFFERING_ACCURACY_PERCENTAGE_DQA;
  }
}

export abstract class DemoGoogleSite implements DemoQA {
  readonly offeringAccuracyPercentage: number;
  constructor(
    readonly name: string,
    readonly baseURL: string,
  ) {
    this.offeringAccuracyPercentage = OFFERING_ACCURACY_PERCENTAGE_DQA;
  }
}

const metrics = new AssuranceCaseMetrics(
  "nets_medigy_dpo_",
);
const claimMetrics = new AssuranceCaseMetrics(
  "nets_medigy_claims_dpo_",
);
export class MedigyProductionSite extends MedigySite {
  constructor() {
    super(
      "Production",
      "https://www.medigy.com",
      metrics,
      "GTM-MRP79T4",
      "https://prod-es.medigy.com",
      "https://next-dqa.bzo.medigy.com",
    );
  }
}

export class MedigyDevelopmentSite extends MedigySite {
  constructor() {
    super(
      "Development",
      "https://google.com",
      metrics,
      "GTM-NKV2ZC8",
      "https://prod-es.medigy.com",
    );
  }
}

export class MedigyLocalhost extends MedigySite {
  constructor() {
    super(
      "Localhost",
      "http://localhost:3100",
      metrics,
      "GTM-K87TBMG",
      "https://prod-es.medigy.com",
    );
  }
}

export class Medigy2021Development extends MedigySite {
  constructor() {
    super(
      "2022 Publication",
      "https://devl.medigy.com",
      metrics,
      "GTM-N4V4MTB",
      "https://prod-es.medigy.com",
      "https://next-dqa.bzo.medigy.com",
      "https://next-cqa.bzo.medigy.com",
    );
  }
}

export class MedigyIAMDevelopment extends MedigySite {
  constructor() {
    super(
      "IAM Publication",
      "https://devl-next-iam.medigy.com/",
      metrics,
      "GTM-N4V4MTB",
      "https://devl-next-iam.medigy.com/",
    );
  }
}
export class MedigyClaimsProduction extends MedigyClaimSite {
  constructor() {
    super(
      "Production",
      "https://claim.landing.medigy.com",
      claimMetrics,
      "GTM-PCNKCPJ",
      "https://prod-es.medigy.com",
    );
  }
}
export class MedigyClaimsLocalHost extends MedigyClaimSite {
  constructor() {
    super(
      "LocalHost",
      "http://localhost:3100",
      claimMetrics,
      "GTM-PCNKCPJ",
      "https://prod-es.medigy.com",
    );
  }
}
export class MedigyDQAProductionSite extends MedigyDQASite {
  constructor() {
    super(
      "Production",
      "https://dqa.bzo.medigy.com",
      "https://prod-es.medigy.com",
      "https://gl.infra.medigy.com",
    );
  }
}
export class MedigyCQAProductionSite extends MedigyCQASite {
  constructor() {
    super(
      "Production",
      "https://cqa.bzo.medigy.com",
    );
  }
}

export class DemoTestSite extends DemoGoogleSite {
  constructor() {
    super(
      "Demotest",
      "https://google.com",
    );
  }
}

export const medigyProd = new MedigyProductionSite();
export const medigyDevl = new MedigyDevelopmentSite();
export const medigyLocalhost = new MedigyLocalhost();
export const medigy2021Development = new Medigy2021Development();
export const medigyIAMDevelopment = new MedigyIAMDevelopment();
export const medigyClaimsProduction = new MedigyClaimsProduction();
export const medigyClaimsLocalHost = new MedigyClaimsLocalHost();
export const medigyDQAProductionHost = new MedigyDQAProductionSite();
export const medigyCQAProductionHost = new MedigyCQAProductionSite();
export const demoTest = new DemoTestSite();

export const sitesToInspect: Site[] = [];
export const claimsToInspect: ClaimSite[] = [];
export const dqaToInspect: MedigyDQASite[] = [];
export const cqaToInspect: MedigyCQASite[] = [];
export const dmoToInspect: DemoGoogleSite[] = [];

if (siteID) {
  switch (siteID) {
    case "local":
      sitesToInspect.push(medigyLocalhost);
      break;
    case "development":
      sitesToInspect.push(medigyDevl);
      break;
    case "production":
      sitesToInspect.push(medigyProd);
      break;
    case "development2022":
      sitesToInspect.push(medigy2021Development);
      break;
    case "medigyClaims":
      claimsToInspect.push(medigyClaimsProduction);
      break;
    case "medigyClaimsLocal":
      claimsToInspect.push(medigyClaimsLocalHost);
      break;
    case "medigyDQAProduction":
      dqaToInspect.push(medigyDQAProductionHost);
      break;
    case "medigyCQAProduction":
      cqaToInspect.push(medigyCQAProductionHost);
      break;
    case "medigyIAM":
      sitesToInspect.push(medigyIAMDevelopment);
      break;
    case "demoGoogleTest":
      dmoToInspect.push(demoTest);
  }
} else {
  //sitesToInspect.push(medigyProd);
  sitesToInspect.push(medigyDevl);
}
