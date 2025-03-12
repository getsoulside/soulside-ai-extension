import { Session } from "@/domains/session";
import { SessionNotes } from "@/domains/sessionNotes";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { store } from "@/store";
import httpClient from "@/utils/httpClient";
import { EhrClient } from "../ehrClients.types";
import useFollowUpAssessment from "@/Routes/SessionDetails/components/SessionNotes/NoteTemplates/FollowUpAssessment/useFollowUpAssessment";
import { convertToTitleCase } from "@/utils/helpers";

export default class AdvancedMD {
  private static instance: AdvancedMD | null = null;

  public static getEhrClientName(): EhrClient {
    return EhrClient.ADVANCED_MD;
  }

  private readonly IFRAME_TYPES = {
    PATIENT_CHART: "/apps/amds-patient-chart/",
    CHART_VIEWER_DETAIL: "/WebClinical/ChartViewerDetail.aspx",
    CHART_NOTES: "chart/chartnotes.aspx",
  } as const;

  private readonly FOLLOW_UP_NOTES_TEMPLATES = ["Am Med MGMT", "aasz - follow up"];

  private readonly INTAKE_NOTES_TEMPLATES = [
    "Initial Psychiatric Eval",
    "aasz--Initial Psychiatric Eval",
  ];

  private constructor() {}

  public static getInstance(): AdvancedMD {
    if (!AdvancedMD.instance) {
      AdvancedMD.instance = new AdvancedMD();
    }
    return AdvancedMD.instance;
  }

  private getOrganizationId(): string | null {
    const organizationId = store.getState().userProfile.selectedRole.data?.organizationId;
    if (!organizationId) {
      console.warn("No organization ID found");
      return null;
    }
    return organizationId;
  }

  private async fetchSessionByVisitId(visitId: string): Promise<Session | null> {
    const organizationId = this.getOrganizationId();
    if (!organizationId) return null;

    try {
      const url = `practitioner-role/session-member-notes/organization/${organizationId}/advancedmd-visit/${visitId}/find-individual-session`;
      const response = await httpClient.get(url);
      return response?.data || null;
    } catch (error) {
      console.error("Soulside Session Fetch Error", error);
      return null;
    }
  }

  private getActiveChartNotesIframe(): HTMLIFrameElement | null {
    // Find the active patient chart iframe
    const activePatientChart = document.querySelector(
      `amds-tab-view:not(.amds-hidden-view) iframe[src*="${this.IFRAME_TYPES.PATIENT_CHART}"]`
    ) as HTMLIFrameElement;
    if (!activePatientChart) return null;

    // Find the chart viewer iframe within the active patient chart
    const chartViewerDoc =
      activePatientChart.contentDocument || activePatientChart.contentWindow?.document;
    if (!chartViewerDoc) return null;

    // Find the chart viewer iframe
    const chartViewerIframe = chartViewerDoc.querySelector(
      `amds-tab-view:not(.amds-hidden-view) iframe[src*="${this.IFRAME_TYPES.CHART_VIEWER_DETAIL}"]`
    ) as HTMLIFrameElement;
    if (!chartViewerIframe) return null;

    // Get chart viewer document
    const chartViewerDetailDoc =
      chartViewerIframe.contentDocument || chartViewerIframe.contentWindow?.document;
    if (!chartViewerDetailDoc) return null;

    // Find the chart notes iframe within the chart viewer
    const activeChartNotesIframe = chartViewerDetailDoc.querySelector(
      `iframe[src*="${this.IFRAME_TYPES.CHART_NOTES}"]`
    ) as HTMLIFrameElement;
    return activeChartNotesIframe;
  }

  public async getActiveSession(): Promise<Session | null> {
    const activeChartNotesIframe = this.getActiveChartNotesIframe();
    if (!activeChartNotesIframe) return null;

    try {
      const iframeDoc =
        activeChartNotesIframe.contentDocument || activeChartNotesIframe.contentWindow?.document;
      if (!iframeDoc) return null;

      const visitIdInput = iframeDoc.querySelector('input[name="hidParentID"]') as HTMLInputElement;
      const visitId = visitIdInput?.value;

      if (!visitId) {
        throw {
          message: "No visit id found",
          error_code: "NO_VISIT_ID_FOUND",
        };
      }

      const session = await this.fetchSessionByVisitId(visitId);
      if (!session) {
        throw {
          message: "Appointment not synced with Soulside",
          error_code: "APPOINTMENT_NOT_FOUND",
        };
      }

      return session;
    } catch (error) {
      console.error("Error in getActiveSession:", error);
      throw error;
    }
  }

  public async checkIfOnNotesScreen(): Promise<boolean> {
    const activeChartNotesIframe = this.getActiveChartNotesIframe();
    return !!activeChartNotesIframe;
  }

  public async getActiveTemplateType(): Promise<SessionNotesTemplates | null> {
    const activeChartNotesIframe = this.getActiveChartNotesIframe();
    if (!activeChartNotesIframe) return null;

    try {
      const iframeDoc =
        activeChartNotesIframe.contentDocument || activeChartNotesIframe.contentWindow?.document;
      if (!iframeDoc) return null;

      const templateInput = iframeDoc.querySelector(
        'input[name="hidTemplateName"]'
      ) as HTMLInputElement;
      return templateInput?.value && this.isTemplateValid(templateInput.value)
        ? (templateInput.value as SessionNotesTemplates)
        : null;
    } catch (error) {
      console.warn("Error accessing iframe content:", error);
      return null;
    }
  }

  private isTemplateValid(templateName: string): boolean {
    return [...this.FOLLOW_UP_NOTES_TEMPLATES, ...this.INTAKE_NOTES_TEMPLATES].includes(
      templateName
    );
  }

  private addAiIconToLabel(label: Element, explanation?: string): void {
    const labelRect = label.getBoundingClientRect();
    if (!label.isConnected || labelRect?.width === 0 || labelRect?.height === 0) return;
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = `calc(${labelRect.right}px + 5px)`; // 5px spacing from label
    wrapper.style.top = `calc(${labelRect.top}px - ${
      label.parentElement?.getBoundingClientRect().top || 0
    }px - 2px)`;
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "5px";

    const box = document.createElement("div");
    box.style.display = "inline-block";
    box.style.fontSize = "9px";
    box.style.padding = "3px 5px";
    box.style.borderRadius = "3px";
    box.style.backgroundColor = "#f4f44d";
    box.style.color = "#000";
    box.style.border = "0.5px solid #b8b822";
    box.setAttribute("title", `Added by Soulside AI`);
    box.textContent = "Added by Soulside AI";
    wrapper.appendChild(box);
    if (explanation) {
      const iconSpan = document.createElement("span");
      iconSpan.style.cursor = "pointer";
      iconSpan.style.display = "inline-block";
      iconSpan.setAttribute("title", explanation);
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("width", "10");
      icon.setAttribute("height", "10");
      icon.setAttribute("viewBox", "0 0 10 10");
      icon.setAttribute("fill", "none");
      icon.innerHTML =
        '<path d="M5 0C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10C7.76 10 10 7.76 10 5C10 2.24 7.76 0 5 0ZM5 7.5C4.725 7.5 4.5 7.275 4.5 7V5C4.5 4.725 4.725 4.5 5 4.5C5.275 4.5 5.5 4.725 5.5 5V7C5.5 7.275 5.275 7.5 5 7.5ZM5.5 3.5H4.5V2.5H5.5V3.5Z" fill="#7a7a7a"/>';
      iconSpan.appendChild(icon);
      wrapper.appendChild(iconSpan);
    }
    label?.parentElement?.appendChild(wrapper);
  }

  public async addNotes(
    notesData: SessionNotes | null,
    notesTemplate: SessionNotesTemplates
  ): Promise<boolean> {
    console.log("Adding notes", notesData, notesTemplate);
    const activeChartNotesIframe = this.getActiveChartNotesIframe();
    if (!activeChartNotesIframe) return false;

    try {
      const iframeDoc =
        activeChartNotesIframe.contentDocument || activeChartNotesIframe.contentWindow?.document;
      const noteTab = iframeDoc?.querySelector('div[name="Note"]');
      if (!noteTab) return false;

      if (notesTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT) {
        const { followUpNotesData } = useFollowUpAssessment({ notesData });
        let ignoreFields = ["homework_assignments", "DSM-5 Diagnoses", "Suggested ICD & CPT codes"];

        if (notesData?.jsonSoapNote?.chiefCompliantEnhanced) {
          ignoreFields.push("chief_complaint");
        }

        const manualLabelMapping = {
          follow_up_plans: "Plan",
          ["hallucination_type(s)"]: "HallucinationType(s)",
          judgment: "Judgement",
        };

        const manualFielTypeMapping = {
          insight: "multiple_choice_answers",
          judgment: "multiple_choice_answers",
          psychomotor_activity: "multiple_choice_answers",
        };

        // Process each section of the notes
        for (const section of followUpNotesData) {
          for (const [fieldKey, fieldData] of Object.entries(section.data) as [string, any][]) {
            if (ignoreFields.includes(fieldKey)) continue;
            const fieldType =
              manualFielTypeMapping[fieldKey as keyof typeof manualFielTypeMapping] ||
              fieldData.type;
            const labelText =
              manualLabelMapping[fieldKey as keyof typeof manualLabelMapping] ||
              convertToTitleCase(fieldKey);
            const label = Array.from(noteTab.querySelectorAll("span, div")).find(
              elem =>
                (elem as HTMLElement)?.innerText?.trim()?.toLowerCase() ===
                labelText?.trim()?.toLowerCase()
            );

            if (!label) continue;

            if (fieldType === "paragraph" || fieldType === "list_of_values") {
              let valueToAdd = "";
              const textarea =
                label.nextElementSibling?.tagName === "TEXTAREA"
                  ? (label.nextElementSibling as HTMLTextAreaElement)
                  : (label.nextElementSibling?.querySelector(
                      "textarea"
                    ) as HTMLTextAreaElement | null);

              if (!textarea) continue;
              if (fieldType === "paragraph" && fieldData.result) {
                valueToAdd = fieldData.result;
              } else if (fieldType === "list_of_values" && fieldData.result?.length > 0) {
                valueToAdd = fieldData.result.join("\n");
              }
              if (valueToAdd) {
                textarea.value = (textarea.value ? textarea.value + "\n\n" : "") + valueToAdd;
                this.addAiIconToLabel(label, fieldData.explanation);
              }
            } else if (fieldType === "single_choice_answer") {
              const radioInputs = label.nextElementSibling?.querySelectorAll('input[type="radio"]');
              if (radioInputs) {
                for (const radio of Array.from(radioInputs)) {
                  const radioInput = radio as HTMLInputElement;
                  const radioLabel = radioInput.nextElementSibling as HTMLLabelElement;
                  if (
                    radioLabel &&
                    radioLabel.textContent?.trim()?.toLowerCase() ===
                      fieldData.result?.trim()?.toLowerCase()
                  ) {
                    radioInput.checked = true;
                    this.addAiIconToLabel(label, fieldData.explanation);
                    break;
                  }
                }
              }
            } else if (fieldType === "multiple_choice_answers") {
              let currentElement = label.nextElementSibling;
              const checkboxInputs: HTMLInputElement[] = [];

              // Collect all checkbox inputs until we hit the next field label
              while (
                currentElement &&
                !(
                  currentElement.tagName === "SPAN" &&
                  !currentElement.previousElementSibling?.querySelector('input[type="checkbox"]')
                )
              ) {
                if (currentElement.tagName === "DIV") {
                  const checkbox = currentElement.querySelector('input[type="checkbox"]');
                  if (checkbox) {
                    checkboxInputs.push(checkbox as HTMLInputElement);
                  }
                }
                currentElement = currentElement.nextElementSibling;
              }
              const fieldResult = fieldData.result
                ? typeof fieldData.result === "string"
                  ? [fieldData.result?.trim()?.toLowerCase()]
                  : fieldData.result?.map((r: string) => r?.trim()?.toLowerCase())
                : [];
              if (checkboxInputs.length && Array.isArray(fieldResult)) {
                let checkBoxChecked = false;
                for (const checkbox of checkboxInputs) {
                  const checkboxDiv = checkbox.closest("div");
                  const labelSpan = checkboxDiv?.nextElementSibling as HTMLSpanElement;
                  if (labelSpan) {
                    checkbox.checked = !!fieldResult?.includes(
                      labelSpan.textContent?.trim()?.toLowerCase()
                    );
                    if (!!checkbox.checked) {
                      checkBoxChecked = true;
                    }
                  }
                }
                if (checkBoxChecked) {
                  this.addAiIconToLabel(label, fieldData.explanation);
                }
              }
            }
          }
        }
        if (notesData?.jsonSoapNote?.chiefCompliantEnhanced) {
          const chiefComplaintLabel = Array.from(noteTab.querySelectorAll("span, div")).find(
            elem => (elem as HTMLElement)?.innerText?.trim()?.toLowerCase() === "chief complaint"
          );

          if (!chiefComplaintLabel) return false;

          const chiefComplaintTextarea =
            chiefComplaintLabel.nextElementSibling?.tagName === "TEXTAREA"
              ? (chiefComplaintLabel.nextElementSibling as HTMLTextAreaElement)
              : chiefComplaintLabel.parentElement?.querySelector("textarea");

          if (!chiefComplaintTextarea) return false;

          chiefComplaintTextarea.value =
            (chiefComplaintTextarea.value ? chiefComplaintTextarea.value + "\n\n" : "") +
              notesData?.jsonSoapNote?.chiefCompliantEnhanced || "";
          this.addAiIconToLabel(chiefComplaintLabel);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.warn("Error adding notes:", error);
      return false;
    }
  }

  public static resetInstance(): void {
    AdvancedMD.instance = null;
  }
}
