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
      console.log("clientId", clientId);
      const patient: Patient = {
        id: "0fe1528f-573a-4659-abb1-92d8215aba3e",
        active: true,
        organizationId: "ca119abc-9900-46b6-92f9-62ed4d6f84e9",
        organizationName: "Serenity Health LLC",
        patientUserId: null,
        firstName: "DEBORAH",
        lastName: "KEATON",
        email: "dkeaton_hs@yahoo.com",
        phoneNumber: " ",
        createdAt: "2025-01-31T00:01:06.679507-08:00",
      };
      return Promise.resolve(patient);
    } catch (error) {
      console.error("Error fetching patients by client ID:", error);
      return null;
    }
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

  private getAngularScope(selector: string): any {
    const element = document.querySelector(selector);
    if (!element) return null;
    return (window as any)?.angular?.element(element)?.scope();
  }

  private async handleIntakeAssessment(): Promise<Session | null> {
    const clientIdElement = document.querySelector("#ClientId") as HTMLInputElement;
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
    const scope = this.getAngularScope("[ng-if='showClientSessionScreen']");

    if (!scope?.showClientSessionScreen) {
      console.warn("Not in client session screen");
      return null;
    }

    // const visitId = scope?.appointmentInfo?.AppointmentId;
    const visitId = "19642133";
    if (!visitId) {
      console.warn("Visit ID not found in appointment info");
      return null;
    }

    return this.fetchSessionByVisitId(visitId);
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
    if (notesTemplate === SessionNotesTemplates.BPS) {
      return this.handleBPSAssessment(notesData);
    }
    return false;
  }

  private async handleBPSAssessment(notesData: SessionNotes): Promise<boolean> {
    const bpsData = notesData?.jsonSoapNote?.["bps-assessment"] || BPSTemplateData;
    if (!bpsData) return false;
    bpsAssessmentSchema.forEach(async section => {
      if (section.ehrFields?.sectionEditable) {
        console.log("section", section);
        const editBtn: HTMLButtonElement | null = section.ehrFields?.editBtnSelector
          ? (document.querySelector(section.ehrFields?.editBtnSelector) as HTMLButtonElement)
          : null;
        console.log("editBtn", editBtn);
        let isEditActive = !!this.getAngularScope(section.ehrFields?.editBtnSelector || "")?.[
          section.ehrFields?.editActiveAttribute || ""
        ];
        // console.log("isEditActive", isEditActive);
        if (!isEditActive) {
          editBtn?.click();
          isEditActive = !!this.getAngularScope(section.ehrFields?.editBtnSelector || "")?.[
            section.ehrFields?.editActiveAttribute || ""
          ];
          const checkEditActive = async () => {
            isEditActive = !!this.getAngularScope(section.ehrFields?.editBtnSelector || "")?.[
              section.ehrFields?.editActiveAttribute || ""
            ];
            if (!isEditActive) {
              editBtn?.click();
              await new Promise(resolve => setTimeout(resolve, 5000));
              await checkEditActive();
            }
          };
          await checkEditActive();
        }
        console.log("isEditActive", isEditActive);
        console.log("section", section);
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
            inputField.value = sectionValue;
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
                inputField.value = sectionValue;
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
                    inputField.value = sectionValue;
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

// bpsAssessmentTextarea.dispatchEvent(new Event("change"));
