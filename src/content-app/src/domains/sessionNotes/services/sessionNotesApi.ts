import httpClient from "@/utils/httpClient";
import { SessionNotes } from "../models";

export const getSessionNotesBySessionId = async (sessionId: string): Promise<SessionNotes[]> => {
  if (!sessionId) {
    return [];
  }
  const url = `practitioner-role/session-member-notes/session/${sessionId}/find`;
  const response = await httpClient.get(url);
  return response.data;
};
