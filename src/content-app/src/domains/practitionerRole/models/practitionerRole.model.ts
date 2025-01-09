import { BehaviorHealthRole, BusinessFunction } from "./practitionerRole.types";

export interface PractitionerRole {
  id: UUIDString | null;
  active: boolean;
  organizationId: UUIDString;
  organizationName: string | null;
  practitionerId: UUIDString;
  practitionerFirstName: string | null;
  practitionerLastName: string | null;
  practitionerEmail: string | null;
  behaviorHealthRole: BehaviorHealthRole | null;
  createdAt: ISO8601String;
  profileDescription: string | null;
  businessFunction?: BusinessFunction | null | undefined;
}
