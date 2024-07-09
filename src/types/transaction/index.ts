import { MongoDocument } from "../base";
import { User } from "../login";

export enum TransactionKind {
  PROJECT = "ProjectTransaction",
  POOL = "PoolTransaction",
  POOLv2 = "POOL",
  LOTTERY = "LotteryTransaction",
  PROJECTv2 = "PROJECT",
  WITHDRAW = "WITHDRAW",
}

export enum TransactionStatus {
  PENDING = "pending",
  FAILURE = "failed",
  SUCCESS = "successful",
}

export type TransactionMetaData = { [key: string]: unknown };

export interface LPTransactionReceiptLog {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;

  removed: boolean;

  address: string;
  data: string;

  topics: string[];

  transactionHash: string;
  logIndex: number;
}

export interface LPTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string | null;
  transactionIndex: number;
  root?: string;
  gasUsed: TransactionMetaData;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: LPTransactionReceiptLog[];
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: TransactionMetaData;
  effectiveGasPrice: TransactionMetaData;
  byzantium: boolean;
  type: number;
  status?: number;
}

export interface TransactionFeeConversions {
  fee: string;
  feeHex: string;
  feeUSD?: string;
  gasUsed: string;
  effectiveGasPrice: string;
}

export interface TransactionFeeCoinInfo {
  id: string;
  symbol: string;
  name: string;
  api: string;
  currentPrice: number;
}

export interface TransactionFeeMetaData {
  [key: string]: any;
  conversions: TransactionFeeConversions;
  coinInfo?: TransactionFeeCoinInfo;
}

export interface Transaction extends MongoDocument {
  project: string;
  hash: string;
  to: string;
  from: string;
  nonce: number;
  gasLimit?: any | null;
  gasPrice?: any | null;
  data?: string;
  value?: string | null;
  chainId: number;
  r?: string;
  s?: string;
  v?: number;
  type?: number | null;
  accessList?: any | null;
  maxPriorityFeePerGas?: any | null;
  maxFeePerGas?: any | null;
  transactionKind: TransactionKind;
  transactionStatus: TransactionStatus;
  transactionType: string;
  appliedData?: { [key: string]: any };
  createdBy: Partial<User>;
  transactionFee?: number;
  transactionFeeInUSD?: number;
  receipt?: LPTransactionReceipt;
  feeMetaData?: TransactionFeeMetaData;
}

export interface Transactions {
  data: Transaction[];
  total: number;
}

export enum PoolTransactionType {
  DEPLOY = "deploy",
  TIER_OPEN_TIME = "tier-open-time",
  END_TIME = "end-time",
  QUOTE_ADDRESS = "quote-address",
  RATE = "rate",
  BASE_TIER = "base-tier",
  PRIVATE_AUTO_TRANSFER = "private-autotransfer",
  PAUSE = "pause",
  UNPAUSE = "unpause",
  FINALIZE = "finalize",
  TRANSFER = "transfer",
  DISABLE = "disable",
  WITHDRAW_TOTAL_FUNDS = "WITHDRAW TOTAL FUNDS",
  WITHDRAW_REMAINING_IDO_TOKENS = "WITHDRAW REMAINING IDO TOKENS",
  ENABLE_REDEEM = "ENABLE REDEEM",
  DISABLE_REDEEM = "DISABLE REDEEM",
  CANCEL = "CANCEL",
  ADJUST_GALAXY_END_TIME = "adjust_galaxy_end_time",
  ADJUST_CROWDFUNDING_END_TIME = "adjust_crowdfunding_end_time",
  ADJUST_BOTH_POOLS_END_TIME = "adjust_both_pools_end_time",
}

export enum ProjectTransactionType {
  CANCEL = "cancel",
  EMERGENCY_CANCELLED = "emergency_cancelled",
  DELETE = "delete",
  SUBMIT_SNAPSHOT = "submit_snapshot",
  ENABLE_CLAIM = "enable_claim",
  DISABLE_CLAIM = "disable_claim",
  WITHDRAW_PARTICIPATION_FEE = "withdraw_participation_fee",
  WITHDRAW_COLLABORATOR_FUND = "withdraw_collaborator_fund",
  WITHDRAW_TOKEN_FEE = "withdraw_token_fee",
  WITHDRAW_PURCHASED_AMOUNT = "withdraw_purchased_amount",
  ADD_CONTRACT_ADMIN = "add_contract_admin",
  DELETE_CONTRACT_ADMIN = "delete_contract_admin",
  FUND_IDO_TOKEN = "fund_ido_token",
  SET_IDO_TOKEN_ADDRESS = "set_ido_token_address",
  UPDATE_TGE_DATE = "update_tge_date",
  WITHDRAW_REDUNDANT_IDO_TOKEN = "withdraw_redundant_IDO_token",
}
