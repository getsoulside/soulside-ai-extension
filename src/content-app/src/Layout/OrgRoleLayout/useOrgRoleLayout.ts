import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store";
import { PractitionerRole } from "@/domains/practitionerRole";
import { selectPractitionerRole } from "@/domains/userProfile";

const useOrgRoleLayout = () => {
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const assignedRoles = userProfile.assignedRoles.data;

  const [expanded, setExpanded] = useState<string | null>(assignedRoles?.[0]?.organizationId || "");

  const handleChange = (organizationId: UUIDString | null) => {
    setExpanded(prevExpanded => (prevExpanded === organizationId ? "" : organizationId));
  };

  const onSelectRole = (role: PractitionerRole) => {
    selectPractitionerRole(role);
  };
  return { userProfile, assignedRoles, expanded, handleChange, onSelectRole };
};

export default useOrgRoleLayout;
