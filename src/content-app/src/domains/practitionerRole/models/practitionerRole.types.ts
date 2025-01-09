export enum ClinicalCareRoles {
  PSYCHIATRIST = "Psychiatrist",
  PSYCHOLOGIST = "Psychologist",
  CLINICAL_SOCIAL_WORKER = "Clinical Social Worker (LCSW)",
  LICENSED_PROFESSIONAL_COUNSELOR = "Licensed Professional Counselor (LPC)",
  MARRIAGE_AND_FAMILY_THERAPIST = "Marriage and Family Therapist (MFT)",
  PSYCHIATRIC_NURSE_PRACTITIONER = "Psychiatric Nurse Practitioner",
  PSYCHIATRIC_NURSE = "Psychiatric Nurse",
  SUBSTANCE_ABUSE_COUNSELOR = "Substance Abuse Counselor",
  OCCUPATIONAL_THERAPIST_IN_MENTAL_HEALTH = "Occupational Therapist in Mental Health",
  PEER_SUPPORT_SPECIALIST_CLINICAL = "Peer Support Specialist (Clinical)",
}

export enum CareOperationsRoles {
  CARE_OPERATIONS_MANAGER = "Care Operations Manager",
  CARE_COORDINATOR = "Care Coordinator",
  CASE_MANAGER = "Case Manager",
  CLINICAL_CARE_COORDINATOR = "Clinical Care Coordinator",
  DISCHARGE_PLANNER = "Discharge Planner",
  PATIENT_NAVIGATOR = "Patient Navigator",
  HEALTH_COACH = "Health Coach",
  UTILIZATION_REVIEW_COORDINATOR = "Utilization Review Coordinator",
  COMMUNITY_LIAISON_COORDINATOR = "Community Liaison Coordinator",
  QUALITY_IMPROVEMENT_COORDINATOR_CARE = "Quality Improvement Coordinator (Care)",
}

export enum AdministrativeSupportRoles {
  RECEPTIONIST = "Receptionist",
  ADMINISTRATIVE_ASSISTANT = "Administrative Assistant",
  OFFICE_MANAGER = "Office Manager",
  INTAKE_COORDINATOR = "Intake Coordinator",
  PATIENT_COORDINATOR = "Patient Coordinator",
  HEALTH_INFORMATION_TECHNICIAN = "Health Information Technician",
  INSURANCE_VERIFICATION_SPECIALIST = "Insurance Verification Specialist",
  REFERRAL_COORDINATOR = "Referral Coordinator",
}

export enum BillingAndFinanceRoles {
  MEDICAL_BILLER_AND_CODER = "Medical Biller and Coder",
  FINANCE_AND_BILLING_SPECIALIST = "Finance and Billing Specialist",
}

export enum ComplianceAndQualityRoles {
  COMPLIANCE_OFFICER = "Compliance Officer",
  QUALITY_IMPROVEMENT_COORDINATOR_COMPLIANCE = "Quality Improvement Coordinator (Compliance)",
}

export enum HumanResourcesRoles {
  HUMAN_RESOURCES_SPECIALIST = "Human Resources Specialist",
}

export enum InformationTechnologyRoles {
  IT_SUPPORT_STAFF = "IT Support Staff",
}

export enum CommunityAndOutreachRoles {
  MARKETING_AND_COMMUNITY_OUTREACH_COORDINATOR = "Marketing and Community Outreach Coordinator",
  COMMUNITY_LIAISON_COORDINATOR_OUTREACH = "Community Liaison Coordinator (Outreach)",
}

export enum ManagementAndLeadershipRoles {
  PRACTICE_MANAGER = "Practice Manager",
  CLINICAL_DIRECTOR = "Clinical Director",
  EXECUTIVE_DIRECTOR = "Executive Director",
  OWNER = "Owner",
  ADMIN = "Admin",
}

export enum PatientSupportAndAdvocacyRoles {
  PATIENT_ADVOCATE = "Patient Advocate",
  PEER_SUPPORT_SPECIALIST_ADVOCACY = "Peer Support Specialist (Advocacy)",
}

export enum EducationAndTrainingRoles {
  TRAINING_COORDINATOR = "Training Coordinator",
  EDUCATIONAL_PROGRAM_DIRECTOR = "Educational Program Director",
}

export type BehaviorHealthRole =
  | ClinicalCareRoles
  | CareOperationsRoles
  | AdministrativeSupportRoles
  | BillingAndFinanceRoles
  | ComplianceAndQualityRoles
  | HumanResourcesRoles
  | InformationTechnologyRoles
  | CommunityAndOutreachRoles
  | ManagementAndLeadershipRoles
  | PatientSupportAndAdvocacyRoles
  | EducationAndTrainingRoles;

export enum BusinessFunction {
  CLINICAL_CARE = "Clinical Care",
  CARE_OPERATIONS = "Care Operations",
  ADMINISTRATIVE_SUPPORT = "Administrative Support",
  BILLING_AND_FINANCE = "Billing and Finance",
  COMPLIANCE_AND_QUALITY = "Compliance and Quality",
  HUMAN_RESOURCES = "Human Resources",
  INFORMATION_TECHNOLOGY = "Information Technology",
  COMMUNITY_AND_OUTREACH = "Community and Outreach",
  MANAGEMENT_AND_LEADERSHIP = "Management and Leadership",
  PATIENT_SUPPORT_AND_ADVOCACY = "Patient Support and Advocacy",
  EDUCATION_AND_TRAINING = "Education and Training",
}

export type BusinessFunctions = BusinessFunction[];
