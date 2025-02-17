import { Patient } from "@/domains/patient";
import { getIntakeSessionsByPatientId } from "@/domains/session";
import { Session } from "@/domains/session/models";
import { SessionNotes } from "@/domains/sessionNotes";
import BPSTemplate from "@/domains/sessionNotes/models/sessionNotes.bps.types";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import BPSTemplateData from "@/Routes/SessionDetails/components/SessionNotes/NoteTemplates/BPSAssessment/bpsTemplateData";
import bpsAssessmentSchema from "@/Routes/SessionDetails/components/SessionNotes/NoteTemplates/BPSAssessment/bpsTemplateSchema";
import { store } from "@/store";
import httpClient from "@/utils/httpClient";
import { EhrClient } from "../ehrClients.types";

// function findMatchingListFirstItem(searchValue: string): string | null {
//   // Get all ul elements with ui-menu class
//   const menuLists = document.querySelectorAll("ul.ui-menu.ui-autocomplete");

//   // Convert to array and find the first list that matches
//   const matchingList = Array.from(menuLists).find(ul => {
//     // Get the first li > div text content
//     const firstItem = ul.querySelector("li.ui-menu-item:first-child .ui-menu-item-wrapper");
//     if (!firstItem) return false;

//     const firstItemText = firstItem.textContent;
//     // Compare with search value (case insensitive)
//     return firstItemText?.toLowerCase().includes(searchValue.toLowerCase());
//   });

//   // If matching list found, return its first item text
//   if (matchingList) {
//     const firstItem = matchingList.querySelector(
//       "li.ui-menu-item:first-child .ui-menu-item-wrapper"
//     );
//     return firstItem?.textContent || null;
//   }

//   // Return null if no match found
//   return null;
// }
export class Alleva {
  private static instance: Alleva | null = null;

  public static getEhrClientName(): EhrClient {
    return EhrClient.ALLEVA;
  }

  private constructor() {}

  public static getInstance(): Alleva {
    if (!Alleva.instance) {
      Alleva.instance = new Alleva();
    }
    return Alleva.instance;
  }

  public static resetInstance(): void {
    Alleva.instance = null;
  }

  private getOrganizationId(): string | null {
    const organizationId = store.getState().userProfile.selectedRole.data?.organizationId;
    if (!organizationId) {
      console.warn("No organization ID found");
      return null;
    }
    return organizationId;
  }

  private async findPatientByClientId(clientId: string): Promise<Patient | null> {
    try {
      const organizationId = this.getOrganizationId();
      if (!organizationId) return null;
      const url = `practitioner-role/session-member-notes/organization/${organizationId}/alleva-ehr/${clientId}/find-patient`;
      const response = await httpClient.get(url);
      return response?.data || null;
    } catch (error) {
      console.error("Error fetching patients by client ID:", error);
      return null;
    }
  }

  private async fetchSessionByVisitId(
    visitId: string,
    isGroupSession: boolean
  ): Promise<Session | null> {
    const organizationId = this.getOrganizationId();
    if (!organizationId) return null;

    try {
      const url = !isGroupSession
        ? `practitioner-role/session-member-notes/organization/${organizationId}/alleva-ehr/${visitId}/find-individual-session`
        : `practitioner-role/session-member-notes/organization/${organizationId}/alleva-ehr/${visitId}/find-group-session`;
      const response = await httpClient.get(url);
      return response?.data || null;
    } catch (error) {
      console.error("Soulside Session Fetch Error", error);
      return null;
    }
  }

  private getAngularScope(selector: string): any {
    const element = document.querySelector(selector);
    if (!element) return null;
    return (window as any)?.angular?.element(element)?.scope();
  }

  private async handleIntakeAssessment(): Promise<Session | null> {
    const clientIdElement = document.querySelector("#hdnLeadIdSalesIntake") as HTMLInputElement;
    if (!clientIdElement?.value) {
      console.warn("Client ID element not found");
      return null;
    }

    const patient = await this.findPatientByClientId(clientIdElement.value);
    if (!patient?.id) {
      console.warn("No patient found for client");
      return null;
    }

    const intakeSessions = await getIntakeSessionsByPatientId(patient.id);
    if (!intakeSessions.length) {
      console.warn("No intake sessions found for client");
      return null;
    }

    return intakeSessions.sort(
      (a, b) => new Date(b.startTime || "").getTime() - new Date(a.startTime || "").getTime()
    )[0];
  }

  private async handleFollowUpSession(): Promise<Session | null> {
    const individualSessionScope = this.getAngularScope("[ng-if='showClientSessionScreen']");
    const groupSessionScope = this.getAngularScope("[ng-if='showGroupSessionScreen']");

    if (
      !individualSessionScope?.showClientSessionScreen &&
      !groupSessionScope?.showGroupSessionScreen
    ) {
      console.warn("Not on notes screen");
      return null;
    }

    const visitId =
      individualSessionScope?.appointmentInfo?.AppointmentId ||
      groupSessionScope?.appointmentInfo?.AppointmentId;
    console.log(
      "visitId",
      individualSessionScope?.appointmentInfo || groupSessionScope?.appointmentInfo
    );
    if (!visitId) {
      console.warn("Visit ID not found in appointment info");
      return null;
    }

    return this.fetchSessionByVisitId(visitId, !!groupSessionScope?.showGroupSessionScreen);
  }

  public async getActiveSession(): Promise<Session | null> {
    try {
      const currentUrl = window.location.href;

      if (currentUrl.includes("clientPsychIntake")) {
        return await this.handleIntakeAssessment();
      }

      if (currentUrl.includes("Scheduler")) {
        return await this.handleFollowUpSession();
      }

      return null;
    } catch (error) {
      console.error("Error in getActiveSession:", error);
      return null;
    }
  }

  public async getActiveTemplateType(): Promise<SessionNotesTemplates | null> {
    try {
      const currentUrl = window.location.href;

      if (currentUrl.includes("clientPsychIntake")) {
        return SessionNotesTemplates.BPS;
      }

      if (currentUrl.includes("Scheduler")) {
        const scope = this.getAngularScope("[ng-if='showClientSessionScreen']");
        if (scope?.showClientSessionScreen) {
          return SessionNotesTemplates.DEFAULT_SOAP;
        }
      }

      return null;
    } catch (error) {
      console.error("Error in getActiveTemplateType:", error);
      return null;
    }
  }

  public async addNotes(
    notesData: SessionNotes | null,
    notesTemplate: SessionNotesTemplates
  ): Promise<boolean> {
    if (!notesData || !notesTemplate) return false;
    const currentUrl = window.location.href;
    const isGroupSession = !!this.getAngularScope("[ng-if='showGroupSessionScreen']");
    if (notesTemplate === SessionNotesTemplates.BPS) {
      if (currentUrl.includes("clientPsychIntake")) {
        return this.handleBPSAssessment(notesData);
      } else {
        return Promise.reject({ message: "Not on BPS assessment screen" });
      }
    }
    if (notesTemplate === SessionNotesTemplates.DEFAULT_SOAP) {
      if (currentUrl.includes("Scheduler")) {
        return this.handleDefaultSoap(notesData, isGroupSession);
      } else {
        return Promise.reject({ message: "Not on appointment notes screen" });
      }
    }
    return false;
  }

  private async handleDefaultSoap(
    notesData: SessionNotes,
    isGroupSession: boolean
  ): Promise<boolean> {
    if (isGroupSession) {
      return this.handleGroupDefaultSoap(notesData);
    } else {
      return this.handleIndividualDefaultSoap(notesData);
    }
  }

  private async handleGroupDefaultSoap(notesData: SessionNotes): Promise<boolean> {
    console.log("handleGroupDefaultSoap", notesData);
    return false;
  }

  private async handleIndividualDefaultSoap(notesData: SessionNotes): Promise<boolean> {
    const soapNote = notesData?.soapNote || "";
    const notesEditor = document.querySelector(
      "div[data-qa-id='individual-note-form-group'] .tox-editor-container"
    ) as HTMLTextAreaElement;
    if (!notesEditor) {
      console.warn("Notes editor not found");
      return false;
    }
    notesEditor.focus();
    const existingContent = window?.tinymce?.activeEditor?.getContent?.() || "";
    const newContent = existingContent + (existingContent ? "\n\n" : "") + soapNote;
    window?.tinymce?.activeEditor?.setContent(newContent);
    window?.tinymce?.activeEditor?.focus();
    return true;
  }

  private async handleBPSAssessment(notesData: SessionNotes): Promise<boolean> {
    const bpsData = notesData?.jsonSoapNote?.["bps-assessment"] || BPSTemplateData;
    if (!bpsData) return false;
    bpsAssessmentSchema.forEach(async section => {
      if (section.ehrFields?.sectionEditable) {
        const editBtn: HTMLButtonElement | null = section.ehrFields?.editBtnSelector
          ? (document.querySelector(section.ehrFields?.editBtnSelector) as HTMLButtonElement)
          : null;
        let isEditActive = !document
          .querySelector(
            `.physcintake-top div[ng-show="${section.ehrFields?.editActiveAttribute}"]`
          )
          ?.classList.contains("ng-hide");
        if (!isEditActive) {
          editBtn?.click();
          isEditActive = !document
            .querySelector(
              `.physcintake-top div[ng-show="${section.ehrFields?.editActiveAttribute}"]`
            )
            ?.classList.contains("ng-hide");
          const checkEditActive = async () => {
            isEditActive = !document
              .querySelector(
                `.physcintake-top div[ng-show="${section.ehrFields?.editActiveAttribute}"]`
              )
              ?.classList.contains("ng-hide");
            if (!isEditActive) {
              editBtn?.click();
              await new Promise(resolve => setTimeout(resolve, 2000));
              await checkEditActive();
            }
          };
          await checkEditActive();
        }
      }
      section.value.forEach(field => {
        if (field.type === "listOfValues") {
          const fieldForm: HTMLFormElement | null = field.ehrFields?.selector
            ? (document.querySelector(field.ehrFields?.selector) as HTMLFormElement)
            : null;
          if (fieldForm) {
            const sectionData = bpsData[section.key as keyof BPSTemplate] as unknown as Record<
              string,
              any[]
            >;
            sectionData[field.key].forEach((value: any) => {
              field.value.forEach((valueItem: any) => {
                const inputField: HTMLInputElement | null = valueItem.ehrFields?.selector
                  ? (fieldForm.querySelector(valueItem.ehrFields?.selector) as HTMLInputElement)
                  : null;
                if (inputField && value[valueItem.key]) {
                  inputField.value = value[valueItem.key];
                  // if (valueItem.autoComplete) {
                  //   const firstItem = findMatchingListFirstItem(value[valueItem.key]);
                  //   if (firstItem) {
                  //     inputField.value = firstItem;
                  //   }
                  // }
                  inputField.dispatchEvent(new Event("change"));
                }
              });
            });
            fieldForm.dispatchEvent(new Event("change"));
            const submitButton: HTMLButtonElement | null = field.ehrFields?.submitButtonSelector
              ? (fieldForm.querySelector(
                  field.ehrFields?.submitButtonSelector
                ) as HTMLButtonElement)
              : null;
            if (submitButton) {
              // submitButton.click();
            }
          }
        }
        if (field.type === "input" || field.type === "textarea") {
          const inputField: HTMLInputElement | null = field.ehrFields?.selector
            ? (document.querySelector(field.ehrFields?.selector) as HTMLInputElement)
            : null;
          const sectionValue = (bpsData[section.key as keyof BPSTemplate] as any)[field.key];
          if (inputField && sectionValue) {
            inputField.value =
              (inputField.value
                ? `${inputField.value} ${field.type === "textarea" ? "\n" : ""}`
                : "") + sectionValue;
            inputField.dispatchEvent(new Event("change"));
          }
        }
        if (field.type === "checkbox") {
          const checkboxField: HTMLInputElement | null = field.ehrFields?.selector
            ? (document.querySelector(field.ehrFields?.selector) as HTMLInputElement)
            : null;
          const sectionValue = !!(bpsData[section.key as keyof BPSTemplate] as any)[field.key];
          if (checkboxField) {
            checkboxField.checked = sectionValue;
            checkboxField.dispatchEvent(new Event("change"));
          }
        }
        if (field.type === "subSection") {
          field.value.forEach(subField => {
            if (subField.type === "input" || subField.type === "textarea") {
              const inputField: HTMLInputElement | null = subField.ehrFields?.selector
                ? (document.querySelector(subField.ehrFields?.selector) as HTMLInputElement)
                : null;
              const sectionValue = (bpsData[section.key as keyof BPSTemplate] as any)[field.key][
                subField.key
              ];
              if (inputField && sectionValue) {
                inputField.value =
                  (inputField.value
                    ? `${inputField.value} ${subField.type === "textarea" ? "\n" : ""}`
                    : "") + sectionValue;
                inputField.dispatchEvent(new Event("change"));
              }
            }
            if (subField.type === "subSubSection") {
              subField.value.forEach(subSubField => {
                if (subSubField.type === "input" || subSubField.type === "textarea") {
                  const inputField: HTMLInputElement | null = subSubField.ehrFields?.selector
                    ? (document.querySelector(subSubField.ehrFields?.selector) as HTMLInputElement)
                    : null;
                  const sectionValue = (bpsData[section.key as keyof BPSTemplate] as any)[
                    field.key
                  ][subField.key][subSubField.key];
                  if (inputField && sectionValue) {
                    inputField.value =
                      (inputField.value
                        ? `${inputField.value} ${subSubField.type === "textarea" ? "\n" : ""}`
                        : "") + sectionValue;
                    inputField.dispatchEvent(new Event("change"));
                  }
                }
              });
            }
          });
        }
      });
    });

    return true;
  }
}

export default Alleva;
