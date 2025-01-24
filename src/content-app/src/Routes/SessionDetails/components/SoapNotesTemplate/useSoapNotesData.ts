const useSoapNotesData = (props: any) => {
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

  const subjectiveData = props.data?.subjective || props.data?.Subjective || null;
  const objectiveData = props.data?.objective || props.data?.Objective || null;
  const assessmentData = props.data?.assessment || props.data?.Assessment || null;
  const planData = props.data?.plan || props.data?.Plan || null;
  const notesData = [
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
  return { notesData, sortSections };
};

export default useSoapNotesData;

export const convertToTitleCase = (str: string) => {
  return str
    .split("_") // Split the string by underscores
    .map(
      (
        word // Map over each word
      ) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter and make the rest lowercase
    )
    .join(" "); // Join the words back with spaces
};
