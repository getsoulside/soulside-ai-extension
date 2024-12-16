const manifest = chrome.runtime.getManifest();
export const APP_ENV = manifest.environment.APP_ENV;

export const FOLLOW_UP_NOTES_TEMPLATES =
  APP_ENV === "dev" ? ["Am Med MGMT_SS"] : ["Am Med MGMT", "aasz - follow up"];
export const INTAKE_NOTES_TEMPLATES =
  APP_ENV === "dev"
    ? ["Initial Psychiatric Eval"]
    : ["Initial Psychiatric Eval", "aasz--Initial Psychiatric Eval"];
export const CHIEF_COMPLAINT_FIELD_ID = APP_ENV === "dev" ? "Ctrl15782012" : "Ctrl11679774";

export const IFRAME_TYPES = {
  PATIENT_CHART: "/apps/amds-patient-chart/",
  CHART_VIEWER_DETAIL: "/WebClinical/ChartViewerDetail.aspx",
  CHART_NOTES: "chart/chartnotes.aspx",
};
