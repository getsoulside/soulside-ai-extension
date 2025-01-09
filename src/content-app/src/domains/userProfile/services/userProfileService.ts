import { addLocalStorage, saveCookie } from "@/utils/storage";
import { TimeZone } from "../models";
import { PractitionerRole } from "@/domains/practitionerRole/models";
import { BusinessFunction } from "@/domains/practitionerRole/models";
import { getNavigateFunction } from "@/hooks/useNavigate";
import { store } from "@/store";
import {
  addSelectedTimezone,
  addSelectedUserRole,
  toggleUserProfileLoading,
  addCurrentPageTitle,
} from "../state/userProfile.slice";
import moment from "moment-timezone";
import LOCAL_STORAGE_KEYS from "@/constants/localStorageKeys";

export const selectPractitionerRole = (selectedRole: PractitionerRole | null) => {
  const navigate = getNavigateFunction();
  navigate("/", { replace: true });
  store.dispatch(toggleUserProfileLoading(true));
  store.dispatch({ type: "SELECT_PRACTITIONER_ROLE" });
  store.dispatch(addSelectedUserRole(selectedRole));
  setTimeout(() => {
    store.dispatch(toggleUserProfileLoading(false));
  }, 1000);
  addLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_PRACTITIONER_ROLE, selectedRole);
  saveCookie(LOCAL_STORAGE_KEYS.SELECTED_PRACTITIONER_ROLE, selectedRole?.id || "");
  saveCookie(LOCAL_STORAGE_KEYS.SELECTED_ORGANIZATION, selectedRole?.organizationId || "");
};

export const businessFunctions: {
  businessFunction: BusinessFunction;
  roles: { role: string; displayName: string }[];
}[] = [
  {
    businessFunction: BusinessFunction.CLINICAL_CARE,
    roles: [
      {
        role: "PSYCHIATRIST",
        displayName: "Psychiatrist",
      },
      {
        role: "PSYCHOLOGIST",
        displayName: "Psychologist",
      },
      {
        role: "CLINICAL_SOCIAL_WORKER",
        displayName: "Clinical Social Worker (LCSW)",
      },
      {
        role: "LICENSED_PROFESSIONAL_COUNSELOR",
        displayName: "Licensed Professional Counselor (LPC)",
      },
      {
        role: "MARRIAGE_AND_FAMILY_THERAPIST",
        displayName: "Marriage and Family Therapist (MFT)",
      },
      {
        role: "PSYCHIATRIC_NURSE_PRACTITIONER",
        displayName: "Psychiatric Nurse Practitioner",
      },
      {
        role: "PSYCHIATRIC_NURSE",
        displayName: "Psychiatric Nurse",
      },
      {
        role: "SUBSTANCE_ABUSE_COUNSELOR",
        displayName: "Substance Abuse Counselor",
      },
      {
        role: "OCCUPATIONAL_THERAPIST_IN_MENTAL_HEALTH",
        displayName: "Occupational Therapist in Mental Health",
      },
      {
        role: "PEER_SUPPORT_SPECIALIST_CLINICAL",
        displayName: "Peer Support Specialist (Clinical)",
      },
    ],
  },
  {
    businessFunction: BusinessFunction.CARE_OPERATIONS,
    roles: [
      {
        role: "CARE_OPERATIONS_MANAGER",
        displayName: "Care Operations Manager",
      },
      {
        role: "CARE_COORDINATOR",
        displayName: "Care Coordinator",
      },
      {
        role: "CASE_MANAGER",
        displayName: "Case Manager",
      },
      {
        role: "CLINICAL_CARE_COORDINATOR",
        displayName: "Clinical Care Coordinator",
      },
      {
        role: "DISCHARGE_PLANNER",
        displayName: "Discharge Planner",
      },
      {
        role: "PATIENT_NAVIGATOR",
        displayName: "Patient Navigator",
      },
      {
        role: "HEALTH_COACH",
        displayName: "Health Coach",
      },
      {
        role: "UTILIZATION_REVIEW_COORDINATOR",
        displayName: "Utilization Review Coordinator",
      },
      {
        role: "COMMUNITY_LIAISON_COORDINATOR",
        displayName: "Community Liaison Coordinator",
      },
      {
        role: "QUALITY_IMPROVEMENT_COORDINATOR_CARE",
        displayName: "Quality Improvement Coordinator (Care)",
      },
    ],
  },
  // {
  //   businessFunction: BusinessFunction.ADMINISTRATIVE_SUPPORT,
  //   roles: [
  //     {
  //       role: "RECEPTIONIST",
  //       displayName: "Receptionist",
  //     },
  //     {
  //       role: "ADMINISTRATIVE_ASSISTANT",
  //       displayName: "Administrative Assistant",
  //     },
  //     {
  //       role: "OFFICE_MANAGER",
  //       displayName: "Office Manager",
  //     },
  //     {
  //       role: "INTAKE_COORDINATOR",
  //       displayName: "Intake Coordinator",
  //     },
  //     {
  //       role: "PATIENT_COORDINATOR",
  //       displayName: "Patient Coordinator",
  //     },
  //     {
  //       role: "HEALTH_INFORMATION_TECHNICIAN",
  //       displayName: "Health Information Technician",
  //     },
  //     {
  //       role: "INSURANCE_VERIFICATION_SPECIALIST",
  //       displayName: "Insurance Verification Specialist",
  //     },
  //     {
  //       role: "REFERRAL_COORDINATOR",
  //       displayName: "Referral Coordinator",
  //     },
  //   ],
  // },
  // {
  //   businessFunction: BusinessFunction.BILLING_AND_FINANCE,
  //   roles: [
  //     {
  //       role: "MEDICAL_BILLER_AND_CODER",
  //       displayName: "Medical Biller and Coder",
  //     },
  //     {
  //       role: "FINANCE_AND_BILLING_SPECIALIST",
  //       displayName: "Finance and Billing Specialist",
  //     },
  //   ],
  // },
  // {
  //   businessFunction: BusinessFunction.COMPLIANCE_AND_QUALITY,
  //   roles: [
  //     {
  //       role: "COMPLIANCE_OFFICER",
  //       displayName: "Compliance Officer",
  //     },
  //     {
  //       role: "QUALITY_IMPROVEMENT_COORDINATOR_COMPLIANCE",
  //       displayName: "Quality Improvement Coordinator (Compliance)",
  //     },
  //   ],
  // },
  // {
  //   businessFunction: BusinessFunction.HUMAN_RESOURCES,
  //   roles: [
  //     {
  //       role: "HUMAN_RESOURCES_SPECIALIST",
  //       displayName: "Human Resources Specialist",
  //     },
  //   ],
  // },
  // {
  //   businessFunction: BusinessFunction.INFORMATION_TECHNOLOGY,
  //   roles: [
  //     {
  //       role: "IT_SUPPORT_STAFF",
  //       displayName: "IT Support Staff",
  //     },
  //   ],
  // },
  // {
  //   businessFunction: BusinessFunction.COMMUNITY_AND_OUTREACH,
  //   roles: [
  //     {
  //       role: "MARKETING_AND_COMMUNITY_OUTREACH_COORDINATOR",
  //       displayName: "Marketing and Community Outreach Coordinator",
  //     },
  //     {
  //       role: "COMMUNITY_LIAISON_COORDINATOR_OUTREACH",
  //       displayName: "Community Liaison Coordinator (Outreach)",
  //     },
  //   ],
  // },
  {
    businessFunction: BusinessFunction.MANAGEMENT_AND_LEADERSHIP,
    roles: [
      {
        role: "PRACTICE_MANAGER",
        displayName: "Practice Manager",
      },
      {
        role: "CLINICAL_DIRECTOR",
        displayName: "Clinical Director",
      },
      {
        role: "EXECUTIVE_DIRECTOR",
        displayName: "Executive Director",
      },
      {
        role: "OWNER",
        displayName: "Owner",
      },
      {
        role: "ADMIN",
        displayName: "Admin",
      },
    ],
  },
  // {
  //   businessFunction: BusinessFunction.PATIENT_SUPPORT_AND_ADVOCACY,
  //   roles: [
  //     {
  //       role: "PATIENT_ADVOCATE",
  //       displayName: "Patient Advocate",
  //     },
  //     {
  //       role: "PEER_SUPPORT_SPECIALIST_ADVOCACY",
  //       displayName: "Peer Support Specialist (Advocacy)",
  //     },
  //   ],
  // },
  // {
  //   businessFunction: BusinessFunction.EDUCATION_AND_TRAINING,
  //   roles: [
  //     {
  //       role: "TRAINING_COORDINATOR",
  //       displayName: "Training Coordinator",
  //     },
  //     {
  //       role: "EDUCATIONAL_PROGRAM_DIRECTOR",
  //       displayName: "Educational Program Director",
  //     },
  //   ],
  // },
];

export const roleBusinessFunctionMapping = (role: string): BusinessFunction | null => {
  let businessFunction = null;
  if (!role) {
    return businessFunction;
  }
  businessFunctions.forEach(bf => {
    if (bf.roles.map(i => i.role).includes(role)) {
      businessFunction = bf.businessFunction;
    }
  });
  return businessFunction;
};

export const selectTimezone = (timezone: TimeZone) => {
  store.dispatch(toggleUserProfileLoading(true));
  store.dispatch(addSelectedTimezone(timezone));
  setTimeout(() => {
    store.dispatch(toggleUserProfileLoading(false));
  }, 1000);
  addLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TIMEZONE, timezone);
  saveCookie(LOCAL_STORAGE_KEYS.SELECTED_TIMEZONE, timezone?.name || "");
  moment.tz.setDefault(timezone?.name || "America/Chicago");
};

export const setCurrentPageTitle = (title: string) => {
  store.dispatch(addCurrentPageTitle(title));
};
