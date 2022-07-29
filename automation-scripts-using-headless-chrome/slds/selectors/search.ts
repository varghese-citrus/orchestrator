export class SearchSelectors {
  public static searchResults = "#summary-0";
  public static readMore = "#summary-0 > div > p:nth-child(5) > a";
  public static readmoreNull = "#summary-0 > div > p:nth-child(4) > a";
  public static searchItemTitle = "#summary-0 > div > h2 > a > b";
  public static searchItemDesc = "#summary-0 > div > p:nth-child(2)";
  public static searchItemBreadcrumb = "#summary-0 > div > p:nth-child(4) > b";
  public static searchItemBreadcrumbText =
    "#summary-0 > div > p:nth-child(4) > span";
  public static searchItemTopic =
    "span.slds-badge.slds-m-left_x-small.slds-m-bottom_x-small > a";
  public static searchCommunitiesSel =
    ".slds-container_x-large > .slds-welcome-mat > .slds-grid > .slds-col";
  public static news1 =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-text-heading_medium > a > b";
  public static offering1 =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-text-heading_medium > a > b";
  public static events1 =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-grid > .slds-col > .slds-text-heading_medium > a > b";
}
