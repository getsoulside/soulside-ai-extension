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
      `iframe[src*="${this.IFRAME_TYPES.CHART_VIEWER_DETAIL}"]`
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

  private addAiIconToLabel(label: Element): void {
    const labelRect = label.getBoundingClientRect();
    if (!label.isConnected || labelRect?.width === 0 || labelRect?.height === 0) return;
    const icon = document.createElement("span");
    icon.classList.add("soulside-ai-icon");
    icon.style.position = "absolute";
    icon.style.left = `calc(${labelRect.right}px + 5px)`; // 5px spacing from label
    icon.style.top = `calc(${labelRect.top}px - ${
      label.parentElement?.getBoundingClientRect().top || 0
    }px)`;
    icon.style.display = "inline-block";
    icon.style.verticalAlign = "middle";
    icon.setAttribute("title", `Added by Soulside AI`);
    icon.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2124_1291)">
        <path d="M4.73387 7.74472C5.14692 5.57619 5.71487 5.00825 7.88339 4.59519C8.14156 4.54358 8.29645 4.33706 8.29645 4.07889C8.29645 3.82072 8.14156 3.61422 7.88339 3.56258C5.71487 3.14953 5.14692 2.58158 4.73387 0.413053C4.68225 0.154895 4.47573 0 4.21756 0C3.95939 0 3.75289 0.154895 3.70125 0.413053C3.2882 2.58158 2.72025 3.14953 0.551725 3.56258C0.345197 3.61422 0.138672 3.82072 0.138672 4.07889C0.138672 4.33706 0.293566 4.54358 0.551725 4.59519C2.72025 5.00825 3.2882 5.57619 3.70125 7.74472C3.75289 8.00289 3.95939 8.15778 4.21756 8.15778C4.47573 8.15778 4.68225 7.95125 4.73387 7.74472Z" fill="#FFD700"/>
        <path d="M9.89751 11.3572C8.45182 11.0474 8.14204 10.7377 7.83223 9.29196C7.78062 9.0338 7.57409 8.87891 7.31593 8.87891C7.05776 8.87891 6.85123 9.0338 6.79962 9.29196C6.48982 10.7377 6.18004 11.0474 4.73434 11.3572C4.47621 11.4089 4.32129 11.6154 4.32129 11.8735C4.32129 12.1317 4.47621 12.3382 4.73434 12.3899C6.18004 12.6996 6.48982 13.0094 6.79962 14.4551C6.85123 14.7133 7.05776 14.8682 7.31593 14.8682C7.57409 14.8682 7.78062 14.7133 7.83223 14.4551C8.14204 13.0094 8.45182 12.6996 9.89751 12.3899C10.1557 12.3382 10.3106 12.1317 10.3106 11.8735C10.3106 11.6154 10.104 11.4089 9.89751 11.3572Z" fill="#FFD700"/>
        <path d="M13.6146 6.19723C12.4787 5.99071 12.2206 5.73254 12.014 4.59665C11.9624 4.33851 11.7559 4.18359 11.4977 4.18359C11.2396 4.18359 11.033 4.33851 10.9814 4.59665C10.7749 5.73254 10.5167 5.99071 9.3808 6.19723C9.12266 6.24887 8.96777 6.4554 8.96777 6.71354C8.96777 6.97171 9.12266 7.17823 9.3808 7.22987C10.5167 7.4364 10.7749 7.69454 10.9814 8.83045C11.033 9.08859 11.2396 9.24351 11.4977 9.24351C11.7559 9.24351 11.9624 9.08859 12.014 8.83045C12.2206 7.69454 12.4787 7.4364 13.6146 7.22987C13.8727 7.17823 14.0277 6.97171 14.0277 6.71354C14.0277 6.4554 13.8727 6.24887 13.6146 6.19723Z" fill="#FFD700"/>
        <path d="M1.48125 10.4812C1.32636 10.3263 1.11983 10.2747 0.913304 10.378C0.861674 10.378 0.810041 10.4296 0.75841 10.4812C0.70678 10.5328 0.655146 10.5845 0.655146 10.6361C0.603516 10.6877 0.603516 10.791 0.603516 10.8426C0.603516 10.8943 0.603516 10.9975 0.655146 11.0491C0.706779 11.1008 0.70678 11.1524 0.75841 11.2041C0.810041 11.2557 0.861674 11.3073 0.913304 11.3073C0.964935 11.359 1.0682 11.359 1.11983 11.359C1.17146 11.359 1.27473 11.359 1.32636 11.3073C1.37799 11.2557 1.42962 11.2557 1.48125 11.2041C1.53288 11.1524 1.58452 11.1008 1.58452 11.0491C1.63615 10.9975 1.63615 10.8943 1.63615 10.8426C1.63615 10.791 1.63615 10.6877 1.58452 10.6361C1.58452 10.5845 1.53288 10.5328 1.48125 10.4812Z" fill="#FFD700"/>
        <path d="M12.9948 2.58222C13.1497 2.58222 13.253 2.53059 13.3563 2.42733C13.4595 2.32406 13.5112 2.2208 13.5112 2.06591C13.5112 1.91101 13.4595 1.80775 13.3563 1.70449C13.3046 1.65286 13.253 1.60122 13.2014 1.60122C13.0981 1.54959 12.9432 1.54959 12.7883 1.60122C12.7367 1.60122 12.685 1.65286 12.6334 1.70449C12.5302 1.80775 12.4785 1.91101 12.4785 2.06591C12.4785 2.2208 12.5302 2.32406 12.6334 2.42733C12.7367 2.53059 12.8399 2.58222 12.9948 2.58222Z" fill="#FFD700"/>
        </g>
        <defs>
        <clipPath id="clip0_2124_1291">
        <rect width="14.1667" height="15" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    `;
    label?.parentElement?.appendChild(icon);
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
                this.addAiIconToLabel(label);
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
                    this.addAiIconToLabel(label);
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
                  this.addAiIconToLabel(label);
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
