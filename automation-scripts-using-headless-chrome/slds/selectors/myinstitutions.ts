export class MyinstitutionsSelectors {
  public static myinstLinks =
    ".slds-container_x-large > .slds-welcome-mat > #myInstitutionList > .slds-welcome-mat__tile > .slds-box";
  public static firstMyinstitution =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-text-heading_medium > a > b";
  public static firstMyinstitutionbox =
    ".slds-container_x-large > .slds-welcome-mat > #myInstitutionList > .slds-welcome-mat__tile:nth-child(1) > .slds-box";

  public static myinstitutionlist =
    "#myInstitutionList > li:nth-child(1) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > h2 > a > b";
  public static myinstInnerHeading =
    ".slds-col > .slds-grid > .slds-col > .slds-text-heading_medium > b";
  public static myinstBreadcrumb =
    ".breadcrumbs-wrap > .slds-container_x-large > .slds-p-vertical_x-small > .slds-breadcrumb > .slds-p-left_x-small";
  public static myinstBadge =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-clearfix > .slds-float_right > span > img";
  public static addAnother =
    ".slds-clearfix > .slds-float_right > p > a > .slds-button";
  public static verifiedInst =
    "div > section > div > nav > ol > li.slds-breadcrumb__item.slds-p-left_x-small";
  public static unverifiedInst =
    "div > section > div > nav > ol > li.slds-breadcrumb__item.slds-p-left_x-small";
  //search institutions
  public static addYourInst =
    ".slds-p-left_large > .slds-form-element > .slds-form-element__control > .slds-text-heading_medium > a";
  public static instSearch = "#tenantSearchKey";
  //Institutional Profile
  public static termsandCond = "#termsAndConditions";
  public static editBtn =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-button > .slds-button";
  public static companyName = "#companyName";
}
