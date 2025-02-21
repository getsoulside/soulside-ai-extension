import { Session } from "@/domains/session";

export interface DischargeSummary {
  id: UUIDString | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  patientFirstName: string | null;
  patientLastName: string | null;
  patientPhoneNumber: string | null;
  patientEmail: string | null;
  dischargeSummary: DischargeSummary | null;
  createdByPractitionerRoleId: UUIDString | null;
  createdByPractitionerId: UUIDString | null;
  createdByPractitionerFirstName: string | null;
  createdByPractitionerLastName: string | null;
  createdAt: ISO8601String;
  updatedAt: ISO8601String | null;
}

export interface DischargeSummary {
  data?: string | null;
  intakeSession?: Session | null;
  latestSession?: Session | null;
}
