import httpClient from "@/utils/httpClient";
import { PractitionerRole } from "../models";
import { roleBusinessFunctionMapping } from "@/domains/userProfile";

export const getPractitionerRolesByOrgId = async (
  organizationId: string
): Promise<PractitionerRole[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  const url = `practitioner-role/find-all-practitioner-roles-by-org/${organizationId}`;
  const response = await httpClient.get(url, { headers: { apiId: "getPractitionerRolesByOrgId" } });
  const data =
    response.data?.map((practitionerRole: PractitionerRole) => {
      return {
        ...practitionerRole,
        businessFunction: roleBusinessFunctionMapping(practitionerRole.behaviorHealthRole || ""),
      };
    }) || [];
  return data;
};
