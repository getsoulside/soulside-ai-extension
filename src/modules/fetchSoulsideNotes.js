import { getCookie } from "../services/utils";
import { get } from "../services/api";

export const fetchNotesFromSoulside = async visitId => {
  let organizationId = await getCookie("selected-organization");
  let soulsideChiefComplaint = await fetchEnhancedChiefComplaint(visitId, organizationId);
  if (!soulsideChiefComplaint) {
    soulsideChiefComplaint = await fetchAssessmentChiefComplaint(visitId, organizationId);
  }
  return soulsideChiefComplaint;
};

const fetchEnhancedChiefComplaint = async (visitId, organizationId) => {
  let enhancedChiefComplaint = "";
  let url = `practitioner-role/session-member-notes/organization/${organizationId}/advancedmd-visit/${visitId}/find-cc-enhanced-note`;
  try {
    let response = await get(url);
    if (response?.data) {
      enhancedChiefComplaint = response.data;
    }
  } catch (error) {
    console.log("error", error);
  }
  return enhancedChiefComplaint;
};

const fetchAssessmentChiefComplaint = async (visitId, organizationId) => {
  let chiefComplaint = "";
  let url = `practitioner-role/session-member-notes/organization/${organizationId}/advancedmd-visit/${visitId}/find-cc-note-from-assessment-template`;
  try {
    let response = await get(url);
    if (response?.data) {
      chiefComplaint = response.data;
    }
  } catch (error) {
    console.log("error", error);
  }
  return chiefComplaint;
};

export const getSoulsideNotes = async visitId => {
  let getChiefComplaintPromise = new Promise(resolve => {
    chrome.runtime.sendMessage({ action: "getSoulsideChiefComplaint", visitId }, response => {
      let soulsideChiefComplaint = "";
      if (response.success) {
        soulsideChiefComplaint = response.value || "";
      } else {
        console.error("Error getting chief complaint:", response.error || "");
      }
      resolve(soulsideChiefComplaint);
    });
  });
  let chiefComplaint = await getChiefComplaintPromise;
  return chiefComplaint;
};
