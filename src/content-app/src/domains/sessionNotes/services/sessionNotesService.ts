import { store } from "@/store";
import { toggleEhrSessionNotesLoadingAction } from "../state/sessionNotes.slice";

export const toggleEhrSessionNotesLoading = (loading: boolean) => {
  store.dispatch(toggleEhrSessionNotesLoadingAction(loading));
};
