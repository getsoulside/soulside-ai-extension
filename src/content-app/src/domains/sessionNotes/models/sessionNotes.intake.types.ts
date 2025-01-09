interface Question {
  question: string;
  options: string[];
  response: string;
  explanation?: string;
}

interface TableEntry {
  [key: string]: string;
}

interface BehavioralHealthScreening {
  behavioralHealthScreening: Question[];
}

interface RiskScreeningTables {
  Suicidal_Ideation_Table: TableEntry[];
  Suicide_Attempts_Table: TableEntry[];
  Self_Injurious_Behavior_Table: TableEntry[];
  Aggression_Table: TableEntry[];
  Homicidal_Ideation_Table: TableEntry[];
  Risk_Taking_Behaviors_Table: TableEntry[];
}

interface RiskScreening {
  Risk_factors: Question[];
  Protective_Factors: Question[];
  "Based on your answers to the risk screening questions above, how can you keep yourself safe?": Question[];
}

interface TraumaScreening {
  note: Question[];
}

interface PreviousTreatmentHistoryTables {
  Program: TableEntry[];
  Therapist: TableEntry[];
  Psychiatrist: TableEntry[];
  Dietitian: TableEntry[];
  Physician: TableEntry[];
  Other_Program: TableEntry[];
  Other_Practitioner: TableEntry[];
}

interface MedicalIntake {
  Allergies_Table: TableEntry[];
  General: Question[];
  Developmental_History: Question[];
  Medication: Question[];
}

interface FamilyAndSocialHistory {
  question: string;
  options: string[];
  response: string;
}

interface SubstanceUseHistoryAndPatternsOfUseTables {
  Opioids: TableEntry[];
  Depressants: TableEntry[];
  Stimulants: TableEntry[];
  Hallucinogens: TableEntry[];
  Other_Drugs_Not_Listed: TableEntry[];
  Nicotine: TableEntry[];
}

interface EducationalAndEmploymentHistory {
  question: string;
  options: string[];
  response: string;
  explanation?: string;
}

export default interface IntakeAssessmentNotes {
  intakeHPINote: string;
  Behavioral_Health_Screening: BehavioralHealthScreening;
  Risk_Screening_Tables: RiskScreeningTables;
  Risk_Screening: RiskScreening;
  Trauma_Screening: TraumaScreening;
  Previous_Treatment_History_Tables: PreviousTreatmentHistoryTables;
  Medical_Intake: MedicalIntake;
  Family_and_Social_History: FamilyAndSocialHistory;
  Substance_Use_History_and_Patterns_of_Use_Tables: SubstanceUseHistoryAndPatternsOfUseTables;
  Educational_and_Employment_History: EducationalAndEmploymentHistory;
}
