//const index = 1;
export class AwardsSelectors {
  public static firstAward = ".slds-welcome-mat__tile";
  public static Award2021 =
    "li:nth-child(1) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > h2 > a";
  public static secondAward =
    "li:nth-child(2) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > h2 > a";
  public static fifthAward =
    "li:nth-child(5) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > h2 > a";
  // public static awardElement =
  //`li:nth-child(${index}) > article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_9-of-12 > h2 > a` ;
  public static elementExist =
    ".div.slds-gridslds-wrap.slds-gutters > div.slds-m-top_small > img";
  public static elementExistNew = "#featuredAwardImage > img";
}
