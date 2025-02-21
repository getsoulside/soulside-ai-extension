export type FollowUpAssessmentNotesValue =
  | FollowUpAssessmentNotesSingleChoiceValue
  | FollowUpAssessmentNotesMultiChoiceValue
  | FollowUpAssessmentNotesListValue
  | FollowUpAssessmentNotesParagraphValue;

export interface FollowUpAssessmentNotesSingleChoiceValue {
  type: "single_choice_answer";
  result: string | null;
  explanation: string | null;
  values_identified: string[] | null;
  values_remaining: string[] | null;
}

export interface FollowUpAssessmentNotesMultiChoiceValue {
  type: "multiple_choice_answers";
  result: string[] | null;
  explanation: string | null;
  values_identified: string[] | null;
  values_remaining: string[] | null;
}

export interface FollowUpAssessmentNotesListValue {
  type: "list_of_values";
  result: string[] | null;
  explanation: string | null;
  values_identified: string[] | null;
  values_remaining: string[] | null;
}

export interface FollowUpAssessmentNotesParagraphValue {
  type: "paragraph";
  result: string | null;
  explanation: string | null;
  values_identified: string[] | null;
  values_remaining: string[] | null;
}

export default interface FollowUpAssessmentNotes {
  chiefCompliantEnhanced?: string | null;
  subjective?: Record<string, FollowUpAssessmentNotesValue> | null;
  Subjective?: Record<string, FollowUpAssessmentNotesValue> | null;
  objective?: Record<string, FollowUpAssessmentNotesValue> | null;
  Objective?: Record<string, FollowUpAssessmentNotesValue> | null;
  assessment?: Record<string, FollowUpAssessmentNotesValue> | null;
  Assessment?: Record<string, FollowUpAssessmentNotesValue> | null;
  plan?: Record<string, FollowUpAssessmentNotesValue> | null;
  Plan?: Record<string, FollowUpAssessmentNotesValue> | null;
}
