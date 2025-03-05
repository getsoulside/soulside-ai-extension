import { AppDispatch, RootState } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentsListProps } from "./AppointmentsList";
import { loadSessionNotesStatus } from "@/domains/session";

const useAppointmentsList = (props: AppointmentsListProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20 });
  useEffect(() => {
    setPagination({ page: 1, pageSize: 20 });
  }, [props.data]);

  const sessionNotesStatus = useSelector((state: RootState) => state.session.sessionNotesStatus);
  const selectedRole = useSelector((state: RootState) => state.userProfile.selectedRole?.data);

  const sessionsList = useMemo(() => {
    let data = props.data.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    );
    return data;
  }, [props.data, pagination]);

  useEffect(() => {
    if (sessionsList?.length > 0) {
      sessionsList.forEach(async session => {
        if (session.id) {
          const notesExists = sessionNotesStatus.data[session.id]?.notesExists;
          if (session.id && !notesExists && !sessionNotesStatus.loading[session.id]) {
            dispatch(loadSessionNotesStatus(session));
          }
        }
      });
    }
  }, [sessionsList]);

  return {
    sessionNotesStatus,
    sessionsList,
    pagination,
    setPagination,
    selectedRole,
  };
};

export default useAppointmentsList;
