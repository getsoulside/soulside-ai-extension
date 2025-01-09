import httpClient from "@/utils/httpClient";
import { Session } from "@/domains/session/models";
import { SessionNotes } from "../models";

export const getSessionNotes = async (session: Session): Promise<SessionNotes[]> => {
  if (!session.id) {
    return [];
  }
  const url = `practitioner-role/session-member-notes/session/${session.id}/find`;
  const response = await httpClient.get(url, {
    headers: { apiId: `getSessionNotes-${session.id}` },
  });
  return response.data;
};
