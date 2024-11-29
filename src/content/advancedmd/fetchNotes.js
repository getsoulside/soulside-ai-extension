import { TEMPLATE_NAME } from "./constants";
import { getSoulsideNotes } from "../../modules/fetchSoulsideNotes";

let notesData = {};

export const fetchSessionNotes = async doc => {
  if (doc !== undefined && !!doc && doc.defaultView && doc.defaultView.frameElement) {
    let visitId = doc.querySelector('input[name="hidParentID"]')?.value;
    let templateName = doc.querySelector('input[name="hidTemplateName"]')?.value;
    let amdNoteId = doc.querySelector('input[name="hidNoteID"]')?.value;
    if (visitId && templateName === TEMPLATE_NAME) {
      let soulsideAINoteElem = doc.querySelector(`#soulsideAINote-${amdNoteId}`);
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
        try {
          let soulsideChiefComplaint = await getSoulsideNotes(visitId);
          if (soulsideChiefComplaint) {
            console.log("CC Fetched", { visitId, soulsideChiefComplaint });
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
        } catch (error) {
          console.error("CC Fetch Error:", error);
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
        elem => elem.innerText.trim() === "Chief Complaint"
      );
      if (advancedMdchiefComplaintLabelElem) {
        advancedMdchiefComplaintElem =
          advancedMdchiefComplaintLabelElem.nextElementSibling?.tagName === "TEXTAREA"
            ? advancedMdchiefComplaintLabelElem.nextElementSibling
            : advancedMdchiefComplaintLabelElem.parentElement.querySelector("textarea");
      }
      if (advancedMdchiefComplaintElem) {
        let soulsideChiefComplaint = notesData?.[visitId]?.soulsideChiefComplaint || "";
        let error = notesData?.[visitId]?.error;
        let authError = notesData?.[visitId]?.authError;
        if (!soulsideAINoteElem && !notesData?.[visitId]?.loading) {
          createSoulsideAINoteElem(
            doc,
            amdNoteId,
            advancedMdchiefComplaintElem,
            soulsideChiefComplaint
          );
        }
        soulsideAINoteElem = doc.querySelector(`#soulsideAINote-${amdNoteId}`);
        if (soulsideAINoteElem) {
          const ccTextarea = soulsideAINoteElem.querySelector("#ccTextarea");
          const acceptButton = soulsideAINoteElem.querySelector("#acceptButton");
          const soulsideNoteError = soulsideAINoteElem.querySelector("#soulsideNoteError");
          const retrySoulsideNotesButton = soulsideAINoteElem.querySelector(
            "#retrySoulsideNotesButton"
          );
          const soulsideAuthErrorButton = soulsideAINoteElem.querySelector(
            "#soulsideAuthErrorButton"
          );
          if (soulsideChiefComplaint) {
            ccTextarea.style.display = "block";
            soulsideNoteError.style.display = "none";
            retrySoulsideNotesButton.style.display = "none";
            soulsideAuthErrorButton.style.display = "none";
            ccTextarea.readOnly = false;
            ccTextarea.value = soulsideChiefComplaint;
            acceptButton.style.display = "block";
          } else {
            if (error) {
              ccTextarea.style.display = "none";
              acceptButton.style.display = "none";
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
              ccTextarea.style.display = "block";
              soulsideNoteError.style.display = "none";
              retrySoulsideNotesButton.style.display = "none";
              soulsideAuthErrorButton.style.display = "none";
              ccTextarea.readOnly = true;
              ccTextarea.value = "Generating AI Notes...";
              acceptButton.style.display = "none";
            }
          }
        }
      }
    }
  }
};

const createSoulsideAINoteElem = (doc, amdNoteId, advancedMdchiefComplaintElem, chiefComplaint) => {
  const aiNoteElem = doc.createElement("div");
  aiNoteElem.id = `soulsideAINote-${amdNoteId}`;
  aiNoteElem.style.position = "absolute";
  aiNoteElem.style.top = `calc(${advancedMdchiefComplaintElem.style.top} - 20px)`;
  aiNoteElem.style.left = `calc(${advancedMdchiefComplaintElem.style.left} + 20px + ${advancedMdchiefComplaintElem.style.width})`;
  aiNoteElem.innerHTML = `
    <div style="color:#232323;font-size:14px;font-weight:700;">Soulside AI</div>
    <div id="soulsideNoteError" style="display:none;margin:25px 0;color: #da4d06;"></div>
    <div id="retrySoulsideNotesButton" style="display:none;width:max-content;background-color:#71ab62;padding:5px;border:1px solid #71ab62;border-radius:3px;font-size:12px;color:#fff;cursor:pointer;margin-top:5px;">Retry</div>
    <div id="soulsideAuthErrorButton" style="display:none;width:max-content;background-color:#71ab62;padding:5px;border:1px solid #71ab62;border-radius:3px;font-size:12px;color:#fff;cursor:pointer;margin-top:5px;">Login to Soulside</div>
    <textarea id="ccTextarea" style="background-color:White;height:90px;width:540px;left:10px;top:80px;margin-top:5px;resize:auto">${chiefComplaint}</textarea>
    <div id="acceptButton" style="width:max-content;background-color:#71ab62;padding:5px;border:1px solid #71ab62;border-radius:3px;font-size:12px;color:#fff;cursor:pointer;margin-top:5px;">Add to Notes</div>
  `;
  advancedMdchiefComplaintElem.insertAdjacentElement("afterend", aiNoteElem);
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
    acceptButton.innerHTML = "Added to Notes";
    acceptButton.removeEventListener("click", acceptNotes);
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
  acceptButton.removeEventListener("click", acceptNotes);
  acceptButton.addEventListener("click", acceptNotes);
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
      if (visitIdInputValue && visitIdInputValue === visitId && templateName === TEMPLATE_NAME) {
        fetchSessionNotes(doc);
      }
    }
  }, 20000);
};
