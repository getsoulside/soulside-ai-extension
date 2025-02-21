import BPSTemplate from "@/domains/sessionNotes/models/sessionNotes.bps.types";

const BPSTemplateData: BPSTemplate = {
  snagSnap: {
    abilities: [
      "Demonstrates adequate insight into personal challenges",
      "Capable of engaging in therapeutic activities when motivated",
    ],
    goals: ["Reduce anxiety symptoms", "Improve sleep quality", "Enhance mood stability"],
    needs: [
      "Regular mental health monitoring",
      "Support in developing effective coping strategies",
      "Assistance with medication management",
    ],
    strengths: [
      "Resilient in the face of stress",
      "Highly motivated for personal change",
      "Engages in creative hobbies such as painting",
    ],
  },
  bps: {
    biographicalInformation: {
      children: "None reported",
      currentLivingSituation: "Living with partner in a shared residence",
      educationLevel: "College degree",
      employmentStatus: "Employed part-time",
      maritalStatus: "Single",
    },
    biologicalFactors: {
      familyMedicalHistory: "Family history significant for depression and hypertension",
      medicalHistory: "Hypertension, managed medically; no other chronic illnesses reported",
      medications: [
        "Sertraline 50 mg daily for depressive symptoms (noted mild gastrointestinal upset)",
        "Lisinopril 10 mg daily for hypertension",
      ],
      physicalDisabilities: "No physical disabilities reported",
    },
    psychologicalFactors: {
      cognitiveFunctioning: "Reports difficulty with concentration during periods of high anxiety",
      copingSkills:
        "Utilizes deep breathing exercises but reports difficulty with consistent application; occasionally resorts to avoidance",
      eatingPatterns: "Noted decreased appetite over the last several weeks",
      exerciseRoutine: "Sedentary lifestyle with occasional light physical activity",
      mentalHealthDiagnosis: ["Generalized Anxiety Disorder", "Major Depressive Disorder"],
      presentingProblem:
        "The Patient reports persistent anxiety, difficulty falling asleep, intrusive and negative thoughts, low mood, and feelings of inadequacy. Interpersonal conflicts and recent financial stressors appear to exacerbate these symptoms.",
      previousPsychologicalTreatment:
        "Previously engaged in outpatient cognitive behavioral therapy at ABC Mental Health Clinic for approximately 6 months; also attended group therapy sessions with moderate improvement.",
      sleepPatterns:
        "Reports difficulty initiating sleep and frequent awakenings throughout the night",
      symptomsAndBehaviors:
        "Symptoms include pervasive anxiety, restlessness, irritability, concentration difficulties, and intermittent passive suicidal ideation without active intent. There is also a reported decrease in appetite and energy.",
      traumaHistory:
        "Reports a history of emotional neglect during childhood which may contribute to current interpersonal difficulties",
    },
    riskAndProtectiveFactors: {
      protectiveFactors: {
        hobbies: "Engages in painting and occasional jogging, which serve as creative outlets",
        motivationForChange:
          "Expresses high willingness to engage in treatment and improve overall mental health",
        strengths: "Displays resilience and openness to therapeutic interventions",
      },
      riskFactors: {
        poorCopingSkills:
          "Reports challenges with managing stress and often resorts to avoidance as a coping mechanism",
        selfHarm: "No current or historical evidence of self-harm behaviors",
        suicidalIdeation:
          "Denies active suicidal ideation; however, admits to experiencing passive thoughts during peak depressive episodes",
        violenceOrAggression: "No history or current evidence of violent or aggressive behavior",
      },
    },
    socialFactors: {
      familyRelationships:
        "Reports strained relationships with immediate family members; limited contact due to past conflicts",
      financialStatus:
        "Experiencing financial stress due to reduced work hours and income instability",
      legalIssues: "No ongoing legal issues reported",
      socialAndCulturalInfluences:
        "Functions within a multicultural environment; cultural values influence coping and worldview without apparent conflict",
      socialSupportNetwork:
        "Maintains a supportive network of friends and community groups; however, occasional feelings of isolation are reported",
      workplaceFunctioning:
        "Overall functioning at work is satisfactory but stressors related to workload contribute to anxiety",
    },
    summaryAndConclusions: {
      clinicalImpressions:
        "The Patient presents with a clinical picture consistent with Generalized Anxiety Disorder and Major Depressive Disorder. Key concerns include sleep disturbances, concentration difficulties, and interpersonal stress. Financial and familial stressors may further impair psychological functioning. A comprehensive treatment plan including psychotherapy and medication management is recommended.",
    },
    treatmentPlan: {
      followUpPlans: [
        "Weekly follow-up sessions to monitor progress and adjust treatment interventions as needed",
      ],
      recommendedInterventions: [
        "Individual cognitive behavioral therapy",
        "Medication management review with possible dosage adjustment",
        "Consideration of mindfulness-based stress reduction techniques",
      ],
      treatmentGoals: [
        "Improve sleep continuity and quality",
        "Reduce symptoms of anxiety and depressive mood",
        "Enhance adaptive coping strategies for managing interpersonal and financial stressors",
      ],
    },
  },
  diagnosisProblems: {
    diagnosisProblems: [
      {
        ICD10_DSM5_Code: "F41.1",
        problemName: "Generalized Anxiety Disorder",
        problemGroup: "Anxiety Disorders",
        priority: "Primary",
      },
      {
        ICD10_DSM5_Code: "F33.1",
        problemName: "Major Depressive Disorder, Moderate",
        problemGroup: "Mood Disorders",
        priority: "Secondary",
      },
    ],
  },
  nutritionalSelfAssessment: {
    considersUnderweightOrMalnourished: false,
    difficultySwallowing: false,
    lost10lbsInPastMonth: true,
    nutritionalOrDietaryConcerns: false,
  },
  physicalPain: {
    painScale: "2",
    planForPain8OrHigher: "Pain is minimal at this time; no advanced pain management required",
  },
  previousTreatments: {
    previousTreatments: [
      {
        tXCenterName: "ABC Mental Health Clinic",
        duration: "6 months",
        levelOfCare: "Outpatient",
        responseToPreviousTreatment:
          "The Patient experienced moderate improvement, though residual symptoms persisted post-treatment",
      },
    ],
  },
  substanceUseHistory: {
    substanceUseHistory: [
      {
        substanceUsed: "Marijuana",
        daysUsedInTheLast30Days: "3",
        routeOfUse: "Inhalation",
        usualAmountUsedInA24HourDay: "One joint",
        dateOfLastUse: "2023-10-05",
        ageFirstUsed: "18",
        yearsOfUse: "8",
        methodOfAcquiringSubstance: "Purchased from local dispensary",
        patternOfUse: "Episodic",
      },
    ],
  },
};

export default BPSTemplateData;
