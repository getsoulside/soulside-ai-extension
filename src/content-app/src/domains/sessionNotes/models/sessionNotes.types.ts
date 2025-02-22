export enum SessionNotesTemplates {
  "INTAKE" = "intake-assessment",
  "BPS" = "bps-assessment",
  "SOAP_PSYCHIATRY" = "soap-note",
  "FOLLOW_UP_ASSESSMENT" = "follow-up-assessment",
  "GROUP" = "groupNotes",
  "GROUP_EXTENDED_NOTES" = "groupExtendedNotes",
}

export const SessionNotesTemplateNames = {
  [SessionNotesTemplates.INTAKE]: "Initial Psychiatric Eval",
  [SessionNotesTemplates.BPS]: "Biopsychosocial Assessment",
  [SessionNotesTemplates.SOAP_PSYCHIATRY]: "SOAP - Psychiatry",
  [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]: "Follow Up Assessment",
  [SessionNotesTemplates.GROUP]: "Group Notes",
  [SessionNotesTemplates.GROUP_EXTENDED_NOTES]: "Group Extended Notes",
} as const;

export type DefaultSoapNotes = string | null;

export interface GroupNotes {
  [speaker: string]: string | null;
}

export interface GroupExtendedNotes {
  [section: string]: string | null;
}
