import httpClient from "@/utils/httpClient";
import { SoulsideGroup } from "../models";

export const getGroupsByOrgId = async (organizationId: string): Promise<SoulsideGroup[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  const url = `practitioner-role/groups/find-all-by-org/${organizationId}`;
  const response = await httpClient.get(url, { headers: { apiId: "getGroupsByOrgId" } });
  return response.data;
};

export const getGroupsByPractitionerRoleId = async (
  practitionerRoleId: string
): Promise<SoulsideGroup[]> => {
  if (!practitionerRoleId) {
    return Promise.reject("Practitioner Role ID is required");
  }
  const url = `practitioner-role/groups/find-all-by-practitioner-role/${practitionerRoleId}`;
  const response = await httpClient.get(url, {
    headers: { apiId: "getGroupsByPractitionerRoleId" },
  });
  return response.data;
};
