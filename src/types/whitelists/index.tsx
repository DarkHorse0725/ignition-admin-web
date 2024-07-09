import { MongoDocument } from "../base";
import { ProjectDetails } from "../project";

export type WhitelistTier = {
  paidTokens: number;
  poolName: string;
  participantsAllowed: number;
  participantsJoined: number;
};

export interface Whitelist extends MongoDocument {
  project: ProjectDetails | string;
  openDate: string | Date;
  closeDate: string | Date;
  displayStakesEntries?: boolean;
  displayWhitelistEntries?: boolean;
  stakingContractAddressBinance: string;
  stakingContractAddressEthereum: string;
  tiers: Array<WhitelistTier>;
}

export interface WhitelistPageResponse {
  data: Whitelist[];
  total: number;
}
