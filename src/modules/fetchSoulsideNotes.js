import { getCookie } from "../services/utils";
import { get } from "../services/api";

export const getSoulsideData = async visitId => {
  let getSoulsideDataPromise = new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "getSoulsideData", visitId }, response => {
      let soulsideData = null;
      if (response.success) {
        soulsideData = response.value || null;
        resolve(soulsideData);
      } else {
        console.error("Error getting soulside data:", response.error || "");
        reject(response.error || "Error getting soulside data");
      }
    });
  });
  try {
    let soulsideData = await getSoulsideDataPromise;
    return soulsideData;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchSoulsideData = async visitId => {
  let soulsideNotes = null;
  let soulsideTreatmentPlan = null;
  try {
    const soulsideSession = await fetchSoulsideSession(visitId);
    if (soulsideSession) {
      const sessionId = soulsideSession.id;
      const patientId = soulsideSession.patientId;
      try {
        soulsideNotes = await fetchSoulsideNotes(sessionId);
      } catch (error) {
        console.error("Soulside Data Fetch Error", error);
      }
      try {
        soulsideTreatmentPlan = await fetchSoulsideTreatmentPlan(patientId);
      } catch (error) {
        console.error("Soulside Data Fetch Error", error);
      }
    }
  } catch (error) {
    console.error("Soulside Data Fetch Error", error);
    return Promise.reject(error);
  }
  return {
    soulsideNotes,
    soulsideTreatmentPlan,
  };
};

const fetchSoulsideSession = async visitId => {
  let organizationId = await getCookie("selected-organization");
  let soulsideSession = null;
  let url = `practitioner-role/session-member-notes/organization/${organizationId}/advancedmd-visit/${visitId}/find-individual-session`;
  try {
    let response = await get(url);
    if (response?.data) {
      soulsideSession = response.data;
    }
  } catch (error) {
    console.error("Soulside Session Fetch Error", error);
    return Promise.reject(error);
  }
  return soulsideSession;
};

const fetchSoulsideNotes = async sessionId => {
  let url = `practitioner-role/session-member-notes/session/${sessionId}/find`;
  let soulsideNotes = null;
  try {
    let response = await get(url);
    if (response?.data?.length > 0) {
      soulsideNotes = response.data[0] || null;
    }
  } catch (error) {
    console.error("Soulside Notes Fetch Error", error);
  }
  return soulsideNotes;
};

const fetchSoulsideTreatmentPlan = async patientId => {
  let url = `practitioner-role/treatment-plan/mvp/find-all-by-patient/${patientId}`;
  let soulsideTreatmentPlan = null;
  try {
    let response = await get(url);
    if (response?.data?.length > 0) {
      let data = response.data.sort(
        (data1, data2) => new Date(data2.updatedAt) - new Date(data1.updatedAt)
      );
      soulsideTreatmentPlan = data[0];
      if (soulsideTreatmentPlan?.plan && soulsideTreatmentPlan.plan.hasOwnProperty("problems")) {
        delete soulsideTreatmentPlan.plan.problems;
        if (soulsideTreatmentPlan.plan.hasOwnProperty("intakeSession")) {
          delete soulsideTreatmentPlan.plan.intakeSession;
        }
      }
      if (soulsideTreatmentPlan?.plan && Object.keys(soulsideTreatmentPlan.plan).length === 0) {
        soulsideTreatmentPlan.plan = null;
      }
    }
  } catch (error) {
    console.error("Soulside Treatment Plan Fetch Error", error);
  }
  return soulsideTreatmentPlan;
};
