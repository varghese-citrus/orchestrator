export class CommunitiesSelectors {
  public static commBreadCrumbs =
    "div > div > .breadcrumbs-wrap > .slds-container_x-large > .slds-p-vertical_x-small";
  public static breadcrumbItems = "div > section > div > nav > ol > li";
  public static parentLinkText =
    ".slds-p-vertical_x-small > .slds-breadcrumb > .slds-breadcrumb__item > a > span";
  public static breadcrumbNextItem =
    "div > section > div > nav > ol > li.slds-breadcrumb__item.slds-p-left_x-small";
  public static commSection =
    ".slds-col.slds-size_1-of-1.slds-medium-size_6-of-12.slds-large-size_6-of-12";
  public static offerings =
    ".slds-container_x-large > .slds-welcome-mat > .slds-grid > .slds-col > .slds-card";

  public static relatedOfferingLink =
    "body > section:nth-child(8) > div > div > div > div:nth-child(3) > article > div > div.slds-m-top_small > article > ul > li:nth-child(1) > a";
  public static relatedOfferingTooltipText =
    "body > section:nth-child(8) > div > div > div > div:nth-child(3) > article > div > div.slds-m-top_small > article > ul > li:nth-child(1) > div > div";
  public static boldHeading =
    ".slds-grid > .slds-media__body > h1 > .slds-text-heading_large > b";
  public static commArtTitle =
    ".news-content-overlap > .slds-clearfix > .slds-float_left > .slds-text-heading_medium > b";
  public static comArt1 =
    ".slds-card:nth-child(1) > .slds-card__body > .slds-grid > .slds-col > .mg-bottom-border:nth-child(1) > .slds-grid > .slds-col > .slds-show > .dark-link";
  public static comNextArtImg =
    ".slds-box > .slds-grid > .slds-col > a > .product-thumb";
  public static comNextArtImgLink =
    ".slds-container_large > article > .slds-grid > .slds-col > .post-figure";
  public static commArtTopic =
    ".slds-clearfix > .slds-float_left > .slds-text-body_small > a:nth-child(1) > .slds-badge";
  public static comNextArtTit =
    ".slds-grid > .slds-col > .slds-text-heading_medium > a > b";
  public static comNextArtDes =
    ".slds-welcome-mat__tile > .slds-box > .slds-grid > .slds-col > .slds-text-body_medium";
  public static comArtCount =
    ".slds-card:nth-child(1) > .slds-card__body > .slds-grid > .slds-col > .slds-grid >.slds-col";
  public static comArtPrev =
    ".slds-container_x-large > .slds-clearfix > .slds-float_left > .link-no-underline > .slds-button";
  public static comArtNext =
    ".slds-container_x-large > .slds-clearfix > .slds-float_right > .link-no-underline > .slds-button";
  public static comSubcat1 =
    ".slds-col > .slds-card:nth-child(1) > .slds-text-heading_medium > .black-link > .slds-m-top_x-small";
  public static comReadMore1 =
    ".slds-welcome-mat > .slds-grid > .slds-col > .slds-card:nth-child(1) > .slds-card__footer";
  public static comAllArticles =
    ".slds-card:nth-child(1) > .slds-card__body > .slds-grid > .slds-col > .mg-bottom-border > .slds-grid";
  public static comSubCatSec =
    ".slds-container_x-large > .slds-welcome-mat > .slds-grid > .slds-col:nth-child(1) > .slds-card";
  public static comSubCatArt =
    "section > .slds-container_x-large > .slds-welcome-mat > .slds-grid > .slds-col";
  //----------------------------------------------------------------------------------------------------------------
  //Covid 19 Pandemic
  public static c19 =
    ".slds-grid > .slds-col > .slds-card__header-title > #covid-19-pandemic > span";
  public static curatedNews =
    ".slds-col:nth-child(4) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(1) > a";
  public static curatedVideos =
    ".slds-col:nth-child(4) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(5) > a";
  public static videoSection =
    "body > section:nth-child(8) > div > div > div > div> article > div > div";
  public static videoElement = "#ytplayer";
  public static subcatC19 =
    ".slds-col:nth-child(4) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge";
  public static subcatBreadcrumb =
    ".breadcrumbs-wrap > .slds-container_x-large > .slds-p-vertical_x-small > .slds-breadcrumb > .slds-p-left_x-small";
  public static curatedoffering =
    ".slds-col:nth-child(4) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(3) > a";
  public static pandemicFirstArticle =
    "body > section:nth-child(8) > div > div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium.community-section > div > div > article:nth-child(1) > div > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_8-of-12.slds-m-top_xx-small > div > aside:nth-child(1) > div > div.slds-col.slds-size_9-of-12.slds-medium-size_9-of-12.slds-large-size_10-of-12.slds-m-top_xx-small > span > a";
  public static pandemicArticleHeading =
    "body > section:nth-child(7) > div > div.slds-p-top_medium.slds-p-bottom_small > h1 > b";
  public static pandemicJoinBtn = "#pandemic-join-btn";

  //----------------------------------------------------------------------------------------------------------------------
  //Chronic Care Management
  public static ccm = "#gtm-chronic-care-management";
  public static ccmBusiness = "#ccm-business-survival-continuity";
  public static addsuggestform =
    ".slds-col > .slds-card > .slds-m-bottom_xx-small > #ccm-postform > .slds-button";
  public static ccmarticle =
    ".slds-card:nth-child(1) > .slds-card__body > .slds-grid > .slds-col > .mg-bottom-border:nth-child(2) > .slds-grid > .slds-col > .slds-show > .dark-link";
  public static ccmcopJoinBtn = "#ccmcop-join-btn";
  public static relatedOffering =
    ".news-content-overlap > .slds-grid > .related-offerings-ccm > .slds-text-heading_small > b";
  public static offeringLinks =
    ".slds-col > .slds-list_dotted > .dark-link> .dark-link > .special-text";
  public static offeringHeading =
    "div.slds-grid.slds-wrap.slds-gutters.slds-p-top_large.slds-p-bottom_large > div:nth-child(1) > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > h3 > b";
  public static likeBtn = "#spanId > img";
  public static ccmSubcat =
    ".slds-col:nth-child(1) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(1) > a";
  public static ccmSubcats =
    ".slds-col:nth-child(1) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge";
  public static relatedOfferingTitle =
    ".slds-grid > .slds-col > .slds-card:nth-child(1) > .slds-text-heading_medium > .slds-m-top_x-small";
  public static offeringsHeading =
    ".slds-col > .slds-grid > .slds-col > .slds-text-heading_medium > b";
  public static relatedOfferingLinks =
    ".mg-bottom-border > .dark-link > .slds-grid > .slds-col > .slds-show";
  public static ccmComm =
    ".slds-col:nth-child(2) > .slds-card > .slds-card__body > .slds-grid > .slds-col > .slds-card__header-title > a";

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //FemTech
  public static commArticle1 =
    ".slds-card:nth-child(1) > .slds-card__body:nth-child(2) > .slds-grid:nth-child(1) > .slds-col:nth-child(2) > .slds-grid:nth-child(1) > .thumb-card-border:nth-child(1) > .slds-grid:nth-child(1) > .slds-col:nth-child(2) > .slds-show:nth-child(1) > .dark-link:nth-child(1)";
  public static articleHeading =
    "section > .slds-container_x-large > .slds-p-top_medium > .slds-text-heading_medium > b";
  public static articleImage =
    "section > .slds-container_x-large > .slds-m-bottom_large > .slds-text-align_center > img";
  public static femtechSubcat =
    ".slds-col:nth-child(3) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(1) > a";
  public static femtechSubcatList =
    ".slds-col:nth-child(3) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge";

  public static femtechHeadingBold =
    ".slds-grid > .slds-media__body > h1 > .slds-text-heading_large > b";
  public static femtechBreadcrumb =
    ".breadcrumbs-wrap > .slds-container_x-large > .slds-p-vertical_x-small > .slds-breadcrumb > .slds-p-left_x-small";
  public static femtechJoinBtn = "#femtech-join-btn";
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------
  //ILCOP
  public static ilcopTitle =
    ".slds-grid > .slds-col > .slds-card__header-title > #innovation-lifecycle > span";
  public static ilcopBanner =
    "body > section > .slds-container_x-large > .slds-card > .slds-grid";
  public static ilcopBannerText =
    ".slds-grid > .slds-media__body > h1 > .slds-text-heading_large > b";
  public static ilcopJoinBtn = "#ilcop-join-btn";
  public static ilcopDesc =
    "section > .slds-container_x-large > .slds-card > .slds-card__body > p";
  public static ilcopSubCatList =
    ".slds-col:nth-child(2) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge > a";
  public static ilcopTopicSection =
    "body > section:nth-child(8) > div > div > div > div.slds-col.slds-size_1-of-1.slds-small-size_8-of-12.slds-large-size_8-of-12.slds-m-bottom_small > article> h2 > a > span";
  public static ilcopTopic =
    ".slds-grid > .slds-media__body > h1 > .slds-text-heading_large > b";
  public static ilcopTopicsLink =
    "div.slds-grid.slds-wrap.slds-gutters.slds-p-bottom_large > div:nth-child(2) > div > ul > li";
  public static isTopicLinks =
    "div.slds-grid.slds-wrap.slds-gutters.slds-p-bottom_large > div:nth-child(2) > div > ul > li > a";
  public static ilcopCurated =
    ".slds-card:nth-child(1) > .slds-card__body > .slds-grid > .slds-col > .mg-bottom-border:nth-child(2) > .slds-grid > .slds-col > .slds-show > .dark-link";
  public static ilcopComm =
    ".slds-col:nth-child(1) > .slds-card > .slds-card__body > .slds-grid > .slds-col > .slds-card__header-title > a";
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //HaH
  public static SubcatartImg =
    ".slds-card:nth-child(1) > .slds-card__body:nth-child(2) > .slds-grid:nth-child(1) > .slds-col:nth-child(2) > .slds-grid:nth-child(1) > .thumb-card-border:nth-child(1) > .slds-grid:nth-child(1) > .slds-col:nth-child(1) > a:nth-child(1) > .img-thumb-2:nth-child(1)";
  public static hahComm =
    ".slds-col:nth-child(3) > .slds-card > .slds-card__body > .slds-grid > .slds-col > .slds-card__header-title > a";
  public static hahSubcat =
    ".slds-col:nth-child(3) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(1) > a";
  public static hahSubcats =
    ".slds-col:nth-child(3) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge";
  public static hahJoinBtn = "#hahcop-join-btn";
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Risk and Compliance
  public static riskandCompliance = "#gtm-risk-and-compliance";
  public static randcJoinBtn = "#risk-comp-join-btn";
  public static randcHeader = "span.slds-text-heading_large.white-txt";
  public static randcSubcat =
    ".slds-col:nth-child(6) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(1) > a";
  public static randcSubcatList =
    ".slds-col:nth-child(6) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge";
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Security
  public static securityComm = "#gtm-security";
  public static securityJoinBtn = "#security-join-btn";
  public static securityHeader = "span.slds-text-heading_large.white-txt";
  public static secCuratedContent =
    ".slds-col:nth-child(5) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge:nth-child(1) > a";
  public static secSubcats =
    ".slds-col:nth-child(5) > .slds-card > .slds-card__body > .slds-m-top_small > .slds-badge";
  public static secCuratedContentReadmore =
    "#security-read-more-curated-content";
  public static htmltags =
    "div > article > div > div > div.slds-col.slds-size_1-of-1.slds-small-size_9-of-12.slds-large-size_9-of-12.slds-order_1.slds-small-order_2.slds-m-top_x-small > ul > li > a";
  public static secImg =
    "div > article > div > div > div.slds-col.slds-size_1-of-1.slds-small-size_3-of-12.slds-large-size_3-of-12.slds-order_2.slds-small-order_1.slds-m-top_x-small > a";
  public static comSub =
    ".slds-grid > .slds-media__body > h1 > .slds-text-heading_large > b";
}
