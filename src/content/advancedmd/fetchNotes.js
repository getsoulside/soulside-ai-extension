import { FOLLOW_UP_NOTES_TEMPLATES, INTAKE_NOTES_TEMPLATES } from "./constants";
import { getSoulsideData } from "../../modules/fetchSoulsideNotes";

let notesData = {};

export const fetchSessionNotes = async doc => {
  if (doc !== undefined && !!doc && doc.defaultView && doc.defaultView.frameElement) {
    let visitId = doc.querySelector('input[name="hidParentID"]')?.value;
    let templateName = doc.querySelector('input[name="hidTemplateName"]')?.value;
    let amdNoteId = doc.querySelector('input[name="hidNoteID"]')?.value;
    if (
      visitId &&
      (FOLLOW_UP_NOTES_TEMPLATES.includes(templateName) ||
        INTAKE_NOTES_TEMPLATES.includes(templateName))
    ) {
      const isIntakeNote = INTAKE_NOTES_TEMPLATES.includes(templateName);
      let soulsideAINoteElem = doc.querySelector(`#soulsideAINote-${amdNoteId}`);
      if (!notesData?.[visitId]?.loading && !notesData?.[visitId]?.soulsideNotes) {
        notesData = {
          ...notesData,
          [visitId]: notesData[visitId]
            ? {
                ...notesData[visitId],
                loading: true,
              }
            : {
                loading: true,
              },
        };
        try {
          let soulsideData = await getSoulsideData(visitId);
          notesData = {
            ...notesData,
            [visitId]: notesData[visitId]
              ? {
                  ...notesData[visitId],
                  ...soulsideData,
                  loading: false,
                }
              : {
                  ...soulsideData,
                  loading: false,
                },
          };
        } catch (error) {
          console.error("Soulside Data Fetch Error:", error);
          let authError = false;
          let noteError = "";
          if (
            error?.code === "AUTH_ERROR" ||
            error?.message?.includes("No Visit Reconciliation Found")
          ) {
            if (error?.code === "AUTH_ERROR") {
              authError = true;
              noteError = "Soulside login expired. Please login again.";
            } else {
              noteError = error?.message || "Error fetching note";
            }
          } else {
            retryFetchNotes(doc, visitId);
          }
          notesData = {
            ...notesData,
            [visitId]: notesData[visitId]
              ? {
                  ...notesData[visitId],
                  loading: false,
                  error: noteError,
                  authError,
                }
              : {
                  loading: false,
                  error: noteError,
                  authError,
                },
          };
        }
      }
      let advancedMdchiefComplaintElem = null;
      let advancedMdchiefComplaintLabelElem = Array.from(doc.querySelectorAll("span, div")).find(
        elem =>
          elem.innerText.trim() ===
          (isIntakeNote ? "History of Present Illness" : "Chief Complaint")
      );
      if (advancedMdchiefComplaintLabelElem) {
        advancedMdchiefComplaintElem =
          advancedMdchiefComplaintLabelElem.nextElementSibling?.tagName === "TEXTAREA"
            ? advancedMdchiefComplaintLabelElem.nextElementSibling
            : advancedMdchiefComplaintLabelElem.parentElement.querySelector("textarea");
      }
      if (advancedMdchiefComplaintElem) {
        let soulsideChiefComplaint =
          notesData?.[visitId]?.soulsideNotes?.jsonSoapNote?.chiefCompliantEnhanced ||
          notesData?.[visitId]?.soulsideNotes?.jsonSoapNote?.subjective?.chief_complaint?.result ||
          notesData?.[visitId]?.soulsideNotes?.jsonSoapNote?.Subjective?.chief_complaint?.result ||
          "";
        let soulsideHpiNote =
          notesData?.[visitId]?.soulsideNotes?.jsonSoapNote?.intakeHPINote ||
          notesData?.[visitId]?.soulsideNotes?.jsonSoapNote?.["intake-assessment"]?.intakeHPINote ||
          "";
        let soulsideTreatmentPlan = notesData?.[visitId]?.soulsideTreatmentPlan || null;
        let error = notesData?.[visitId]?.error;
        let authError = notesData?.[visitId]?.authError;
        if (!soulsideAINoteElem && !notesData?.[visitId]?.loading) {
          createSoulsideAINoteElem(
            doc,
            amdNoteId,
            advancedMdchiefComplaintElem,
            {
              soulsideChiefComplaint,
              soulsideHpiNote,
              soulsideTreatmentPlan,
            },
            isIntakeNote
          );
        }
        soulsideAINoteElem = doc.querySelector(`#soulsideAINote-${amdNoteId}`);
        if (soulsideAINoteElem) {
          const soulsideNoteTabsContainer = soulsideAINoteElem.querySelector(
            "#soulsideNoteTabsContainer"
          );
          const ccTextarea = soulsideAINoteElem.querySelector("#ccTextarea");
          const hpiTextarea = soulsideAINoteElem.querySelector("#hpiTextarea");
          const treatmentPlanContainer = soulsideAINoteElem.querySelector(
            "#treatmentPlanSoulsideTabContent"
          );
          const acceptButton = soulsideAINoteElem.querySelector("#acceptButton");
          const soulsideNoteError = soulsideAINoteElem.querySelector("#soulsideNoteError");
          const retrySoulsideNotesButton = soulsideAINoteElem.querySelector(
            "#retrySoulsideNotesButton"
          );
          const soulsideAuthErrorButton = soulsideAINoteElem.querySelector(
            "#soulsideAuthErrorButton"
          );
          if (
            soulsideChiefComplaint ||
            soulsideHpiNote ||
            soulsideTreatmentPlan?.plan?.problems?.length > 0
          ) {
            soulsideNoteTabsContainer.style.display = "block";
            soulsideNoteError.style.display = "none";
            retrySoulsideNotesButton.style.display = "none";
            soulsideAuthErrorButton.style.display = "none";
            if (soulsideChiefComplaint) {
              if (ccTextarea) {
                ccTextarea.readOnly = false;
                ccTextarea.value = soulsideChiefComplaint;
              }
              if (acceptButton) {
                acceptButton.style.display = "block";
              }
            } else {
              if (ccTextarea) {
                ccTextarea.readOnly = true;
                ccTextarea.value = "Generating AI Notes...";
              }
              if (acceptButton) {
                acceptButton.style.display = "none";
              }
            }
            if (soulsideHpiNote) {
              if (hpiTextarea) {
                hpiTextarea.readOnly = false;
                hpiTextarea.value = soulsideHpiNote;
              }
            } else {
              if (hpiTextarea) {
                hpiTextarea.readOnly = true;
                hpiTextarea.value = "Generating AI Notes...";
              }
            }
            if (soulsideTreatmentPlan?.plan?.problems?.length > 0) {
              if (treatmentPlanContainer) {
                treatmentPlanContainer.innerHTML = getTreatmentPlanHtml(soulsideTreatmentPlan);
              }
            } else {
              if (treatmentPlanContainer) {
                treatmentPlanContainer.innerHTML = getTreatmentPlanHtml(soulsideTreatmentPlan);
              }
            }
          } else {
            if (error) {
              soulsideNoteTabsContainer.style.display = "none";
              soulsideNoteError.style.display = "block";
              soulsideNoteError.innerHTML = error;
              if (authError) {
                retrySoulsideNotesButton.style.display = "none";
                soulsideAuthErrorButton.style.display = "block";
              } else {
                retrySoulsideNotesButton.style.display = "block";
                soulsideAuthErrorButton.style.display = "none";
              }
            } else {
              soulsideNoteError.style.display = "none";
              retrySoulsideNotesButton.style.display = "none";
              soulsideAuthErrorButton.style.display = "none";
              if (ccTextarea) {
                ccTextarea.style.display = "block";
                ccTextarea.readOnly = true;
                ccTextarea.value = "Generating AI Notes...";
              }
              if (acceptButton) {
                acceptButton.style.display = "none";
              }
              if (hpiTextarea) {
                hpiTextarea.readOnly = true;
                hpiTextarea.value = "Generating AI Notes...";
              }
              if (treatmentPlanContainer) {
                treatmentPlanContainer.innerHTML = getTreatmentPlanHtml(soulsideTreatmentPlan);
              }
            }
          }
        }
      }
    }
  }
};

const soulsideStyles = `
  <style>
    .soulside-note-widget {
      width: 540px;
    }
    .soulside-widget-title {
      color: #232323;
      font-size: 14px;
      font-weight: 700;
    }
    .soulside-note-error {
      margin: 25px 0;
      color: #da4d06;
    }
    .soulside-note-button {
      width: max-content;
      background-color: #71ab62;
      padding: 5px;
      border: 1px solid #71ab62;
      border-radius: 3px;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      margin-top: 5px;
    }
    .souslide-note-text-area {
      background-color: #fff;
      height: 200px;
      width: 100%;
      resize: auto
    }
    .soulside-note-tabs {
      display: flex;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .soulside-note-tab {
      padding: 10px 15px;
      cursor: pointer;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      margin-right: 5px;
      border-radius: 4px 4px 0 0;
    }
    .soulside-note-tab.active {
      background-color: #71ab62;
      color: white;
    }
    .soulside-note-tab-content {
      display: none;
    }
    .soulside-note-tab-content.active {
      display: block;
    }
    .soulside-treatment-plan-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      background-color: #fff;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #aaa;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container {
      flex: 1;
      overflow: auto;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-input-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-objective-timeline {
      margin-top: 10px;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-input-container .treatment-plan-input {
      background: #fff;
      backdrop-filter: blur(5px);
      color: #232323;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-problems-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-problems-container .treatment-plan-problems-label {
      color: #232323;
      font-weight: 500;
      width: max-content;
      border-bottom: 1px solid #aaa;
      font-size: 14px;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-problems-container .treatment-plan-problems-list {
      display: flex;
      flex-direction: column;
      margin-bottom: 0;
      margin-top: 0;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-problems-container .treatment-plan-problems-list .treatment-plan-problem-item {
      margin-bottom: 10px;
    }
    .soulside-treatment-plan-container .treatment-plan-content-container .treatment-plan-problems-container .treatment-plan-problems-list .treatment-plan-problem-item:last-child {
      margin-bottom: 0px;
    }
  </style>
`;

const createSoulsideAINoteElem = (
  doc,
  amdNoteId,
  advancedMdchiefComplaintElem,
  soulsideData,
  isIntakeNote
) => {
  const {
    soulsideChiefComplaint = "",
    soulsideHpiNote = "",
    soulsideTreatmentPlan = null,
  } = soulsideData || {};
  const aiNoteElem = doc.createElement("div");
  aiNoteElem.id = `soulsideAINote-${amdNoteId}`;
  aiNoteElem.style.position = "absolute";
  aiNoteElem.style.top = `calc(${advancedMdchiefComplaintElem.style.top} - 20px)`;
  aiNoteElem.style.left = `calc(${advancedMdchiefComplaintElem.style.left} + 30px + ${advancedMdchiefComplaintElem.style.width})`;
  aiNoteElem.innerHTML = `
    ${soulsideStyles}
    <div class="soulside-note-widget">
      <div class="soulside-widget-title">Soulside AI</div>
      <div id="soulsideNoteTabsContainer">
        <div id="soulsideNoteTabs" class="soulside-note-tabs">
          ${
            isIntakeNote
              ? `<div class="soulside-note-tab active" data-tab="hpiNote">HPI Note</div>`
              : ""
          }
          <div class="soulside-note-tab ${
            !isIntakeNote ? "active" : ""
          }" data-tab="chiefComplaint">Chief Complaint</div>
          <div class="soulside-note-tab" data-tab="treatmentPlan">Treatment Plan</div>
        </div>
        <div id="soulsideTabContents">
          ${
            isIntakeNote
              ? `<div class="soulside-note-tab-content active" id="hpiNoteSoulsideTabContent">
              <textarea id="hpiTextarea" class="souslide-note-text-area">${soulsideHpiNote}</textarea>
            </div>`
              : ""
          }
          <div class="soulside-note-tab-content ${
            !isIntakeNote ? "active" : ""
          }" id="chiefComplaintSoulsideTabContent">
            <textarea id="ccTextarea" class="souslide-note-text-area">${soulsideChiefComplaint}</textarea>
            ${
              !isIntakeNote
                ? `<div id="acceptButton" class="soulside-note-button">Add to Notes</div>`
                : ``
            }
          </div>
          <div class="soulside-note-tab-content" id="treatmentPlanSoulsideTabContent">
          ${getTreatmentPlanHtml(soulsideTreatmentPlan)}
          </div>
        </div>
      </div>
      <div id="soulsideNoteError" class="soulside-note-error" style="display:none;"></div>
      <div id="retrySoulsideNotesButton" class="soulside-note-button" style="display:none;">Retry</div>
      <div id="soulsideAuthErrorButton" class="soulside-note-button" style="display:none;">Login to Soulside</div>
    </div>
  `;
  advancedMdchiefComplaintElem.insertAdjacentElement("afterend", aiNoteElem);
  // Tab functionality
  const tabs = aiNoteElem.querySelectorAll(".soulside-note-tab");
  const tabContents = aiNoteElem.querySelectorAll(".soulside-note-tab-content");
  const soulsideNoteTabs = aiNoteElem.querySelector("#soulsideNoteTabs");

  // Tab switching logic
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and tab contents
      tabs.forEach(t => t.classList.remove("active"));
      tabContents.forEach(tc => tc.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const tabId = tab.getAttribute("data-tab");
      aiNoteElem.querySelector(`#${tabId}SoulsideTabContent`).classList.add("active");
    });
  });
  const acceptButton = aiNoteElem.querySelector("#acceptButton");
  const ccTextarea = aiNoteElem.querySelector("#ccTextarea");
  const retrySoulsideNotesButton = aiNoteElem.querySelector("#retrySoulsideNotesButton");
  const soulsideAuthErrorButton = aiNoteElem.querySelector("#soulsideAuthErrorButton");
  const acceptNotes = () => {
    const ccValue = ccTextarea.value;
    if (ccValue) {
      advancedMdchiefComplaintElem.value =
        (advancedMdchiefComplaintElem?.value || "") + "\n\n" + ccValue;
    }
    if (acceptButton) {
      acceptButton.innerHTML = "Added to Notes";
      acceptButton.removeEventListener("click", acceptNotes);
    }
  };
  const retryNotes = () => {
    fetchSessionNotes(doc);
  };
  const soulsideLogin = async () => {
    const soulsideNoteError = aiNoteElem.querySelector("#soulsideNoteError");
    let loginPromise = new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "soulsideLoginExpired" }, response => {
        if (response.success) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
    try {
      if (soulsideNoteError) {
        soulsideNoteError.innerHTML = "Logging in...";
      }
      let loggedIn = await loginPromise;
      if (loggedIn) {
        retryNotes();
      }
    } catch (error) {
      if (soulsideNoteError) {
        soulsideNoteError.innerHTML = "Login Failed. Please login again.";
      }
    }
  };
  if (acceptButton) {
    acceptButton.removeEventListener("click", acceptNotes);
    acceptButton.addEventListener("click", acceptNotes);
  }
  retrySoulsideNotesButton.removeEventListener("click", retryNotes);
  retrySoulsideNotesButton.addEventListener("click", retryNotes);
  soulsideAuthErrorButton.removeEventListener("click", soulsideLogin);
  soulsideAuthErrorButton.addEventListener("click", soulsideLogin);
};

const retryFetchNotes = (doc, visitId) => {
  setTimeout(() => {
    if (doc !== undefined && !!doc && doc.defaultView && doc.defaultView.frameElement) {
      let visitIdInputValue = doc.querySelector('input[name="hidParentID"]')?.value;
      let templateName = doc.querySelector('input[name="hidTemplateName"]')?.value;
      if (
        visitIdInputValue &&
        visitIdInputValue === visitId &&
        (FOLLOW_UP_NOTES_TEMPLATES.includes(templateName) ||
          INTAKE_NOTES_TEMPLATES.includes(templateName))
      ) {
        fetchSessionNotes(doc);
      }
    }
  }, 20000);
};

const renderObjectives = objectives => {
  return objectives?.length > 0
    ? `
      <div class="treatment-plan-problems-container">
        <div class="treatment-plan-problems-label">Objectives:</div>
        <ol class="treatment-plan-problems-list">
          ${objectives
            .map(
              objective => `
            <li class="treatment-plan-problem-item">
              <div class="treatment-plan-input-container">
                <div class="treatment-plan-input">
                  ${objective.description}
                </div>
              </div>
              ${
                objective.timeline
                  ? `
                  <div class="treatment-objective-timeline">
                    <strong style="font-weight: 600">Timeline:</strong> ${objective.timeline}
                  </div>
                `
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ol>
      </div>
    `
    : "";
};

const renderGoals = goals => {
  return goals?.length > 0
    ? `
      <div class="treatment-plan-problems-container">
        <div class="treatment-plan-problems-label">Goals</div>
        <ol class="treatment-plan-problems-list">
          ${goals
            .map(
              goal => `
            <li class="treatment-plan-problem-item">
              <div class="treatment-plan-input-container">
                <div class="treatment-plan-input">${goal.description}</div>
              </div>
              ${renderObjectives(goal.objectives)}
            </li>
          `
            )
            .join("")}
        </ol>
      </div>
    `
    : "";
};

const renderInterventions = interventions => {
  return interventions?.length > 0
    ? `
      <div class="treatment-plan-problems-container">
        <div class="treatment-plan-problems-label">Interventions</div>
        <ol class="treatment-plan-problems-list">
          ${interventions
            .map(
              intervention => `
            <li class="treatment-plan-problem-item">
              <div class="treatment-plan-input-container">
                <div class="treatment-plan-input">${intervention}</div>
              </div>
            </li>
          `
            )
            .join("")}
        </ol>
      </div>
    `
    : "";
};

const renderProblems = problems => {
  return problems?.length > 0
    ? `
      <div class="treatment-plan-problems-container">
        <div class="treatment-plan-problems-label">Problems</div>
        <ol class="treatment-plan-problems-list">
          ${problems
            .map(
              problem => `
            <li class="treatment-plan-problem-item">
              <div class="treatment-plan-input-container">
                <div class="treatment-plan-input">${problem.description}</div>
              </div>
              ${renderGoals(problem.goals)}
              ${renderInterventions(problem.interventions)}
            </li>
          `
            )
            .join("")}
        </ol>
      </div>
    `
    : "No Treatment Plan Generated";
};

const getTreatmentPlanHtml = soulsideTreatmentPlan => {
  const problems = soulsideTreatmentPlan?.plan?.treatmentPlanData?.problems;
  return `
    <div class="soulside-treatment-plan-container">
      <div class="treatment-plan-content-container">
        ${renderProblems(problems)}
      </div>
    </div>
  `;
};
