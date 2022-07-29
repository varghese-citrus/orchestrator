export class EvaluationFacetsSelectors {
  public static evalBreadcrumb =
    "div > section > div > nav > ol > li:nth-child(4)";
  public static evalSections =
    "#tab-default-1 > div > section > div > div:nth-child(5) > h2 > b";

  //Ethics and Compliance
  public static ethicsLink =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(2) > li > a";
  public static ethicsLinkHeading = "#label-";

  //Expectations
  public static expectLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(4) > li > a";
  public static expectLinkHeading = "#label-Q-Title";

  //General
  public static generalLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(6) > li > a";
  //public static generalLinkslist =
  //`#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(6) > li:nth-child(${index}) > a`;
  public static generalLinkHeading = "#label-";

  //Information Assurance
  public static infoLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(8) > li > a";
  public static InfoheadingExists1 = "#label-Q-001";
  public static InfoheadingExists2 = "#label-Q";
  //public static infoLinkslist =
  //`#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(8) > li:nth-child(${index}) > a`;
  public static infoLinkHeading = "#label-Q-Title";

  //Interoperability
  public static interLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(10) > li > a";
  public static interHeadingExists = "#label-";
  //Product
  public static productLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(12) > li > a";
  public static prodLinkHeading = "#label-";

  //Quality
  public static qualityLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(14) > li > a";
  public static qualityLinkHeading = "#label-";

  //Security
  public static securitylinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(16) > li > a";

  public static securityLinkHeading = "#label-";

  //User Experience
  public static userLinks =
    "#tab-default-1 > div > section > div > div:nth-child(5) > ul:nth-child(18) > li > a";
  public static userLinkHeading = "#label-";
}
