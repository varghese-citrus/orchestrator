export class DailyBriefSelectors {
  public static dailyBriefList = "a.gtm-tab";
  public static dailBriefmenu = ".slds-tabs_default > .slds-tabs_default__nav > .slds-tabs_default__item > #daily-brief-top-menu > b";
  public static discoveryTab = "#discovered-tab";
  public static trendingTab = "#trending-tab";
  public static recentlyUpdatedTab = "#recently-updated-tab";
  public static secondDailybrief =
    ".slds-welcome-mat__tile:nth-child(2) > .slds-box > .slds-grid > .slds-col > .slds-text-heading_medium > .gtm-tab > b";
public static publishDate = ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-text-body_small > .viewUser";
public static lastUpdatedDate = ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .viewUser";
public static firstDailyBrief =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-text-heading_medium > .gtm-tab > b";
  public static firstDboSection =
    ".slds-container_x-large > .slds-welcome-mat > .slds-size_1-of-1 > .slds-welcome-mat__tile:nth-child(1) > .slds-box";
  public static dboSectionList =
    "div > div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium > ul > li";
  public static thirddailyBrief =
    ".slds-container_x-large > .slds-welcome-mat > .slds-size_1-of-1 > .slds-welcome-mat__tile:nth-child(3) > .slds-box";
  public static dboInnerHeading =
    "div.slds-grid.slds-wrap.slds-gutters.slds-p-top_large.slds-p-bottom_large > div:nth-child(1) > div > div > a";
  public static dailyBriefImg =
    ".slds-grid > .slds-col > a > .slds-text-heading_small > b";
  public static detailHeading =
    ".slds-col > .slds-grid > .slds-col > .slds-text-heading_medium > b";
  public static breadcrumb =
    "body > div:nth-child(7) > div > section > div > nav > ol > li > a > span";
  public static breadcrumbLastItem =
    "body > div:nth-child(7) > div > section > div > nav > ol > li.slds-breadcrumb__item.slds-p-left_x-small";
  public static editBtn = "div.slds-clearfix.slds-m-top_small > div > button";
  public static linkedin = "#linkedin";
  public static upvote =
    "div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium > ul> li:nth-child(1) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > div > div:nth-child(2) > div > div > button";
  public static upvotePopup =
    "div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium > ul > li:nth-child(1) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > div > div:nth-child(2) > div > div > button";
  //offering Invite
  public static inviteToMedigyTitle = "#modal-heading-offering-invite";
  public static offeringInvite = "#offeringInvite";
  public static inviteFirstName = "#inviteFirstName";
  public static inviteLastName = "#inviteLastName";
  public static inviteEmail = "#inviteEmail";
  public static inviteBtn = "#inviteButton";
  public static inviteCloseBtn = "#inviteButton-close";

  //Latest
  public static dboLatest = "#latest-tab";
  public static firstLatestDbo =
    "div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium > ul > li > article > div";
  public static dboTopicHeading =
    "div.slds-grid.slds-wrap.slds-gutters.slds-p-top_medium.slds-p-bottom_medium > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_8-of-12.inner-section > h2 > b";
  //CADD SECTION
  public static question1 =
    "#accordionid21 > .slds-accordion__section > .slds-accordion__summary > .slds-accordion__summary-heading > .slds-button > .ico-bt-sm-2";
  public static yesBtn =
    ".slds-form-element__control > .slds-radio_button-group > .slds-button > #radio-Yes_offering_used-label-offering_used > .slds-radio_faux";
  public static noBtn =
    ".slds-form-element__control > .slds-radio_button-group > .slds-button > #radio-No_offering_used-label-offering_used > .slds-radio_faux";
  public static question2 = "#offeringQuestionoffering_pros_and_cons";
  public static quesLikeMost = "#prosTitle";
  public static prosAddNewBtn = "#prosButton";
  public static quesLikeLeast = "#consTitle";
  public static consAddNewBtn = "#consButton";
  public static question3 = "#offeringQuestionknow_alternative";
  public static pleaseSelectDropdown =
    "#suggest-offering-list-know_alternative";
  public static submitBtn = "#submit_btn_know_alternative";
  public static addOthersTitle = "#alternateTitleTextNameknow_alternative";
  public static addOtherSubmit = "#submit_btn_others_know_alternative";
  public static question4 = "#offeringQuestiontried_alternative";
  public static ques4PleaseSelect = "#suggest-offering-list-tried_alternative";
  public static ques4SubmitBtn = "#submit_btn_tried_alternative";
  public static ques4AddOthers = "#alternateTitleTextNametried_alternative";
  public static ques4AddOthersSubmitBtn =
    "#submit_btn_others_tried_alternative";
  public static seeTopics =
    "div.slds-m-bottom_large.slds-m-top_small.slds-box > h2 > b";
  public static question5 =
    "#accordionid25 > section > div.slds-accordion__summary > h2 > button > img";
  //"#accordionid26 > .slds-accordion__section > .slds-accordion__summary > .slds-accordion__summary-heading > .slds-button > .ico-bt-sm-2";
  public static offeringDidnotChoose =
    "#nameTextMigrationoffering-share-chose-decision";
  public static ques5SubmitBtn = "#btn_offering-share-chose-decision";
  public static question6 =
    "#accordionid26 > section > div.slds-accordion__summary > h2 > button > img";
  public static fromThisTool =
    "#nameTextMigrationoffering-share-migration-decision";
  public static ques6SubmitBtn = "#btn_offering-share-migration-decision";
  public static question8 =
    "#offeringQuestiononline-offline-other-lead-sources";
  public static others = "#othersSource";
  public static ques8SubmitBtn = "#sourceButtonothers";
  public static question9 = "#offeringQuestionoffering_confirmed_devices";
  public static asideList = "#list_terms > aside";
  public static asideDivList =
    "div > div.slds-col.slds-size_3-of-12.slds-small-size_4-of-12.slds-medium-size_4-of-12.slds-large-size_3-of-12 > div";
  public static videoPlay = "#ytplayer-1";
  //bridge-patient-engagement-suite organic content
  public static caseStudies =
    ".doc-box > .slds-col > .resource-accordion > .font-size-11 > b";

  //provizion-application-suite
  public static resource1 =
    ".slds-m-top_medium > .slds-grid > .slds-col:nth-child(1) > a";
  public static resource2 =
    ".slds-col > .file-to-download > .doc-box > .slds-col > .doc-ico-op";
  public static resource3 =
    ".slds-col > .doc-box > .slds-col > .resource-accordion > .doc-ico-op";
  public static resource3Link1 =
    ".doc-box > .slds-col > #resource-accordion3 > li:nth-child(1) > a";
  public static resource3Link2 =
    ".doc-box > .slds-col > #resource-accordion3 > li:nth-child(2) > a";
}
