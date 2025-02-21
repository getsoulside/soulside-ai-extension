import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SoulsideGroup } from "../models";

export interface GroupState {
  groupsList: {
    data: SoulsideGroup[] | [];
    loading: boolean;
  };
}

const initialState: GroupState = {
  groupsList: {
    data: [],
    loading: false,
  },
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    toggleGroupsLoading(state, action: PayloadAction<boolean>) {
      state.groupsList.loading = action.payload;
    },
    addGroupsData(state, action: PayloadAction<SoulsideGroup[]>) {
      state.groupsList.data = action.payload;
    },
  },
});

export const { toggleGroupsLoading, addGroupsData } = groupSlice.actions;

export default groupSlice.reducer;
