import { createSlice } from '@reduxjs/toolkit'
import { Lottery, LotteryStatus } from "@/types";

export interface LotteryDetailsState {
  current: Lottery;
}

export const initialLotteryDetails: Lottery = {
  _id: "",
  status: LotteryStatus.DRAFT,
  project: "",
  openDate: "",
  closeDate: "",
  additionalRule: "",
};

const initialState: LotteryDetailsState = {
  current: initialLotteryDetails,
};

export const lotteryDetailsSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    updateDetails: (state, action) => {
      state.current = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateDetails } = lotteryDetailsSlice.actions
export default lotteryDetailsSlice.reducer