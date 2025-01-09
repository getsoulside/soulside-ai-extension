export interface Patient {
  id: UUIDString | null;
  active: boolean;
  organizationId: UUIDString;
  organizationName: string | null;
  patientUserId: UUIDString | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  createdAt: ISO8601String;
}

export interface PatientUser {
  id: UUIDString | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  createdAt: ISO8601String;
}
