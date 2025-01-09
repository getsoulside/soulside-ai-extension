export enum SessionNotesTemplates {
  "INTAKE" = "intake-assessment",
  "DEFAULT_SOAP" = "default-soap-notes",
  "FOLLOW_UP_ASSESSMENT" = "follow-up-assessment",
  "GROUP" = "groupNotes",
  "GROUP_EXTENDED_NOTES" = "groupExtendedNotes",
}

export interface DefaultSoapNotes {
  defaultSoapNotes?: string | null;
}

export interface GroupNotes {
  [speaker: string]: string | null;
}

export interface GroupExtendedNotes {
  [section: string]: string | null;
}
