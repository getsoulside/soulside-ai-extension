import httpClient from "@/utils/httpClient";
import { User, UserAssignedRole } from "../models";
import { PractitionerRole } from "@/domains/practitionerRole/models";
import { roleBusinessFunctionMapping } from "./userProfileService";

export const getUserInfo = async (): Promise<User> => {
  const url = "practitioner-role/profile/info";
  const response = await httpClient.get(url, { headers: { apiId: "getUserInfo" } });
  return response.data;
};

export const getUserAssignedRoles = async (): Promise<UserAssignedRole[]> => {
  const url = `practitioner-role/find-all-practitioner-roles`;
  const response = await httpClient.get(url, { headers: { apiId: "getUserAssignedRoles" } });
  let data: UserAssignedRole[] = [];
  if (response?.data) {
    let practitionerRoles: PractitionerRole[] = response.data;
    practitionerRoles = practitionerRoles.filter(i => !!i.active);
    const practitionerAssignedRoles = practitionerRoles.reduce(
      (acc: UserAssignedRole[], role: PractitionerRole) => {
        const orgIndex = acc.findIndex(org => org.organizationId === role.organizationId);
        if (orgIndex === -1) {
          acc.push({
            organizationId: role.organizationId,
            organizationName: role.organizationName,
            roles: [
              {
                ...role,
                businessFunction: roleBusinessFunctionMapping(role.behaviorHealthRole),
              },
            ],
          });
        } else {
          acc[orgIndex].roles.push({
            ...role,
            businessFunction: roleBusinessFunctionMapping(role.behaviorHealthRole),
          });
        }
        return acc;
      },
      []
    );
    data = practitionerAssignedRoles;
  }
  return data;
};
