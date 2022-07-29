export class LoginSelectors {
  public static login =
    ".slds-grid > .slds-col:nth-child(3) > .slds-button-group-row > .slds-button-group-item > .slds-button";
  public static username = "#username";
  public static password = "#password";
  public static loginBtn = "#loginButton";
  public static profileHeader = "#header-profile-name";
  public static loginCloseBtn = "#login-popup-modal > div > header > button";
  public static loginPopup = "#modal-content-id-3";
  public static loginInterstitial =
    ".slds-col > #loginform > .slds-text-body_small > .slds-notify > h2";
  public static invalidLoginMsg =
    ".slds-col > #loginform > .slds-text-body_small > .slds-notify_container > .slds-notify";
  public static resetPwdPopup = "#modal-user-profile-content-forgot";
  public static resetPwdEmail = "#userEmailReset";
  public static resetPwdSummit = "#passwordButton";
  public static resetPwdSuccessMessage = "#passwordMessage";
}
