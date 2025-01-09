import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Moment } from "moment";
import { AppDispatch, RootState } from "@/store";
import {
  BusinessFunction,
  loadOrgPractitionerRoles,
  PractitionerRole,
} from "@/domains/practitionerRole";
import { loadOrgPatients, Patient } from "@/domains/patient";
import {
  AppointmentType,
  IndividualSession,
  loadEditSession,
  loadScheduleSession,
  ModeOfDelivery,
  ScheduleSessionPayload,
  Session,
  SessionCategory,
  SoulsideSession,
} from "@/domains/session";
import { loadGroups, SoulsideGroup } from "@/domains/group";

import { ScheduleSessionProps } from "./ScheduleSession";
import { getDateTime } from "@/utils/date";
import { toast } from "react-toastify";

const useScheduleSession = (props: ScheduleSessionProps) => {
  const dispatch: AppDispatch = useDispatch();

  const [sessionCategory, setSessionCategory] = useState<SessionCategory>(
    SessionCategory.INDIVIDUAL
  );
  const [modeOfDelivery, setModeOfDelivery] = useState<ModeOfDelivery>(ModeOfDelivery.IN_PERSON);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    AppointmentType.FOLLOW_UP
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PractitionerRole | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SoulsideGroup | null>(null);
  const [durationInMinutes, setDurationInMinutes] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.open) {
      setSessionCategory(SessionCategory.INDIVIDUAL);
      setModeOfDelivery(ModeOfDelivery.IN_PERSON);
      setAppointmentType(AppointmentType.FOLLOW_UP);
      setSelectedPatient(null);
      setSelectedProvider(null);
      setSelectedGroup(null);
      setDurationInMinutes(null);
      setStartDate(getDateTime());
      setStartTime(getDateTime());
      setLoading(false);
    } else {
      if (!props.editSession) {
        setStartDate(getDateTime());
        setStartTime(getDateTime());
      }
    }
  }, [props.open]);

  useEffect(() => {
    if (props.open && props.editSession && props.editData) {
      const sessionData = props.editData;
      setSessionCategory(sessionData.sessionCategory || SessionCategory.INDIVIDUAL);
      setModeOfDelivery(sessionData.modeOfDelivery || ModeOfDelivery.IN_PERSON);
      setAppointmentType(
        (sessionData as IndividualSession).appointmentType || AppointmentType.FOLLOW_UP
      );
      setSelectedPatient({
        id: (sessionData as IndividualSession).patientId,
        active: true,
        organizationId: sessionData.organizationId || "",
        organizationName: sessionData.organizationName || "",
        patientUserId: "",
        createdAt: "",
        firstName: (sessionData as IndividualSession).patientFirstName,
        lastName: (sessionData as IndividualSession).patientLastName,
        email: (sessionData as IndividualSession).patientEmail,
        phoneNumber: (sessionData as IndividualSession).patientPhoneNumber,
      });
      setSelectedProvider({
        id: sessionData.practitionerRoleId,
        active: true,
        organizationId: sessionData.organizationId || "",
        organizationName: sessionData.organizationName || "",
        practitionerId: "",
        createdAt: "",
        behaviorHealthRole: null,
        businessFunction: null,
        practitionerFirstName: sessionData.practitionerFirstName,
        practitionerLastName: sessionData.practitionerLastName,
        practitionerEmail: sessionData.practitionerEmail,
        profileDescription: "",
      });
      setSelectedGroup({
        id: (sessionData as SoulsideSession).groupId,
        groupName: (sessionData as SoulsideSession).groupName,
        startHour: null,
        startMinute: null,
        dayOfWeek: null,
        soulsideVertical: null,
        groupStatus: null,
        groupMemberships: null,
        groupFacilitators: null,
        createdAt: null,
        schedulingPreferences: null,
        organizationId: sessionData.organizationId || "",
        organizationName: sessionData.organizationName || "",
        groupPatientMemberships: null,
        groupPractitionerRoles: null,
        groupOpennessType: null,
        patientSessionRecurrenceType: null,
        sessionDurationInMinutes: null,
        modeOfDelivery: null,
      });
      setDurationInMinutes(sessionData.durationInMinutes || null);
      setStartDate(getDateTime(sessionData.startTime || null));
      setStartTime(getDateTime(sessionData.startTime || null));
    }
  }, [props.open, props.editSession, props.editData]);

  const selectedRole = useSelector((state: RootState) => state.userProfile.selectedRole);
  const selectedTimezone = useSelector((state: RootState) => state.userProfile.selectedTimezone);

  const orgPractitionersRoles = useSelector(
    (state: RootState) => state.practitionerRole.orgPractitionersRoles
  );
  const providersList = useMemo(() => {
    return orgPractitionersRoles.data.filter(
      practitionerRole => practitionerRole.businessFunction === BusinessFunction.CLINICAL_CARE
    );
  }, [orgPractitionersRoles]);
  useEffect(() => {
    if (
      selectedRole.data?.businessFunction !== BusinessFunction.CLINICAL_CARE &&
      orgPractitionersRoles.data.length === 0 &&
      !orgPractitionersRoles.loading &&
      props.open
    ) {
      dispatch(loadOrgPractitionerRoles());
    }
  }, [dispatch, props.open]);

  useEffect(() => {
    if (
      selectedRole.data?.businessFunction === BusinessFunction.CLINICAL_CARE &&
      selectedRole &&
      props.open
    ) {
      setSelectedProvider(selectedRole.data);
    }
  }, [dispatch, selectedRole, props.open]);

  const patientsList = useSelector((state: RootState) => state.patient.patientsList);
  useEffect(() => {
    if (patientsList.data.length === 0 && !patientsList.loading && props.open) {
      dispatch(loadOrgPatients());
    }
  }, [dispatch, props.open]);

  const groupList = useSelector((state: RootState) => state.group.groupsList);
  useEffect(() => {
    if (groupList.data.length === 0 && !groupList.loading && props.open) {
      dispatch(loadGroups());
    }
  }, [dispatch, props.open]);

  const scheduleSession = async () => {
    let sessionName =
      sessionCategory === SessionCategory.INDIVIDUAL
        ? `${
            modeOfDelivery === ModeOfDelivery.IN_PERSON
              ? "In-Office session with"
              : "Telehealth session with"
          } ${selectedPatient?.firstName || ""}${selectedPatient?.lastName ? " " : ""}${
            selectedPatient?.lastName || ""
          }`
        : `${
            modeOfDelivery === ModeOfDelivery.IN_PERSON
              ? "In-Office session for"
              : "Telehealth session for"
          } ${selectedGroup?.groupName || ""}`;
    const offsetStartDateTime: ISO8601String | null =
      startDate && startTime
        ? startDate
            .clone()
            .set({
              hour: startTime.hour(),
              minute: startTime.minute(),
              second: 0,
              millisecond: 0,
            })
            .format()
        : null;
    const payload: ScheduleSessionPayload = {
      practitionerRoleId:
        selectedRole.data?.businessFunction === BusinessFunction.CLINICAL_CARE
          ? selectedRole.data?.id || null
          : selectedProvider?.id || null,
      sessionName,
      offsetStartDateTime,
      durationInMinutes,
      sessionCategory,
      modeOfDelivery,
      appointmentType:
        sessionCategory === SessionCategory.GROUP ? AppointmentType.FOLLOW_UP : appointmentType,
      [sessionCategory === SessionCategory.INDIVIDUAL ? "patientId" : "groupId"]:
        sessionCategory === SessionCategory.INDIVIDUAL ? selectedPatient?.id : selectedGroup?.id,
    };
    setLoading(true);
    if (!props.editSession) {
      try {
        await dispatch(loadScheduleSession(payload));
        toast.success("Appointment scheduled successfully");
        props.onClose();
      } catch (error: any) {
        toast.error("Failed to schedule appointment");
      }
      setLoading(false);
    } else {
      if (props.editSession && props.editData) {
        const editSessionPayload: Session = {
          ...props.editData,
          modeOfDelivery,
          appointmentType,
          durationInMinutes,
          startTime: offsetStartDateTime,
          startHour: startTime?.hour() || null,
          startMinute: startTime?.minute() || null,
        };
        try {
          await dispatch(loadEditSession(editSessionPayload));
          toast.success("Appointment edited successfully");
          props.onClose();
        } catch (error: any) {
          toast.error("Failed to edit appointment");
        }
        setLoading(false);
      }
    }
  };

  const formCompleted = useMemo(() => {
    return (
      ((sessionCategory === SessionCategory.INDIVIDUAL && selectedPatient) ||
        (sessionCategory === SessionCategory.GROUP && selectedGroup)) &&
      selectedProvider &&
      durationInMinutes &&
      startDate &&
      startTime
    );
  }, [
    sessionCategory,
    selectedPatient,
    selectedGroup,
    selectedProvider,
    durationInMinutes,
    startDate,
    startTime,
  ]);

  return {
    providersList: { data: providersList, loading: orgPractitionersRoles.loading },
    patientsList,
    groupList,
    sessionCategory,
    setSessionCategory,
    modeOfDelivery,
    setModeOfDelivery,
    appointmentType,
    setAppointmentType,
    selectedPatient,
    setSelectedPatient,
    selectedProvider,
    setSelectedProvider,
    selectedGroup,
    setSelectedGroup,
    durationInMinutes,
    setDurationInMinutes,
    startTime,
    setStartTime,
    startDate,
    setStartDate,
    scheduleSession,
    selectedRole,
    selectedTimezone,
    formCompleted,
    loading,
  };
};

export default useScheduleSession;
