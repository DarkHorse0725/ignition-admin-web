import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const useSelectorProjectDetail = () => {
  const projectDetails = useSelector(
    (state: RootState) => state.projectDetails
  );
  return projectDetails;
};

export const useSelectorAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth;
};

export const useSelectorLotteryDetails = () => {
  const lotteryDetails = useSelector(
    (state: RootState) => state.lotteryDetails
  );
  return lotteryDetails;
};

export const useSelectorContractAdmin = () => {
  const contractAdmin = useSelector((state: RootState) => state.contractAdmin);
  return contractAdmin;
};

export const useSelectorNotification = () => {
  const notification = useSelector((state: RootState) => state.notification);
  return notification;
}