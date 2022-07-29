export class EventsSelectors {
  public static upcomingEvents = "#upcoming-event-tab";
  public static pastEvents = "#past-event-tab";
  public static canceledEvents = "#canceled-event-tab";
  public static eventLinks =
    "div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium.event-section > ul > li > article";
  public static firstEvent =
    ".slds-container_x-large > .slds-welcome-mat > .slds-size_1-of-1 > .slds-welcome-mat__tile:nth-child(1) > .slds-box";
  public static nextEventLinks =
    "div > div.slds-col.slds-size_1-of-1.slds-medium-size_8-of-12.slds-large-size_10-of-12 > h2 > a";
  public static eventsList =
    "body > section:nth-child(8) > div > div.slds-welcome-mat.slds-m-bottom_medium.slds-m-top_medium.event-section > ul > li";
  public static eventsHeading =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-grid > .slds-col > .slds-text-heading_medium > a";
  public static readorMore = "div.news-content-overlap";
  public static liveExists =
    ".slds-welcome-mat__tile:nth-child(1) > .slds-box > .slds-grid > .slds-col > .slds-grid > .slds-col > .slds-text-body_medium > .event-date > .slds-badge";
  public static addCalendar = "#Add_Calendar";
  public static calendarElement =
    "div > div.slds-grid.slds-wrap.slds-gutters.slds-p-bottom_large > div:nth-child(2) > div > article:nth-child(2) > div > div > div > div.slds-col.slds-size_3-of-12.slds-medium-size_2-of-12.slds-large-size_2-of-12 > article";
  public static calendarDesc =
    "div.slds-grid.slds-wrap.slds-gutters.slds-p-bottom_large > div:nth-child(2) > div > p:nth-child(5)";
  public static detailEventsImg =
    "section > .slds-container_large > .slds-grid > .slds-col > .post-figure";
  public static eventsImg =
    " article > div > div.slds-col.slds-size_1-of-1.slds-medium-size_4-of-12.slds-large-size_3-of-12 > a > img";
  public static interestedinthisEvent = "#interested-in-tab-content > h2 > b";
  //CADD
  public static caddSection = "#interested-in-tab-content > aside:nth-child(2)";
  public static yesButton =
    "#interested-in-tab-content > aside:nth-child(2) >div:nth-child(2)>button:nth-child(1)";
  public static noButton =
    "#interested-in-tab-content > aside:nth-child(2) >div:nth-child(2)>button:nth-child(2)";
  public static voteCount = "#attend_infuture-total-count";
  public static attendedYesCount = "#attend_infuture-yes-count";
  public static attendedNoCount = "#attend_infuture-no-count";
  public static yesCountPercent = "#attend_infuture-yes-count-percent";
  public static noCountPercent = "#attend_infuture-no-count-percent";
  public static myInterest = "#my-interests";
  public static noOfEvents =
    "body > section > .slds-container_x-large > .custom-pagination-block > .slds-m-right_small";
}
