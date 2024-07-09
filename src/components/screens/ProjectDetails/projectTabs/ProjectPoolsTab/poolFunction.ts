import { APIClient } from "@/core/api";
import { roundDown } from "@/helpers/roundDown";
import { AdminExistRole, PoolStatus } from "@/types";
import { compareAsc } from "date-fns";
import { ethers } from "ethers";

export enum FieldName {
  OPEN_TIME,
  GALAXY_END_TIME,
  CROWDFUNDING_END_TIME,
  BUTTON_SUBMIT,
  OTHER,
}

const apiClient = APIClient.getInstance();
export const checkExistAdmin = async (
  role: AdminExistRole,
  address: string | null,
  chainId: any
) => {
  if (!(address && chainId)) return false;
  const { data } = await apiClient.setAdmins.isExisted(role, {
    adminAddress: ethers.getAddress(address),
    network: Number(chainId),
  });
  return !!data;
};

export const checkDisableButtonSubmit = (
  galaxyStatus: PoolStatus,
  crowdfundingStatus: PoolStatus
) => {
  return (
    galaxyStatus === PoolStatus.CLOSED &&
    crowdfundingStatus === PoolStatus.CLOSED
  );
};

export const getMinDatePoolEndTime = (conditionalDate: Date, minDate: Date) => {
  if (compareAsc(conditionalDate, minDate) > 0) {
    return minDate;
  }
  return new Date();
};

export const percentageFormat = (percentage: number, overTotal: number) => {
  return `${percentage.toFixed(2)}% ($${roundDown(
    overTotal / 100,
    2
  ).toLocaleString("en-US")})`;
};
