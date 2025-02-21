export enum GroupStatus {
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  ARCHIVED = "ARCHIVED",
}

export enum GroupMembershipStatus {
  ACTIVE = "ACTIVE",
  GRADUATED = "GRADUATED",
  CHURNED = "CHURNED",
  GROUP_CHANGED = "GROUP_CHANGED",
  TRANSITIONED = "TRANSITIONED",
}

export enum GroupOpennessType {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export enum PatientSessionRecurrenceType {
  FIXED = "FIXED", // The same patients attend each session
  FLEXIBLE = "FLEXIBLE", // The list of patients can remain same or updated based on changes in group memberships
  DROP_IN = "DROP_IN", // Patients can attend any session without a fixed schedule or commitment. This is common in open or casual group settings where attendance is flexible.
  AD_HOC = "AD_HOC", // Patients are added on an as-needed basis, with no pre-determined schedule
  ROTATING = "ROTATING", // A set group of patients attends sessions on a rotating basis
  VARIABLE = "VARIABLE", // The list of patients changes for each session. There is no fixed pattern, and new patients may join each time, or the patient list may vary significantly from one session to the next
}

export enum SchedulingPreferences {
  AUTO_SCHEDULING = "AUTO_SCHEDULING",
  DEFAULT = "DEFAULT",
  NO_AUTO_SCHEDULING = "NO_AUTO_SCHEDULING",
}

export enum FacilitatorStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNAVAILABLE = "UNAVAILABLE",
}
