export interface TreatmentPlanMVP {
  id: UUIDString | null;
  planName: string | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  patientFirstName: string | null;
  patientLastName: string | null;
  patientPhoneNumber: string | null;
  patientEmail: string | null;
  plan: JSON | null;
  revisionReason: string | null;
  revisedByPractitionerRoleId: UUIDString | null;
  revisedByPractitionerId: UUIDString | null;
  revisedByPractitionerFirstName: string | null;
  revisedByPractitionerLastName: string | null;
  createdAt: ISO8601String;
  updatedAt: ISO8601String | null;
}
