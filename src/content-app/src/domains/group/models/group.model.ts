import {
  GroupStatus,
  GroupMembershipStatus,
  GroupOpennessType,
  PatientSessionRecurrenceType,
  SchedulingPreferences,
  FacilitatorStatus,
} from "./group.types";
import { SoulsideVertical, ModeOfDelivery } from "@/domains/session";

export interface SoulsideGroup {
  id: UUIDString | null;
  groupName: string | null;
  startHour: number | null;
  startMinute: number | null;
  dayOfWeek: DayOfWeek | null;
  soulsideVertical: SoulsideVertical | null;
  groupStatus: GroupStatus | null;
  groupMemberships: Set<GroupMembership> | null;
  groupFacilitators: Set<GroupFacilitator> | null;
  createdAt: ISO8601String | null;
  schedulingPreferences: SchedulingPreferences | null;
  organizationId: string | null;
  organizationName: string | null;
  groupPatientMemberships: Set<GroupPatientMembership> | null;
  groupPractitionerRoles: Set<GroupPractitionerRole> | null;
  groupOpennessType: GroupOpennessType | null;
  patientSessionRecurrenceType: PatientSessionRecurrenceType | null;
  sessionDurationInMinutes: number | null;
  modeOfDelivery: ModeOfDelivery | null;
}

export interface GroupMembership {
  id: number | null;
  soulsideGroup: SoulsideGroup | null;
  userId: UUIDString | null;
  userRequestId: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  intakeFormMap: JSON | null;
  soulsideVertical: SoulsideVertical | null;
  groupMembershipStatus: GroupMembershipStatus | null;
  createdAt: ISO8601String;
  startedAt: ISO8601String | null;
  endedAt: ISO8601String | null;
}

export interface GroupFacilitator {
  id: number | null;
  soulsideGroup: SoulsideGroup | null;
  facilitatorId: UUIDString | null;
  firstName: string | null;
  lastName: string | null;
  facilitatorStatus: FacilitatorStatus | null;
  createdAt: ISO8601String;
  startedAt: ISO8601String | null;
  endedAt: ISO8601String | null;
  profileDescription: string | null;
}

export interface GroupPatientMembership {
  id: number | null;
  soulsideGroup: SoulsideGroup | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  patientFirstName: string | null;
  patientLastName: string | null;
  patientPhoneNumber: string | null;
  intakeFormMap: Map<string, string> | null;
  groupMembershipStatus: GroupMembershipStatus | null;
  createdAt: ISO8601String;
  startedAt: ISO8601String | null;
  endedAt: ISO8601String | null;
}

export interface GroupPractitionerRole {
  id: number | null;
  soulsideGroup: SoulsideGroup | null;
  active: boolean;
  organizationId: UUIDString;
  organizationName: string | null;
  practitionerRoleId: UUIDString | null;
  practitionerId: UUIDString | null;
  practitionerFirstName: string | null;
  practitionerLastName: string | null;
  practitionerEmail: string | null;
  behaviorHealthRole: string;
  createdAt: ISO8601String;
  startedAt: ISO8601String | null;
  endedAt: ISO8601String | null;
  profileDescription: string | null;
}
