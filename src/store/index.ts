import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import projectDetailsSlice from "./features/projectDetailsSlice";
import lotteryDetailsSlice from "./features/lotteryDetailsSlice";
import contractAdminSlice from "./features/contractAdminSlice";
import notificationSlice from "./features/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projectDetails: projectDetailsSlice,
    lotteryDetails: lotteryDetailsSlice,
    contractAdmin: contractAdminSlice,
    notification: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
