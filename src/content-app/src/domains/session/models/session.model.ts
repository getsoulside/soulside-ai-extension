import { PractitionerRole } from "@/domains/practitionerRole";
import {
  ModeOfDelivery,
  SoulsideVertical,
  SessionStatus,
  SessionCategory,
  AppointmentType,
  BehavioralHealthDataType,
} from "./session.types";
import { SoulsideGroup } from "@/domains/group";
import { Patient } from "@/domains/patient";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";

export type Session = IndividualSession | SoulsideSession;

//Individual Session
export interface IndividualSession {
  id: UUIDString | null;
  sessionName: string | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  practitionerRoleId: UUIDString | null;
  practitionerId: UUIDString | null;
  practitionerFirstName: string | null;
  practitionerLastName: string | null;
  practitionerEmail: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  patientFirstName: string | null;
  patientLastName: string | null;
  patientEmail: string | null;
  patientPhoneNumber: string | null;
  startTime: ISO8601String | null;
  durationInMinutes: number | null;
  endTime: ISO8601String | null;
  sessionStatus: SessionStatus | null;
  sessionCategory: SessionCategory | null;
  modeOfDelivery: ModeOfDelivery | null;
  createdAt: ISO8601String;
  checkInTime: ISO8601String | null;
  actualDurationInMinutes: number | null;
  checkOutTime: ISO8601String | null;
  appointmentType: AppointmentType | null;
}

//Group Session
export interface SoulsideSession {
  id: UUIDString | null;
  groupName: string | null;
  groupId: UUIDString | null;
  startHour: number | null;
  startMinute: number | null;
  dayOfWeek: DayOfWeek | null;
  soulsideVertical: SoulsideVertical | null;
  sessionStatus: SessionStatus | null;
  sessionMembers: SessionMember[] | null;
  sessionPrompts: SessionPrompt[] | null;
  sessionFacilitator: SessionFacilitator | null;
  createdAt: ISO8601String;
  scheduledFor?: ISO8601String | null;
  sessionName: string | null;
  practitionerRoleId: UUIDString | null;
  practitionerId: UUIDString | null;
  practitionerFirstName: string | null;
  practitionerLastName: string | null;
  practitionerEmail: string | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  startTime: string | null;
  durationInMinutes?: number | null;
  endTime?: string | null;
  sessionCategory: SessionCategory | null;
  modeOfDelivery: ModeOfDelivery | null;
  sessionPatientMemberDtos: SessionPatientMember[] | null;
  checkInTime?: ISO8601String | null;
  actualDurationInMinutes?: number | null;
  checkOutTime?: ISO8601String | null;
}

export interface SessionFacilitator {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  facilitatorId: UUIDString | null;
}

export interface SessionMember {
  id: number | null;
  soulsideSession: SoulsideSession | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  userId: UUIDString | null;
  firstJoinedAt: ISO8601String | null;
  lastLeftAt: ISO8601String | null;
}

export interface SessionPromptExample {
  title: string | null;
  text: string | null;
}

export interface SessionPromptDetails {
  title: string | null;
  paragraphs: string[] | null;
  sessionPromptExamples: SessionPromptExample[] | null;
}

export interface SessionPrompt {
  id: number | null;
  soulsideSession: SoulsideSession | null;
  sessionPromptDetails: SessionPromptDetails | null;
  soulsideVertical: SoulsideVertical | null;
  createdAt: ISO8601String;
  promptId: UUIDString | null;
}

export interface SessionPatientMember {
  id: number | null;
  soulsideSession?: SoulsideSession | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  patientFirstName: string | null;
  patientLastName: string | null;
  patientPhoneNumber: string | null;
  createdAt: ISO8601String;
}

export interface SessionPatientWaitingStatus {
  patientId: UUIDString | null;
  status: string | null;
  updatedAt: ISO8601String | null;
}

export interface SessionGroupWaitingStatus {
  groupId: UUIDString | null;
  patients: Record<UUIDString, SessionPatientWaitingStatus> | null;
  updatedAt: ISO8601String | null;
}

export interface SessionPatientMentalWellnessData {
  patientId: UUIDString | null;
  mentalWellnessData: MentalWellnessData | null;
}

export type MentalWellnessData = {
  [key in BehavioralHealthDataType]: {
    behavioralHealthDataType: BehavioralHealthDataType;
    questionAnswerMap: Record<string, any> | null;
    score: number | null;
  };
};

export interface ScheduleSessionPayload {
  practitionerRoleId: PractitionerRole["id"] | null;
  sessionName: string | null;
  offsetStartDateTime: ISO8601String | null;
  durationInMinutes: number | null;
  sessionCategory: SessionCategory | null;
  modeOfDelivery: ModeOfDelivery | null;
  appointmentType: AppointmentType | null;
  groupId?: SoulsideGroup["id"] | null;
  patientId?: Patient["id"] | null;
}

export interface SessionNotesStatus {
  sessionId: UUIDString | null;
  sessionCategory: SessionCategory | null;
  appointmentType: AppointmentType | null;
  notesStatus: Record<SessionNotesTemplates, boolean> | null;
  notesExists: boolean | null;
}
