import { MongoDocument } from "../base";
import { AllowedNetwork } from "../contract";
import { Lottery } from "../lottery";

export enum PoolStatus {
  DRAFT = "draft",
  DEPLOYED = "deployed",
  OPEN = "open",
  CLOSED = "closed",
  FINALIZED = "finalized",
  PUBLISHED = "published",
}

export enum PoolTransactionState {
  NONE = "none",
  DEPLOYING = "deploying",
  DEPLOYING_ERROR = "deploying-error",
  TIER_OPEN_TIME = "tier-open-time",
  TIER_OPEN_TIME_ERROR = "tier-open-time-error",
  END_TIME = "end-time",
  END_TIME_ERROR = "end-time-error",
  QUOTE_ADDRESS = "quote-address",
  QUOTE_ADDRESS_ERROR = "quote-address-error",
  BASE_TIER = "base-tier",
  BASE_TIER_ERROR = "base-tier-error",
  RATE = "rate",
  RATE_ERROR = "rate-error",
  PRIVATE_AUTO_TRANSFER = "private-auto-transfer",
  PRIVATE_AUTO_TRANSFER_ERROR = "private-auto-transfer-error",
  PAUSE_POOL = "pause-pool",
  PAUSE_POOL_ERROR = "pause-pool-error",
  UNPAUSE_POOL = "unpause-pool",
  UNPAUSE_POOL_ERROR = "unpause-pool-error",
  FINALIZING = "finalizing",
  FINALIZING_ERROR = "finalizing-error",
  TRANSFERRING_POOL_TOKENS = "transferring-pool-tokens",
  TRANSFERRING_POOL_TOKENS_ERROR = "transferring-pool-tokens-error",
  DISABLING_POOL = "disabling-pool",
  DISABLING_POOL_ERROR = "disabling-pool-error",
  WITHDRAWING_UNSOLD_TOKENS = "withdrawing-unsold-tokens",
  WITHDRAWING_UNSOLD_TOKENS_ERROR = "withdrawing-unsold-tokens-error",
  WITHDRAWING_RAISED_FONDS = "withdrawing-raised-fonds",
  WITHDRAWING_RAISED_FONDS_ERROR = "withdrawing-raised-fonds-error",
}

export enum PoolType {
  GALAXY = "galaxy",
  MOON = "moon",
  CROWDFUNDING = "crowdfunding",
}

export const SupportedPoolLabels = Object.values(PoolType) as PoolType[];

export interface Pool extends MongoDocument {
  contractAddress?: string;
  contractId: number;
  name: PoolType;
  label: string;
  icon?: string;
  tierOpenTime: Date;
  endTime: Date;
  allocationPerWinningTicket: number;
  costPerAllocation: number;
  totalRaise: number;
  totalTokens: number;
  quoteAssetAddress: string;
  adminAddress: string;
  mainHolderAddress: string;
  secHolderAddress: string;
  rate: number;
  mainSupportAmount: number;
  secSupportAmount: number;
  baseAssetDecimals: number;
  quoteAssetDecimals: number;
  mainAssetDecimals: number;
  secSuppAssetDecimals: number;
  autoTransfer: boolean;
  privatePool: boolean;
  deployed: boolean;
  paused: boolean;
  withdrawnTokens: boolean;
  finalized: boolean;
  status: PoolStatus;
  transactionState: PoolTransactionState;
  transactionErrorReason?: string;
  whiteListLeafNodeHashes: string;
  participantFee: number;
  earlyAccessPercentage: number;
  lottery?: Lottery;
  galaxyEndTime?: Date;
  galaxyOpenTime?: Date;
  galaxyParticipantFee: number;
  galaxyRaisePercentage: number;
  crowdfundingEndTime?: Date;
  crowdfundingParticipantFee?: number;
  capLimit: number;
}
export interface UpdateTimePoolDto {
  galaxyEndTime: Date;
  crowdfundingEndTime: Date;
  projectNetwork: AllowedNetwork;
}

export interface UpdateConfigPoolDto {
  galaxyPool: {
    galaxyRaisePercentage: number;
    galaxyOpenTime: Date | null;
    galaxyEndTime: Date | null;
    galaxyParticipantFee: number;
    capLimit: number;
  };
  crowdfundingPool: {
    earlyAccessPercentage: number;
    crowdfundingEndTime: Date | null;
    crowdfundingParticipantFee: number;
    capLimit: number;
  };
}
