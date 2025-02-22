import {
  SessionNotesTemplates,
  DefaultSoapNotes,
  GroupNotes,
  GroupExtendedNotes,
  SessionNotesTemplateNames,
} from "./sessionNotes.types";
import FollowUpAssessmentNotes, {
  FollowUpAssessmentNotesValue,
} from "./sessionNotes.follow_up_assessment.types";
import { IntakeAssessmentNotes } from "./sessionNotes.intake.types";
import BPSTemplate from "./sessionNotes.bps.types";
import { SessionCategory, AppointmentType } from "@/domains/session/models";
import { EhrClient } from "@/ehrClients/ehrClients.types";
export interface SessionNotes {
  id: UUIDString | null;
  userId: UUIDString | null;
  sessionId: UUIDString | null;
  groupId: UUIDString | null;
  bulletPoints: string[] | null;
  soapNote: string | null;
  jsonSoapNote: JSONSoapNote | null;
  createdAt: ISO8601String;
  updatedAt: ISO8601String | null;
  behaviouralHealthPredictions: BehaviouralHealthPredictions | null;
  patientId: UUIDString | null;
  practitionerRoleId: UUIDString | null;
  organizationId: UUIDString | null;
}

export interface JSONSoapNote {
  [SessionNotesTemplates.SOAP_PSYCHIATRY]?: DefaultSoapNotes | null;
  [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]?: FollowUpAssessmentNotes | null;
  [SessionNotesTemplates.INTAKE]?: IntakeAssessmentNotes | null;
  [SessionNotesTemplates.BPS]?: BPSTemplate | null;
  [SessionNotesTemplates.GROUP]?: GroupNotes | null;
  [SessionNotesTemplates.GROUP_EXTENDED_NOTES]?: GroupExtendedNotes | null;
  chiefCompliantEnhanced?: string | null;
  subjective?: Record<string, FollowUpAssessmentNotesValue> | null;
  Subjective?: Record<string, FollowUpAssessmentNotesValue> | null;
  objective?: Record<string, FollowUpAssessmentNotesValue> | null;
  Objective?: Record<string, FollowUpAssessmentNotesValue> | null;
  assessment?: Record<string, FollowUpAssessmentNotesValue> | null;
  Assessment?: Record<string, FollowUpAssessmentNotesValue> | null;
  plan?: Record<string, FollowUpAssessmentNotesValue> | null;
  Plan?: Record<string, FollowUpAssessmentNotesValue> | null;
  [key: string]: any;
}

export interface BehaviouralHealthPredictions {
  "phq-9": Record<string, number>;
  "gad-7": Record<string, number>;
  emotional_distress: "Low" | "Medium" | "High";
  suicide_risk: string;
  explanation: {
    "Key symptoms observed for PHQ-9": string[];
    "Key symptoms observed for GAD-7": string[];
  };
}

// export interface NoteTemplatesItem {
//   key: SessionNotesTemplates;
//   name: (typeof SessionNotesTemplateNames)[SessionNotesTemplates];
//   sessionCategories: SessionCategory[];
//   appointmentTypes: AppointmentType[];
//   ehrIntegrations: EhrClient[];
//   isDefault?: Record<SessionCategory, Record<AppointmentType, boolean>>;
// }

// export const NoteTemplatesLibrary: NoteTemplatesItem[] = [
//   {
//     key: SessionNotesTemplates.SOAP_PSYCHIATRY,
//     name: SessionNotesTemplateNames[SessionNotesTemplates.SOAP_PSYCHIATRY],
//     sessionCategories: [SessionCategory.INDIVIDUAL],
//     appointmentTypes: [AppointmentType.INTAKE, AppointmentType.FOLLOW_UP],
//     ehrIntegrations: [EhrClient.ALLEVA],
//   },
//   {
//     key: SessionNotesTemplates.FOLLOW_UP_ASSESSMENT,
//     name: SessionNotesTemplateNames[SessionNotesTemplates.FOLLOW_UP_ASSESSMENT],
//     sessionCategories: [SessionCategory.INDIVIDUAL],
//     appointmentTypes: [AppointmentType.FOLLOW_UP],
//     ehrIntegrations: [EhrClient.ADVANCED_MD],
//   },
//   {
//     key: SessionNotesTemplates.INTAKE,
//     name: SessionNotesTemplateNames[SessionNotesTemplates.INTAKE],
//     sessionCategories: [SessionCategory.INDIVIDUAL],
//     appointmentTypes: [AppointmentType.INTAKE],
//     ehrIntegrations: [],
//   },
//   {
//     key: SessionNotesTemplates.BPS,
//     name: SessionNotesTemplateNames[SessionNotesTemplates.BPS],
//     sessionCategories: [SessionCategory.INDIVIDUAL],
//     appointmentTypes: [AppointmentType.INTAKE],
//     ehrIntegrations: [EhrClient.ALLEVA],
//   },
//   {
//     key: SessionNotesTemplates.GROUP,
//     name: SessionNotesTemplateNames[SessionNotesTemplates.GROUP],
//     sessionCategories: [SessionCategory.GROUP],
//     appointmentTypes: [AppointmentType.FOLLOW_UP],
//     ehrIntegrations: [EhrClient.ALLEVA],
//   },
// ];

export type NoteTemplatesLibrary = Partial<
  Record<
    SessionCategory,
    Partial<
      Record<
        AppointmentType,
        {
          key: SessionNotesTemplates;
          name: (typeof SessionNotesTemplateNames)[SessionNotesTemplates];
          isDefault: boolean;
          ehrIntegrations: EhrClient[];
        }[]
      >
    >
  >
>;

export const defaultNoteTemplateLibrary: NoteTemplatesLibrary = {
  [SessionCategory.INDIVIDUAL]: {
    [AppointmentType.INTAKE]: [
      {
        key: SessionNotesTemplates.INTAKE,
        name: SessionNotesTemplateNames[SessionNotesTemplates.INTAKE],
        isDefault: true,
        ehrIntegrations: [],
      },
      {
        key: SessionNotesTemplates.BPS,
        name: SessionNotesTemplateNames[SessionNotesTemplates.BPS],
        isDefault: false,
        ehrIntegrations: [EhrClient.ALLEVA],
      },
      {
        key: SessionNotesTemplates.SOAP_PSYCHIATRY,
        name: SessionNotesTemplateNames[SessionNotesTemplates.SOAP_PSYCHIATRY],
        isDefault: false,
        ehrIntegrations: [EhrClient.ALLEVA],
      },
    ],
    [AppointmentType.FOLLOW_UP]: [
      {
        key: SessionNotesTemplates.SOAP_PSYCHIATRY,
        name: SessionNotesTemplateNames[SessionNotesTemplates.SOAP_PSYCHIATRY],
        isDefault: false,
        ehrIntegrations: [EhrClient.ALLEVA],
      },
      {
        key: SessionNotesTemplates.FOLLOW_UP_ASSESSMENT,
        name: SessionNotesTemplateNames[SessionNotesTemplates.FOLLOW_UP_ASSESSMENT],
        isDefault: true,
        ehrIntegrations: [EhrClient.ADVANCED_MD],
      },
    ],
  },
  [SessionCategory.GROUP]: {
    [AppointmentType.FOLLOW_UP]: [
      {
        key: SessionNotesTemplates.GROUP,
        name: SessionNotesTemplateNames[SessionNotesTemplates.GROUP],
        isDefault: true,
        ehrIntegrations: [EhrClient.ALLEVA, EhrClient.ADVANCED_MD],
      },
    ],
  },
};
