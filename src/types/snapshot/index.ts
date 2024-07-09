import { MongoDocument } from "../base";

export interface SnapshotRecord extends MongoDocument {
  allocationValue: string;
  email: string;
  galaxyMaxBuy: number;
  kycStatus: boolean;
  maxBuy: number;
  numberOfAllocation: string;
  project: string;
  userType: number;
  walletAddress: string;
}
