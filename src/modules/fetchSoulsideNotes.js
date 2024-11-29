import { getCookie } from "../services/utils";
import { get } from "../services/api";

export const fetchNotesFromSoulside = async visitId => {
  let organizationId = await getCookie("selected-organization");
  let soulsideChiefComplaint = "";
  try {
    soulsideChiefComplaint = await fetchEnhancedChiefComplaint(visitId, organizationId);
  } catch (error) {
    try {
      soulsideChiefComplaint = await fetchAssessmentChiefComplaint(visitId, organizationId);
    } catch (error) {
      return Promise.reject(error);
    }
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
    console.error("CC Fetch error", error);
    return Promise.reject(error);
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
    console.error("CC Fetch error", error);
    return Promise.reject(error);
  }
  return chiefComplaint;
};

export const getSoulsideNotes = async visitId => {
  let getChiefComplaintPromise = new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "getSoulsideChiefComplaint", visitId }, response => {
      let soulsideChiefComplaint = "";
      if (response.success) {
        soulsideChiefComplaint = response.value || "";
        resolve(soulsideChiefComplaint);
      } else {
        console.error("Error getting chief complaint:", response.error || "");
        reject(response.error || "Error getting chief complaint");
      }
    });
  });
  try {
    let chiefComplaint = await getChiefComplaintPromise;
    return chiefComplaint;
  } catch (error) {
    return Promise.reject(error);
  }
};
