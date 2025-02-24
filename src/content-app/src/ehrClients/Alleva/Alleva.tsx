import { Patient } from "@/domains/patient";
import { getIntakeSessionsByPatientId } from "@/domains/session";
import { Session } from "@/domains/session/models";
import { SessionNotes } from "@/domains/sessionNotes";
import BPSTemplate from "@/domains/sessionNotes/models/sessionNotes.bps.types";
import {
  GroupNotes,
  SessionNotesTemplates,
} from "@/domains/sessionNotes/models/sessionNotes.types";
import BPSTemplateData from "@/Routes/SessionDetails/components/SessionNotes/NoteTemplates/BPSAssessment/bpsTemplateData";
import bpsAssessmentSchema from "@/Routes/SessionDetails/components/SessionNotes/NoteTemplates/BPSAssessment/bpsTemplateSchema";
import { store } from "@/store";
import httpClient from "@/utils/httpClient";
import { EhrClient } from "../ehrClients.types";
import { SoulsideMeetingSessionTranscript } from "@/domains/meeting";

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

  private async getAngularScope(selector: string): Promise<any> {
    window.postMessage(
      {
        type: "GET_ANGULAR_SCOPE",
        selector: selector,
      },
      "*"
    );

    // Wait for response with timeout
    return new Promise((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "ANGULAR_SCOPE" && event.data.selector === selector) {
          window.removeEventListener("message", messageHandler);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          resolve(event.data.value);
        }
      };
      window.addEventListener("message", messageHandler);

      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", messageHandler);
        reject(new Error("Timeout waiting for Angular scope"));
      }, 5000); // 5 second timeout
    });
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
    const individualSessionScope = await this.getAngularScope("[ng-if='showClientSessionScreen']");
    const groupSessionScope = await this.getAngularScope("[ng-if='showGroupSessionScreen']");
    const isGroupSession = !!groupSessionScope;
    const appointmentScope = isGroupSession ? groupSessionScope : individualSessionScope;
    const appointmentInfo = appointmentScope?.appointment;
    if (!appointmentInfo) {
      console.warn("Not on notes screen");
      return null;
    }

    const visitId = appointmentInfo?.AppointmentId;
    if (!visitId) {
      console.warn("Visit ID not found in appointment info");
      return null;
    }

    return this.fetchSessionByVisitId(visitId, isGroupSession);
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
        const scope = await this.getAngularScope("[ng-if='showClientSessionScreen']");
        if (scope?.showClientSessionScreen) {
          return SessionNotesTemplates.SOAP_PSYCHIATRY;
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
    notesTemplate: SessionNotesTemplates,
    providerSessionUniqueSpeakers?: Record<string, SoulsideMeetingSessionTranscript>
  ): Promise<boolean> {
    if (!notesData || !notesTemplate) return false;
    const currentUrl = window.location.href;
    const isGroupSession = !!(await this.getAngularScope("[ng-if='showGroupSessionScreen']"));
    if (notesTemplate === SessionNotesTemplates.BPS) {
      if (currentUrl.includes("clientPsychIntake")) {
        return this.handleBPSAssessment(notesData);
      } else {
        return Promise.reject({ message: "Not on BPS assessment screen" });
      }
    }
    if (notesTemplate === SessionNotesTemplates.SOAP_PSYCHIATRY) {
      if (currentUrl.includes("Scheduler")) {
        return this.handleDefaultSoap(notesData, isGroupSession, providerSessionUniqueSpeakers);
      } else {
        return Promise.reject({ message: "Not on appointment notes screen" });
      }
    }
    if (notesTemplate === SessionNotesTemplates.GROUP) {
      if (currentUrl.includes("Scheduler")) {
        return this.handleGroupDefaultSoap(notesData, providerSessionUniqueSpeakers);
      } else {
        return Promise.reject({ message: "Not on appointment notes screen" });
      }
    }
    return false;
  }

  private async handleDefaultSoap(
    notesData: SessionNotes,
    isGroupSession: boolean,
    providerSessionUniqueSpeakers?: Record<string, SoulsideMeetingSessionTranscript>
  ): Promise<boolean> {
    if (isGroupSession) {
      return this.handleGroupDefaultSoap(notesData, providerSessionUniqueSpeakers);
    } else {
      return this.handleIndividualDefaultSoap(notesData);
    }
  }

  private async handleGroupDefaultSoap(
    notesData: SessionNotes,
    providerSessionUniqueSpeakers?: Record<string, SoulsideMeetingSessionTranscript>
  ): Promise<boolean> {
    const groupNotes = notesData?.jsonSoapNote?.[SessionNotesTemplates.GROUP] || null;
    const groupNotesScope = await this.getAngularScope("div[data-qa-id='clientNotes-container']");
    const getPatientName = (patientId: string) => {
      return providerSessionUniqueSpeakers?.[patientId]?.participantName || patientId;
    };
    const soulsideNotesData: GroupNotes = {};
    Object.keys(groupNotes || {}).forEach((notePatientName: string) => {
      const patientName = getPatientName(notePatientName);
      soulsideNotesData[patientName] = groupNotes?.[notePatientName] || "";
    });
    const groupPatientsData =
      groupNotesScope?.allClientSessions?.map((patient: any) => {
        const allevaClientLeadId = patient?.Client?.leadId || "";
        const allevaClientName = patient?.Client?.ClientFullName || "";
        const soulsideNotes = soulsideNotesData[allevaClientName] || "";
        return {
          allevaClientLeadId,
          allevaClientName,
          soulsideNotes,
        };
      }) || [];
    for (const patient of groupPatientsData) {
      const allevaClientLeadId = patient?.allevaClientLeadId || "";
      let soulsideNotes = patient?.soulsideNotes || "";
      soulsideNotes = soulsideNotes.replace(/\n/g, "<br>");
      soulsideNotes = soulsideNotes.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      const notesEditor = document.querySelector(
        `textarea[data-qa-id='txt-clientNotes-${allevaClientLeadId}-notes']`
      ) as HTMLTextAreaElement;
      if (!notesEditor) {
        console.warn("Notes editor not found");
        return false;
      }
      const editorId = notesEditor.id;
      window.postMessage(
        {
          type: "SET_TINYMCE_CONTENT",
          content: soulsideNotes,
          editorId,
        },
        "*"
      );

      // Wait for response with timeout
      await new Promise((resolve, reject) => {
        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === "TINYMCE_CONTENT_SET") {
            window.removeEventListener("message", messageHandler);
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            resolve(true);
          }
        };
        window.addEventListener("message", messageHandler);

        const timeoutId = setTimeout(() => {
          window.removeEventListener("message", messageHandler);
          reject(new Error("Timeout waiting for TinyMCE content set"));
        }, 5000); // 5 second timeout
      });
      continue;
    }
    return true;
  }

  private async handleIndividualDefaultSoap(notesData: SessionNotes): Promise<boolean> {
    const soapNote = notesData?.jsonSoapNote?.[SessionNotesTemplates.SOAP_PSYCHIATRY] || "";
    const notesEditor = document.querySelector(
      "div[data-qa-id='individual-note-form-group'] textarea[data-qa-id='individual-note-textarea']"
    ) as HTMLTextAreaElement;
    if (!notesEditor) {
      console.warn("Notes editor not found");
      return false;
    }
    const editorId = notesEditor.id;
    window.postMessage(
      {
        type: "SET_TINYMCE_CONTENT",
        content: soapNote,
        editorId,
      },
      "*"
    );

    // Wait for response with timeout
    return new Promise((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "TINYMCE_CONTENT_SET") {
          window.removeEventListener("message", messageHandler);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          resolve(true);
        }
      };
      window.addEventListener("message", messageHandler);

      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", messageHandler);
        reject(new Error("Timeout waiting for TinyMCE content set"));
      }, 5000); // 5 second timeout
    });
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
                  if (!valueItem.autoComplete) {
                    inputField.value = value[valueItem.key];
                    inputField.dispatchEvent(new Event("change"));
                  }
                  // if (valueItem.autoComplete) {
                  //   const firstItem = findMatchingListFirstItem(value[valueItem.key]);
                  //   if (firstItem) {
                  //     inputField.value = firstItem;
                  //   }
                  // }
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
              submitButton.click();
            }
          }
        }
        if (field.type === "input" || field.type === "textarea") {
          const inputField: HTMLInputElement | null = field.ehrFields?.selector
            ? (document.querySelector(field.ehrFields?.selector) as HTMLInputElement)
            : null;
          const sectionValue = (bpsData[section.key as keyof BPSTemplate] as any)[field.key];
          let value = sectionValue;
          if (typeof value === "string" || typeof value === "number") {
            value = value.toString();
          } else if (Array.isArray(value || null)) {
            value = field.type === "textarea" ? value.join("\n") : value.join(", ");
          }
          if (inputField && value) {
            inputField.value =
              (inputField.value
                ? `${inputField.value} ${field.type === "textarea" ? "\n" : ""}`
                : "") + value;
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
              let value = sectionValue;
              if (typeof value === "string" || typeof value === "number") {
                value = value.toString();
              } else if (Array.isArray(value || null)) {
                value = subField.type === "textarea" ? value.join("\n") : value.join(", ");
              }
              if (inputField && value) {
                inputField.value =
                  (inputField.value
                    ? `${inputField.value} ${subField.type === "textarea" ? "\n" : ""}`
                    : "") + value;
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
                  let value = sectionValue;
                  if (typeof value === "string" || typeof value === "number") {
                    value = value.toString();
                  } else if (Array.isArray(value || null)) {
                    value = subSubField.type === "textarea" ? value.join("\n") : value.join(", ");
                  }
                  if (inputField && value) {
                    inputField.value =
                      (inputField.value
                        ? `${inputField.value} ${subSubField.type === "textarea" ? "\n" : ""}`
                        : "") + value;
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
