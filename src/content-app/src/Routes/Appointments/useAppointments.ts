import LOCAL_STORAGE_KEYS from "@/constants/localStorageKeys";
import {
  BusinessFunction,
  loadOrgPractitionerRoles,
  PractitionerRole,
} from "@/domains/practitionerRole";
import {
  IndividualSession,
  loadSessions,
  SessionCategory,
  SoulsideSession,
} from "@/domains/session";
import { RootState, AppDispatch } from "@/store";
import { getDateTime } from "@/utils/date";
import { addLocalStorage, getLocalStorage } from "@/utils/storage";
import moment from "moment-timezone";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAppointments = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProviders, setSelectedProviders] = useState<PractitionerRole[]>([]);
  useEffect(() => {
    const getSelectedProvidersFromLocalStorage = async () => {
      const selectedProviders = await getLocalStorage(
        LOCAL_STORAGE_KEYS.SELECTED_PROVIDERS_FILTERS
      );
      if (selectedProviders) {
        setSelectedProviders(selectedProviders);
      }
    };
    getSelectedProvidersFromLocalStorage();
  }, []);
  const [scheduleSessionOpen, setScheduleSessionOpen] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const session = useSelector((state: RootState) => state.session);
  const selectedRole = useSelector((state: RootState) => state.userProfile.selectedRole);
  const sessionListSelectedDate = useSelector(
    (state: RootState) => state.userProfile.sessionListSelectedDate
  );
  const selectedDate = sessionListSelectedDate ? moment(sessionListSelectedDate) : null;
  useEffect(() => {
    getSessionsList();
  }, [dispatch, sessionListSelectedDate]);
  const orgPractitionersRoles = useSelector(
    (state: RootState) => state.practitionerRole.orgPractitionersRoles
  );
  const providersList = useMemo(() => {
    const data = orgPractitionersRoles.data.filter(
      (practitionerRole: PractitionerRole) =>
        practitionerRole.businessFunction === BusinessFunction.CLINICAL_CARE
    );
    if (data?.length > 0 && selectedProviders.length > 0) {
      if (
        !selectedProviders.some(selectedProvider =>
          data.some(provider => provider.id === selectedProvider.id)
        )
      ) {
        setSelectedProviders([]);
      }
    }
    return data;
  }, [orgPractitionersRoles]);
  useEffect(() => {
    addLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_PROVIDERS_FILTERS, selectedProviders);
  }, [selectedProviders]);
  useEffect(() => {
    if (
      selectedRole.data?.businessFunction !== BusinessFunction.CLINICAL_CARE &&
      orgPractitionersRoles.data.length === 0 &&
      !orgPractitionersRoles.loading
    ) {
      dispatch(loadOrgPractitionerRoles());
    }
  }, [dispatch]);
  const getSessionsList = () => {
    let startDateTime = selectedDate?.clone().hour(0).minute(0).second(0).format() || "";
    let endDateTime = selectedDate?.clone().hour(23).minute(59).second(59).format() || "";
    dispatch(loadSessions(startDateTime, endDateTime));
  };
  const sessionsList = useMemo(() => {
    let data = session.sessionsList.data.filter(session => {
      if (!session.startTime) return false;
      const sessionDate = getDateTime(session.startTime);
      const today = selectedDate ? getDateTime(selectedDate) : getDateTime();
      return (
        sessionDate.year() === today.year() &&
        sessionDate.month() === today.month() &&
        sessionDate.date() === today.date()
      );
    });
    data = data.sort((session1, session2) => {
      const date1 = session1.startTime ? new Date(session1.startTime).getTime() : 0;
      const date2 = session2.startTime ? new Date(session2.startTime).getTime() : 0;
      return date1 - date2;
    });
    if (
      selectedRole.data?.businessFunction !== BusinessFunction.CLINICAL_CARE &&
      selectedProviders.length > 0
    ) {
      data = data.filter(session =>
        selectedProviders.some(provider => provider.id === session.practitionerRoleId)
      );
    }
    data = data.filter(session => {
      if (!searchTerm) return true;
      if (session.sessionCategory === SessionCategory.GROUP) {
        const groupName = (session as SoulsideSession).groupName || "";
        const sessionName = (session as SoulsideSession).sessionName || "";
        return (
          groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sessionName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (session.sessionCategory === SessionCategory.INDIVIDUAL) {
        const patientName = `${(session as IndividualSession).patientFirstName || ""} ${
          (session as IndividualSession).patientLastName || ""
        }`;
        return patientName.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    return data;
  }, [session.sessionsList.data, sessionListSelectedDate, selectedProviders, searchTerm]);

  const sessionsListLoading = session.sessionsList.loading;
  return {
    sessionsList,
    sessionsListLoading,
    searchTerm,
    setSearchTerm,
    selectedDate,
    getSessionsList,
    selectedProviders,
    setSelectedProviders,
    providersList: { data: providersList, loading: orgPractitionersRoles.loading },
    scheduleSessionOpen,
    setScheduleSessionOpen,
    selectedRole,
  };
};

export default useAppointments;
