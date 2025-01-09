import {
  SessionNotesTemplates,
  DefaultSoapNotes,
  GroupNotes,
  GroupExtendedNotes,
} from "./sessionNotes.types";
import FollowUpAssessmentNotes, {
  FollowUpAssessmentNotesValue,
} from "./sessionNotes.follow_up_assessment.types";
import IntakeAssessmentNotes from "./sessionNotes.intake.types";

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
  [SessionNotesTemplates.DEFAULT_SOAP]?: DefaultSoapNotes | null;
  [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]?: FollowUpAssessmentNotes | null;
  [SessionNotesTemplates.INTAKE]?: IntakeAssessmentNotes | null;
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
