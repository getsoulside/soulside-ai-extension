import { FollowUpAssessmentProps } from "./FollowUpAssessment";

const useFollowUpAssessment = ({ notesData }: FollowUpAssessmentProps): any => {
  const subjectiveOrder = [
    "chief_complaint",
    "appetite",
    "sleep",
    "current_medications",
    "medication_compliance",
    "side_effects",
  ];

  const objectiveOrder = [
    "orientation",
    "rapport",
    "appearance",
    "mood",
    "affect",
    "speech",
    "thought_content_and_process",
    "hallucination_type(s)",
    "hallucination_type",
    "hallucination_types",
    "insight",
    "judgment",
    "cognitive",
    "psychomotor_activity",
    "memory",
  ];

  const assessmentOrder = [
    "Current Diagnosis",
    "Current Diagnoses",
    "DSM-5 Diagnoses",
    "DSM-5 Diagnosis",
    "Suggested ICD & CPT codes",
  ];

  const planOrder = ["follow_up_plans", "homework_assignments"];

  const jsonSoapNotes = notesData?.jsonSoapNote;

  const subjectiveData = jsonSoapNotes?.subjective || null;
  const objectiveData = jsonSoapNotes?.objective || null;
  const assessmentData = jsonSoapNotes?.assessment || null;
  const planData = jsonSoapNotes?.plan || null;
  const followUpNotesData = [
    {
      label: "Subjective",
      data: subjectiveData,
    },
    {
      label: "Objective",
      data: objectiveData,
    },
    {
      label: "Assessment",
      data: assessmentData,
    },
    {
      label: "Plan",
      data: planData,
    },
  ];
  const sortSections = (section1: string, section2: string, section: string) => {
    let order =
      section === "Subjective"
        ? subjectiveOrder
        : section === "Objective"
        ? objectiveOrder
        : section === "Assessment"
        ? assessmentOrder
        : section === "Plan"
        ? planOrder
        : [];
    const indexA = order.indexOf(section1);
    const indexB = order.indexOf(section2);
    // If both keys are found in subjectiveOrder, sort based on their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If one of the keys is not found in subjectiveOrder, it should come later
    if (indexA === -1) return 1; // a is extra, so it should come after b
    if (indexB === -1) return -1; // b is extra, so a should come first

    return 0;
  };
  return { followUpNotesData, sortSections };
};

export default useFollowUpAssessment;
