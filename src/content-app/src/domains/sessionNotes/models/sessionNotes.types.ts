export enum SessionNotesTemplates {
  "INTAKE" = "intake-assessment",
  "BPS" = "bps-assessment",
  "DEFAULT_SOAP" = "default-soap-notes",
  "FOLLOW_UP_ASSESSMENT" = "follow-up-assessment",
  "GROUP" = "groupNotes",
  "GROUP_EXTENDED_NOTES" = "groupExtendedNotes",
}

export const SessionNotesTemplateNames = {
  [SessionNotesTemplates.INTAKE]: "Initial Psychiatric Eval",
  [SessionNotesTemplates.BPS]: "Biopsychosocial Assessment",
  [SessionNotesTemplates.DEFAULT_SOAP]: "SOAP",
  [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]: "Follow Up Assessment",
  [SessionNotesTemplates.GROUP]: "Group Notes",
  [SessionNotesTemplates.GROUP_EXTENDED_NOTES]: "Group Extended Notes",
} as const;

export interface DefaultSoapNotes {
  defaultSoapNotes?: string | null;
}

export interface GroupNotes {
  [speaker: string]: string | null;
}

export interface GroupExtendedNotes {
  [section: string]: string | null;
}
