import { UserRole } from "./userProfile.types";
import { PractitionerRole } from "@/domains/practitionerRole/models";

export interface User {
  id: UUIDString | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  createdAt: ISO8601String;
  enabled: boolean;
  locked: boolean;
  userRole: UserRole | null;
}

export interface UserAssignedRole {
  organizationId: UUIDString | null;
  organizationName: string | null;
  roles: PractitionerRole[];
}

export interface TimeZone {
  abbr: string;
  offset: number;
  name: string;
}
