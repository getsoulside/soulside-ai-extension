export const intakeAssessmentTabs = [
  {
    name: "HPI Note",
    content: [
      {
        key: "intakeHPINote",
        type: "paragraph",
        name: "History of Present Illness",
      },
    ],
  },
  {
    name: "Behavioral Health Screening",
    content: [
      {
        key: "Behavioral_Health_Screening",
        name: "",
        type: "mixed_content",
        subContent: [
          {
            key: "behavioral_health_screening",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "behavioralHealthScreening",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "data",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "note",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "sections",
            name: "",
            type: "list_of_single_choice_questions",
          },
        ],
      },
      {
        key: "Behavioral_Health_Screening",
        name: "",
        type: "single_choice_question",
      },
      {
        key: "Behavioral_Health_Screening",
        name: "",
        type: "list_of_single_choice_questions",
      },
    ],
  },
  {
    name: "Risk Screening",
    content: [
      {
        key: "Risk_Screening_Tables",
        name: "",
        type: "list_of_tables",
        tables: [
          { key: "Suicidal_Ideation_Table", name: "Suicidal Ideation" },
          { key: "Suicide_Attempts_Table", name: "Suicide Attempts" },
          { key: "Self-Injurious_Behavior_Table", name: "Self-Injurious Behavior" },
          { key: "Aggression_Table", name: "Aggression" },
          { key: "Homicidal_Ideation_Table", name: "Homicidal Ideation" },
          { key: "Risk_Taking_Behaviors_Table", name: "Risk Taking Behaviors" },
          { key: "Family_History_Table", name: "Family History" },
          { key: "Substance_Use_History_Table", name: "Substance Use History" },
          { key: "Work_and_Financial_Struggles_Table", name: "Work and Financial_Struggles" },
        ],
      },
      {
        key: "Risk_Screening",
        name: "",
        type: "mixed_content",
        subContent: [
          {
            key: "Risk_factors",
            name: "Risk Factors",
            type: "list_of_single_choice_questions",
          },
          {
            key: "Protective_Factors",
            name: "Protective Factors",
            type: "list_of_single_choice_questions",
          },
          {
            key: "Based on your answers to the risk screening questions above, how can you keep yourself safe?",
            name: "Based on your answers to the risk screening questions above, how can you keep yourself safe?",
            type: "list_of_single_choice_questions",
          },
        ],
      },
    ],
  },
  {
    name: "Trauma Screening",
    content: [
      {
        key: "Trauma_Screening",
        name: "",
        type: "mixed_content",
        subContent: [
          {
            key: "trauma_screening",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "sections",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "data",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "note",
            name: "",
            type: "list_of_single_choice_questions",
          },
        ],
      },
      {
        key: "Trauma_Screening",
        name: "",
        type: "single_choice_question",
      },
    ],
  },
  {
    name: "Previous Treatment History",
    content: [
      {
        key: "Previous_Treatment_History_Tables",
        name: "",
        type: "list_of_tables",
        tables: [
          { key: "Program", name: "Program" },
          { key: "Therapist", name: "Therapist" },
          { key: "Psychiatrist", name: "Psychiatrist" },
          { key: "Dietitian", name: "Dietitian" },
          { key: "Physician", name: "Physician" },
          { key: "Other_Program", name: "Other Program" },
          { key: "Other_Practitioner", name: "Other Practitioner" },
        ],
      },
    ],
  },
  {
    name: "Medical Intake",
    content: [
      {
        key: "Medical_Intake",
        name: "",
        type: "mixed_content",
        subContent: [
          {
            key: "Allergies_Table",
            name: "Allergies",
            type: "table",
          },
          {
            key: "General",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "Developmental_History",
            name: "Developmental History",
            type: "list_of_single_choice_questions",
          },
          {
            key: "Medication",
            name: "Medication",
            type: "list_of_single_choice_questions",
          },
        ],
      },
    ],
  },
  {
    name: "Family and Social History",
    content: [
      {
        key: "Family_and_Social_History",
        name: "",
        type: "mixed_content",
        subContent: [
          {
            key: "family_and_social_history",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "sections",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "data",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "note",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "Family and Social History",
            name: "",
            type: "list_of_single_choice_questions",
          },
        ],
      },
      {
        key: "Family_and_Social_History",
        name: "",
        type: "single_choice_question",
      },
    ],
  },
  {
    name: "Substance Use History and Patterns of Use",
    content: [
      {
        key: "Substance_Use_History_and_Patterns_of_Use_Tables",
        name: "",
        type: "list_of_tables",
        tables: [
          { key: "Opioids", name: "Opioids" },
          { key: "Depressants", name: "Depressants" },
          { key: "Stimulants", name: "Stimulants" },
          { key: "Hallucinogens", name: "Hallucinogens" },
          { key: "Other Drugs Not Listed", name: "Other Drugs Not Listed" },
          { key: "Nicotine", name: "Nicotine" },
        ],
      },
    ],
  },
  {
    name: "Educational and Employment History",
    content: [
      {
        key: "Educational_and_Employment_History",
        name: "",
        type: "mixed_content",
        subContent: [
          {
            key: "data",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "note",
            name: "",
            type: "list_of_single_choice_questions",
          },
          {
            key: "sections",
            name: "",
            type: "list_of_single_choice_questions",
          },
        ],
      },
      {
        key: "Educational_and_Employment_History",
        name: "",
        type: "list_of_single_choice_questions",
      },
      {
        key: "Educational_and_Employment_History",
        name: "",
        type: "single_choice_question",
      },
    ],
  },
];
