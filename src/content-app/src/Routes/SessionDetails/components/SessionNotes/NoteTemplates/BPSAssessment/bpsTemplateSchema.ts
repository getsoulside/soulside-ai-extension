// Base interface for common properties
export interface BaseField {
  key: string;
  type: string;
  label: string;
  ehrFields?: {
    type?: "form" | "input" | "textarea" | "checkbox" | "select";
    selector?: string;
    submitButtonSelector?: string;
    sectionEditable?: boolean;
    editBtnSelector?: string;
    editActiveAttribute?: string;
  };
}

// Interface for input/textarea fields
export interface InputField extends BaseField {
  type: "input" | "textarea";
  kind: "text";
}

// Interface for checkbox fields
export interface CheckboxField extends BaseField {
  type: "checkbox";
}

// Interface for list of values
export interface ListOfValuesField extends BaseField {
  type: "listOfValues";
  value: InputField[];
}

// Interface for subsection fields
export interface SubSectionField extends BaseField {
  type: "subSection";
  value: (InputField | SubSubSectionField)[];
}

// Interface for sub-subsection fields
export interface SubSubSectionField extends BaseField {
  type: "subSubSection";
  value: InputField[];
}

// Interface for section fields
export interface SectionField extends BaseField {
  type: "section";
  value: (InputField | ListOfValuesField | SubSectionField | CheckboxField)[];
}

// The main schema type
export type BpsTemplateSchema = SectionField;

let bpsTemplateSchema: BpsTemplateSchema[] = [
  {
    key: "diagnosisProblems",
    type: "section",
    label: "Diagnosis/Problems",
    value: [
      {
        key: "diagnosisProblems",
        type: "listOfValues",
        ehrFields: {
          type: "form",
          selector: 'form[data-qa-id="diagnosis-form"]',
          submitButtonSelector: 'button[data-qa-id="submit-button"]',
        },
        label: "",
        value: [
          {
            key: "ICD10_DSM5_Code",
            type: "input",
            kind: "text",
            label: "ICD-10/DSM-5 Code",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="icd-dsm-code-input"]',
            },
          },
          {
            key: "problemName",
            type: "input",
            kind: "text",
            label: "Problem Name",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="dx-problem-name-input"]',
            },
          },
          {
            key: "problemGroup",
            type: "input",
            kind: "text",
            label: "Problem Group",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="dx-problem-group-input"]',
            },
          },
          {
            key: "priority",
            type: "input",
            kind: "text",
            label: "Priority",
            ehrFields: {
              type: "select",
              selector: 'select[data-qa-id="priority-dropdown"]',
            },
          },
        ],
      },
    ],
  },
  {
    key: "bps",
    type: "section",
    label: "BioPsychoSocial",
    value: [
      {
        key: "psychologicalFactors",
        type: "subSection",
        label: "Psychological Factors (Mental Health and Emotional Well-being):",
        value: [
          {
            key: "presentingProblem",
            type: "textarea",
            kind: "text",
            label: "Presenting Problem:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="66bd3d4e-9003-45fe-b5b9-a56c7cb5a42e"] input',
            },
          },
          {
            key: "mentalHealthDiagnosis",
            type: "textarea",
            kind: "text",
            label: "Mental Health Diagnosis:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="50b24a9c-a6a9-44f4-96b4-860b9b5a68da"] input',
            },
          },
          {
            key: "previousPsychologicalTreatment",
            type: "textarea",
            kind: "text",
            label: "Previous Psychological Treatment:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="7c441203-3880-4fc4-9a62-6c6ca94edd53"] textarea',
            },
          },
          {
            key: "symptomsAndBehaviors",
            type: "textarea",
            kind: "text",
            label: "Symptoms and Behaviors:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="d4602a95-1c5f-4f73-aa89-3d59ae3afccd"] textarea',
            },
          },
          {
            key: "copingSkills",
            type: "textarea",
            kind: "text",
            label: "Coping Skills:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="f3ee65dc-ec06-4a3c-b4bd-1496aa15ab8d"] input',
            },
          },
          {
            key: "sleepPatterns",
            type: "textarea",
            kind: "text",
            label: "Sleep Patterns:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="fd49f9d6-25f4-40ec-addf-94750b19451f"] input',
            },
          },
          {
            key: "cognitiveFunctioning",
            type: "textarea",
            kind: "text",
            label: "Cognitive Functioning:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="fc3e8249-910d-416f-a72a-85365ccf4450"] input',
            },
          },
          {
            key: "eatingPatterns",
            type: "textarea",
            kind: "text",
            label: "Eating Patterns:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="0a780aec-9062-4bc9-ba35-edea18b8d028"] input',
            },
          },
          {
            key: "exerciseRoutine",
            type: "textarea",
            kind: "text",
            label: "Exercise Routine:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="2c6a5645-ac24-4e93-a947-281719b23d01"] input',
            },
          },
          {
            key: "traumaHistory",
            type: "textarea",
            kind: "text",
            label: "Trauma History:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="8426aced-67c7-46d1-afa9-12e5bb7508c3"] textarea',
            },
          },
        ],
      },
      {
        key: "biographicalInformation",
        type: "subSection",
        label: "Biographical Information:",
        value: [
          {
            key: "currentLivingSituation",
            type: "textarea",
            kind: "text",
            label: "Current Living Situation:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="3efad302-16f5-4496-80ff-ad2c08cff590"] input',
            },
          },
          {
            key: "maritalStatus",
            type: "textarea",
            kind: "text",
            label: "Marital Status:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="f8cd062a-0d41-412e-bfa6-c166fcec9dd5"] input',
            },
          },
          {
            key: "children",
            type: "textarea",
            kind: "text",
            label: "Children:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="79a53498-193a-4208-b19b-53d7132199a8"] textarea',
            },
          },
          {
            key: "employmentStatus",
            type: "textarea",
            kind: "text",
            label: "Employment Status:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="4a2059b4-30f0-4f1e-bfc6-de8a9eb31181"] input',
            },
          },
          {
            key: "educationLevel",
            type: "textarea",
            kind: "text",
            label: "Education Level:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="35822bc0-3183-4e49-8ad0-8437410de126"] input',
            },
          },
        ],
      },
      {
        key: "biologicalFactors",
        type: "subSection",
        label: "Biological Factors (Physical Health and Medical History)",
        value: [
          {
            key: "medicalHistory",
            type: "textarea",
            kind: "text",
            label: "Medical History:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="df7654d3-53b5-4409-9273-973f4aa5726f"] textarea',
            },
          },
          {
            key: "medications",
            type: "textarea",
            kind: "text",
            label: "Are you taking any medication?",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="556265f1-fdf3-464d-9b9a-a310ffcd6df6"] textarea',
            },
          },
          {
            key: "familyMedicalHistory",
            type: "textarea",
            kind: "text",
            label: "Family Medical History:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="70c8737b-e3b7-4639-833b-75c84a49eb44"] textarea',
            },
          },
          {
            key: "physicalDisabilities",
            type: "textarea",
            kind: "text",
            label: "Physical Disabilities:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="cad9baad-a8c4-4616-8014-4e3161e4b1ee"] input',
            },
          },
        ],
      },
      {
        key: "socialFactors",
        type: "subSection",
        label: "Social Factors (Environment and Support System):",
        value: [
          {
            key: "familyRelationships",
            type: "textarea",
            kind: "text",
            label: "Family Relationships:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="8ca31b53-41e1-4088-85c4-97232a4b674b"] textarea',
            },
          },
          {
            key: "socialSupportNetwork",
            type: "textarea",
            kind: "text",
            label: "Social Support Network:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="d9df548f-8aa5-44b9-a49c-58f3790b36b9"] textarea',
            },
          },
          {
            key: "socialAndCulturalInfluences",
            type: "textarea",
            kind: "text",
            label: "Social and Cultural Influences:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="0225a982-83d3-4f17-bfbe-1432e2b9e215"] input',
            },
          },
          {
            key: "workplaceFunctioning",
            type: "textarea",
            kind: "text",
            label: "Workplace Functioning:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="24fc2ecb-cc1a-40d8-879e-f998a60f65f2"] input',
            },
          },
          {
            key: "legalIssues",
            type: "textarea",
            kind: "text",
            label: "Legal Issues:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="835f46a1-9e82-4577-9a0f-8486e281457a"] input',
            },
          },
          {
            key: "financialStatus",
            type: "textarea",
            kind: "text",
            label: "Financial Status:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="6fa39aa3-d4ff-49d5-bfec-a4f30475068a"] input',
            },
          },
        ],
      },
      {
        key: "riskAndProtectiveFactors",
        type: "subSection",
        label: "Risk and Protective Factors",
        value: [
          {
            key: "riskFactors",
            type: "subSubSection",
            label: "Risk Factors",
            value: [
              {
                key: "suicidalIdeation",
                type: "textarea",
                kind: "text",
                label: "Suicidal Ideation:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="5f52dbff-d7cd-4d13-84f4-e7f41a2cb32e"] input',
                },
              },
              {
                key: "selfHarm",
                type: "textarea",
                kind: "text",
                label: "Self Harm:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="e8a4b399-dbfa-4ff5-8695-e8dda0688700"] input',
                },
              },
              {
                key: "violenceOrAggression",
                type: "textarea",
                kind: "text",
                label: "Violence or Aggression/Homicidal Ideation:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="6e2b1d2a-6874-4d5d-abda-ba39bab5bb8c"] input',
                },
              },
              {
                key: "poorCopingSkills",
                type: "textarea",
                kind: "text",
                label: "Poor Coping Skills:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="7e59f392-8aa3-4dae-9237-7cdda80e2158"] input',
                },
              },
            ],
          },
          {
            key: "protectiveFactors",
            type: "subSubSection",
            label: "Protective Factors",
            value: [
              {
                key: "strengths",
                type: "textarea",
                kind: "text",
                label: "Strengths:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="0bd3aab1-287c-42e1-b2b4-bcc37c0ccb1c"] input',
                },
              },
              {
                key: "hobbies",
                type: "textarea",
                kind: "text",
                label: "Hobbies:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="3a45d77b-9e7f-4867-a23d-80a2072b8616"] input',
                },
              },
              {
                key: "motivationForChange",
                type: "textarea",
                kind: "text",
                label: "Motivation for Change:",
                ehrFields: {
                  type: "input",
                  selector: 'div[data-guid="be13695c-daeb-4797-a991-24f8afe8cc3b"] input',
                },
              },
            ],
          },
        ],
      },
      {
        key: "treatmentPlan",
        type: "subSection",
        label: "Treatment Plan and Goals:",
        value: [
          {
            key: "treatmentGoals",
            type: "textarea",
            kind: "text",
            label: "Treatment Goals:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="18663978-7a6b-488e-a9c4-75cc32592313"] input',
            },
          },
          {
            key: "recommendedInterventions",
            type: "textarea",
            kind: "text",
            label: "Recommended Interventions:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="ecec4dd9-c655-43a1-9377-242f14e6fe11"] input',
            },
          },
          {
            key: "followUpPlans",
            type: "textarea",
            kind: "text",
            label: "Follow-up Plans:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="3ee83d5e-997b-4144-bd29-5f0026d8db0c"] input',
            },
          },
        ],
      },
      {
        key: "summaryAndConclusions",
        type: "subSection",
        label: "Summary and Conclusions:",
        value: [
          {
            key: "clinicalImpressions",
            type: "textarea",
            kind: "text",
            label: "Clinical Impressions:",
            ehrFields: {
              type: "input",
              selector: 'div[data-guid="3a67b188-57b7-4260-9b0f-7b76ef15ec7a"] textarea',
            },
          },
        ],
      },
    ],
  },
  {
    key: "substanceUseHistory",
    type: "section",
    label: "Substance Use History",
    value: [
      {
        key: "substanceUseHistory",
        type: "listOfValues",
        label: "",
        ehrFields: {
          type: "form",
          selector: 'form[data-qa-id="substance-abuse-form"]',
          submitButtonSelector: 'button[data-qa-id="create-button"]',
        },
        value: [
          {
            key: "substanceUsed",
            type: "input",
            kind: "text",
            label: "Substance Used",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="substance-used-input"]',
            },
          },
          {
            key: "daysUsedInTheLast30Days",
            type: "input",
            kind: "text",
            label: "Days Used in the Last 30 Days",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="days-used-input"]',
            },
          },
          {
            key: "routeOfUse",
            type: "input",
            kind: "text",
            label: "Route of Use",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="route-of-use-input"]',
            },
          },
          {
            key: "usualAmountUsedInA24HourDay",
            type: "input",
            kind: "text",
            label: "Usual Amount Used in a 24 Hour Day",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="amount-used-input"]',
            },
          },
          {
            key: "dateOfLastUse",
            type: "input",
            kind: "text",
            label: "Date of Last Use",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="last-use-date-input"]',
            },
          },
          {
            key: "ageFirstUsed",
            type: "input",
            kind: "text",
            label: "Age First Used",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="first-used-age-input"]',
            },
          },
          {
            key: "yearsOfUse",
            type: "input",
            kind: "text",
            label: "Years of Use",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="years-of-use-input"]',
            },
          },
          {
            key: "methodOfAcquiringSubstance",
            type: "input",
            kind: "text",
            label: "Method of Acquiring Substance",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="acquiring-method-input"]',
            },
          },
          {
            key: "patternOfUse",
            type: "input",
            kind: "text",
            label: "Pattern of Use",
            ehrFields: {
              type: "select",
              selector: 'select[data-qa-id="pattern-of-use-select"]',
            },
          },
        ],
      },
    ],
  },
  {
    key: "previousTreatments",
    type: "section",
    label: "Previous Treatments",
    value: [
      {
        key: "previousTreatments",
        type: "listOfValues",
        label: "",
        ehrFields: {
          type: "form",
          selector: 'form[data-qa-id="previous-treatment-form-inputs"]',
          submitButtonSelector: 'button[data-qa-id="previous-treatment-save-button"]',
        },
        value: [
          {
            key: "tXCenterName",
            type: "input",
            kind: "text",
            label: "TX Center Name",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="previous-treatment-center-name-input"]',
            },
          },
          {
            key: "duration",
            type: "input",
            kind: "text",
            label: "Duration",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="previous-treatment-duration-input"]',
            },
          },
          {
            key: "levelOfCare",
            type: "input",
            kind: "text",
            label: "Level of Care",
            ehrFields: {
              type: "input",
              selector: 'input[data-qa-id="previous-treatment-level-of-care-input"]',
            },
          },
          {
            key: "responseToPreviousTreatment",
            type: "textarea",
            kind: "text",
            label:
              "What was the response to previous treatment? How long did you stay sober after discharge?",
            ehrFields: {
              type: "textarea",
              selector: 'textarea[data-qa-id="previous-treatment-response-input"]',
            },
          },
        ],
      },
    ],
  },
  {
    key: "physicalPain",
    type: "section",
    label: "Physical Pain",
    ehrFields: {
      sectionEditable: true,
      editBtnSelector: '.physcintake-top .editbtn a[ng-show="divViewPhysicalPain"]',
      editActiveAttribute: "divEditPhysicalPain",
    },
    value: [
      {
        key: "painScale",
        type: "input",
        kind: "text",
        label: "Pain Scale",
        ehrFields: {
          type: "input",
          selector: 'input[ng-model="bioIntakePhysicalPainModel.PhysicalPain"]',
        },
      },
      {
        key: "planForPain8OrHigher",
        type: "textarea",
        kind: "text",
        label: "Plan for Pain 8 or higher",
        ehrFields: {
          type: "input",
          selector: 'textarea[ng-model="bioIntakePhysicalPainModel.PainPlan"]',
        },
      },
    ],
  },
  {
    key: "nutritionalSelfAssessment",
    type: "section",
    label: "Nutritional Self Assessment",
    ehrFields: {
      sectionEditable: true,
      editBtnSelector: '.physcintake-top .editbtn a[ng-show="divViewNutritionalSelfAssessment"]',
      editActiveAttribute: "divViewNutritionalSelfAssessment",
    },
    value: [
      {
        key: "lost10lbsInPastMonth",
        type: "checkbox",
        label: "Have you intentionally lost>10lbs in past month?",
        ehrFields: {
          type: "input",
          selector: 'input[ng-model="bioIntakeNutritionalAssessmentModel.HaveLostWeight"]',
        },
      },
      {
        key: "considersUnderweightOrMalnourished",
        type: "checkbox",
        label: "Do you consider yourself to be underweight or malnourished?",
        ehrFields: {
          type: "input",
          selector: 'input[ng-model="bioIntakeNutritionalAssessmentModel.IsUnderwieght"]',
        },
      },
      {
        key: "difficultySwallowing",
        type: "checkbox",
        label: "Do you have difficulty swallowing?",
        ehrFields: {
          type: "input",
          selector: 'input[ng-model="bioIntakeNutritionalAssessmentModel.IsDifficultySwallowing"]',
        },
      },
      {
        key: "nutritionalOrDietaryConcerns",
        type: "checkbox",
        label: "Do you have nutritional or dietary concerns?",
        ehrFields: {
          type: "input",
          selector: 'input[ng-model="bioIntakeNutritionalAssessmentModel.HaveDietaryConcerns"]',
        },
      },
    ],
  },
  {
    key: "snagSnap",
    type: "section",
    label: "SNAP/SNAP",
    ehrFields: {
      sectionEditable: true,
      editBtnSelector: '.physcintake-top .editbtn a[ng-show="divViewSNAP"]',
      editActiveAttribute: "divViewSNAP",
    },
    value: [
      {
        key: "strengths",
        type: "textarea",
        kind: "text",
        label: "Strengths",
        ehrFields: {
          type: "input",
          selector: 'textarea[ng-model="bioIntakeSNAPModel.Strengths"]',
        },
      },
      {
        key: "needs",
        type: "textarea",
        kind: "text",
        label: "Needs",
        ehrFields: {
          type: "input",
          selector: 'textarea[ng-model="bioIntakeSNAPModel.Needs"]',
        },
      },
      {
        key: "abilities",
        type: "textarea",
        kind: "text",
        label: "Abilities",
        ehrFields: {
          type: "input",
          selector: 'textarea[ng-model="bioIntakeSNAPModel.Abilities"]',
        },
      },
      {
        key: "goals",
        type: "textarea",
        kind: "text",
        label: "Goals",
        ehrFields: {
          type: "input",
          selector: 'textarea[ng-model="bioIntakeSNAPModel.Preferences"]',
        },
      },
    ],
  },
];

export default bpsTemplateSchema;
