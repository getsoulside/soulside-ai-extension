interface SnagSnap {
  abilities: string[] | string | null;
  goals: string[] | string | null;
  needs: string[] | string | null;
  strengths: string[] | string | null;
}

interface BiographicalInformation {
  children: string[] | string | null;
  currentLivingSituation: string[] | string | null;
  educationLevel: string[] | string | null;
  employmentStatus: string[] | string | null;
  maritalStatus: string[] | string | null;
}

interface BiologicalFactors {
  familyMedicalHistory: string[] | string | null;
  medicalHistory: string[] | string | null;
  medications: string[] | string | null;
  physicalDisabilities: string[] | string | null;
}

interface PsychologicalFactors {
  cognitiveFunctioning: string[] | string | null;
  copingSkills: string[] | string | null;
  eatingPatterns: string[] | string | null;
  exerciseRoutine: string[] | string | null;
  mentalHealthDiagnosis: string[] | string | null;
  presentingProblem: string[] | string | null;
  previousPsychologicalTreatment: string[] | string | null;
  sleepPatterns: string[] | string | null;
  symptomsAndBehaviors: string[] | string | null;
  traumaHistory: string[] | string | null;
}

interface ProtectiveFactors {
  hobbies: string[] | string | null;
  motivationForChange: string[] | string | null;
  strengths: string[] | string | null;
}

interface RiskFactors {
  poorCopingSkills: string[] | string | null;
  selfHarm: string[] | string | null;
  suicidalIdeation: string[] | string | null;
  violenceOrAggression: string[] | string | null;
}

interface RiskAndProtectiveFactors {
  protectiveFactors: ProtectiveFactors;
  riskFactors: RiskFactors;
}

interface SocialFactors {
  familyRelationships: string[] | string | null;
  financialStatus: string[] | string | null;
  legalIssues: string[] | string | null;
  socialAndCulturalInfluences: string[] | string | null;
  socialSupportNetwork: string[] | string | null;
  workplaceFunctioning: string[] | string | null;
}

interface SummaryAndConclusions {
  clinicalImpressions: string[] | string | null;
}

interface TreatmentPlan {
  followUpPlans: string[] | string | null;
  recommendedInterventions: string[] | string | null;
  treatmentGoals: string[] | string | null;
}

interface BPS {
  biographicalInformation: BiographicalInformation;
  biologicalFactors: BiologicalFactors;
  psychologicalFactors: PsychologicalFactors;
  riskAndProtectiveFactors: RiskAndProtectiveFactors;
  socialFactors: SocialFactors;
  summaryAndConclusions: SummaryAndConclusions;
  treatmentPlan: TreatmentPlan;
}

interface DiagnosisProblem {
  ICD10_DSM5_Code: string | null;
  problemName: string | null;
  problemGroup: string | null;
  priority: string | null;
}

interface DiagnosisProblems {
  diagnosisProblems: DiagnosisProblem[];
}

interface NutritionalSelfAssessment {
  considersUnderweightOrMalnourished: boolean | null;
  difficultySwallowing: boolean | null;
  lost10lbsInPastMonth: boolean | null;
  nutritionalOrDietaryConcerns: boolean | null;
}

interface PhysicalPain {
  painScale: string[] | string | null;
  planForPain8OrHigher: string[] | string | null;
}

interface PreviousTreatment {
  tXCenterName: string | null;
  duration: string | null;
  levelOfCare: string | null;
  responseToPreviousTreatment: string | null;
}

interface PreviousTreatments {
  previousTreatments: PreviousTreatment[];
}

interface SubstanceUseHistoryEntry {
  substanceUsed: string | null;
  daysUsedInTheLast30Days: string | null;
  routeOfUse: string | null;
  usualAmountUsedInA24HourDay: string | null;
  dateOfLastUse: string | null;
  ageFirstUsed: string | null;
  yearsOfUse: string | null;
  methodOfAcquiringSubstance: string | null;
  patternOfUse: string | null;
}

interface SubstanceUseHistory {
  substanceUseHistory: SubstanceUseHistoryEntry[];
}

interface BPSTemplate {
  snagSnap: SnagSnap | null;
  bps: BPS | null;
  diagnosisProblems: DiagnosisProblems | null;
  nutritionalSelfAssessment: NutritionalSelfAssessment | null;
  physicalPain: PhysicalPain | null;
  previousTreatments: PreviousTreatments | null;
  substanceUseHistory: SubstanceUseHistory | null;
}
export default BPSTemplate;
