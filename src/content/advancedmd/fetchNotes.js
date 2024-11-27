import { TEMPLATE_NAME, CHIEF_COMPLAINT_FIELD_ID } from "./constants";
import { getSoulsideNotes } from "../../modules/fetchSoulsideNotes";

let notesData = {};

export const fetchSessionNotes = async doc => {
  if (doc !== undefined && !!doc) {
    let visitId = doc.querySelector('input[name="hidParentID"]')?.value;
    let templateName = doc.querySelector('input[name="hidTemplateName"]')?.value;
    let advancedMdchiefComplaintElem = doc.querySelector(
      `textarea[name="${CHIEF_COMPLAINT_FIELD_ID}"]`
    );
    let advancedMdChiefComplaintValue = advancedMdchiefComplaintElem?.value || "";
    let soulsideAINoteElem = doc.querySelector("#soulsideAINote");
    if (visitId && templateName === TEMPLATE_NAME) {
      if (!notesData?.[visitId]?.loading && !notesData?.[visitId]?.soulsideChiefComplaint) {
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
        let soulsideChiefComplaint = await getSoulsideNotes(visitId);
        if (!soulsideChiefComplaint) {
          retryFetchNotes(doc, visitId);
        }
        notesData = {
          ...notesData,
          [visitId]: notesData[visitId]
            ? {
                ...notesData[visitId],
                soulsideChiefComplaint,
                loading: false,
              }
            : {
                soulsideChiefComplaint,
                loading: false,
              },
        };
      }
      if (advancedMdchiefComplaintElem) {
        let soulsideChiefComplaint = notesData?.[visitId]?.soulsideChiefComplaint || "";
        if (!soulsideAINoteElem) {
          createSoulsideAINoteElem(doc, advancedMdchiefComplaintElem, soulsideChiefComplaint);
        }
        soulsideAINoteElem = doc.querySelector("#soulsideAINote");
        if (soulsideAINoteElem) {
          const ccTextarea = soulsideAINoteElem.querySelector("#ccTextarea");
          const acceptButton = soulsideAINoteElem.querySelector("#acceptButton");
          if (soulsideChiefComplaint) {
            ccTextarea.readOnly = false;
            ccTextarea.value = soulsideChiefComplaint;
            acceptButton.style.display = "block";
          } else {
            ccTextarea.readOnly = true;
            ccTextarea.value = "Generating AI Notes...";
            acceptButton.style.display = "none";
          }
        }
      }
    }
  }
};

const createSoulsideAINoteElem = (doc, advancedMdchiefComplaintElem, chiefComplaint) => {
  const aiNoteElem = doc.createElement("div");
  aiNoteElem.id = "soulsideAINote";
  aiNoteElem.style.position = "absolute";
  aiNoteElem.style.top = `calc(${advancedMdchiefComplaintElem.style.top} - 20px)`;
  aiNoteElem.style.left = `calc(${advancedMdchiefComplaintElem.style.left} + 20px + ${advancedMdchiefComplaintElem.style.width})`;
  aiNoteElem.innerHTML = `
    <div style="color:#232323;font-size:14px;font-weight:700;">Soulside AI</div>
    <textarea id="ccTextarea" style="background-color:White;height:90px;width:540px;left:10px;top:80px;margin-top:5px;resize:auto">${chiefComplaint}</textarea>
    <div style="display:flex;margin-top:5px;align-items:center;gap:10px;">
      <div id="acceptButton" style="background-color:#71ab62;padding:5px;border:1px solid #71ab62;border-radius:3px;font-size:12px;color:#fff;cursor:pointer">Add to Notes</div>
    </div>
  `;
  advancedMdchiefComplaintElem.insertAdjacentElement("afterend", aiNoteElem);
  const acceptButton = aiNoteElem.querySelector("#acceptButton");
  const ccTextarea = aiNoteElem.querySelector("#ccTextarea");
  const acceptNotes = () => {
    const ccValue = ccTextarea.value;
    if (ccValue) {
      advancedMdchiefComplaintElem.value =
        (advancedMdchiefComplaintElem?.value || "") + "\n\n" + ccValue;
    }
    acceptButton.innerHTML = "Added to Notes";
    acceptButton.removeEventListener("click", acceptNotes);
  };
  acceptButton.removeEventListener("click", acceptNotes);
  acceptButton.addEventListener("click", acceptNotes);
};

const retryFetchNotes = (doc, visitId) => {
  setTimeout(() => {
    if (doc !== undefined && !!doc) {
      let visitIdInputValue = doc.querySelector('input[name="hidParentID"]')?.value;
      let templateName = doc.querySelector('input[name="hidTemplateName"]')?.value;
      if (visitIdInputValue && visitIdInputValue === visitId && templateName === TEMPLATE_NAME) {
        fetchSessionNotes(doc);
      }
    }
  }, 30000);
};
