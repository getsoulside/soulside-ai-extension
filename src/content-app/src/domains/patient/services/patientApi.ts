import httpClient from "@/utils/httpClient";
import { Patient } from "../models";

export const getPatientsByOrgId = async (organizationId: string): Promise<Patient[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  const url = `practitioner-role/patient/find-all-by-org/${organizationId}`;
  const response = await httpClient.get(url, { headers: { apiId: "getPatientsByOrgId" } });
  return response.data;
};
