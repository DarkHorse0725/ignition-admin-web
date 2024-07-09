import { createSlice } from "@reduxjs/toolkit";
import { Lottery, LotteryStatus } from "@/types";

export interface SnapshotState {}

const initialState: SnapshotState = {};

export const lotteryDetailsSlice = createSlice({
  name: "snapshot",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = lotteryDetailsSlice.actions;
export default lotteryDetailsSlice.reducer;
