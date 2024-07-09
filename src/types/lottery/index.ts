import { MongoDocument } from "../base";
import { Customer } from "../customer";
import { ProjectDetails } from "../project";

export interface Lottery extends MongoDocument {
  project: ProjectDetails | string;
  openDate: string | Date | null | undefined;
  closeDate: string | Date | null | undefined;
  additionalRule?: string | null | undefined;
  status: LotteryStatus;
  result?: LotteryResult;
  paused?: boolean;
  publishResults?: boolean;
  errorReason?: string;
  transactionState?: LotteryTransactionState;
  transactionErrorReason?: string;
}

export enum LotteryStatus {
  DRAFT = "draft",
  OPEN = "open",
  CLOSING = "closing",
  CLOSING_ERROR = "closing-error",
  CLOSED = "closed",
  RUNNING = "running",
  RUNNING_ERROR = "running-error",
  COMPLETED = "completed",
  FINISHED = "finished",
}

export interface LotteryResult extends MongoDocument {
  tickets: { moon: number; galaxy: number };
  winnersTickets: { moon: number; galaxy: number };
  raiseAmount: { moon: number; galaxy: number };
  ticketAllocation: { moon: number; galaxy: number };
  chancesOfWinning: { moon: number };
  selectedTicketsChancesOfWinning: { moon: number };
  additionalPercentage: { moon: number };
  selectedWinnerTickets: { moon: number };
}

export enum LotteryTransactionState {
  NONE = "none",
  WHITELIST = "whitelisting",
  WHITELIST_ERROR = "whitelisting-error",
}

export interface LotteryList {
  data: Lottery[];
  total: number;
}

export interface LotteryListRequestParams {
  page: number;
  lastid?: string;
  limit?: number;
  sort?: string;
  direction?: string;
}

export interface LotteryEntrySnapshotWallet {
  account: string;
  chainId: number;
  stakes: {
    balance: number;
    years: number;
  }[];
  groupedStakes: {
    balance: number;
    years: number;
    multiplier: number;
    lotteryMoontickets: number;
    lotteryMoonticketsWithMultiplier: number;
  }[];
  totalStakedBalance: number;
  totalLotteryMoontickets: number;
  totalLotteryMoonTicketsWithMultiplier: number;
}

export interface LotteryEntrySnapshot {
  wallets: Array<LotteryEntrySnapshotWallet>;
  totalStakedBalance: number;
  totalLotteryMoonTicketsWithMultiplier: number;
  guaranteedGalaxyTickets: number;
}

export interface LotteryEntryWallet {
  account: string;
  chainId: number;
}

export interface LotteryEntryResultWallet {
  account: string;
  chainId: number;
  tickets: number;
  winningTickets: number;
}

export interface LotteryEntryResult extends MongoDocument {
  entry: string;
  totalWinningTickets: number;
  totalGalaxyTickets: number;
  wallets: Array<LotteryEntryResultWallet>;
  mainAddress: string;
  moonLeafNodeHash: string;
  galaxyLeafNodeHash: string;
}

export interface LotteryEntry extends MongoDocument {
  _id: string;
  customer: Customer;
  lottery: Lottery;
  snapshot?: LotteryEntrySnapshot;
  wallets: Array<LotteryEntryWallet>;
  mainGalaxyAddress: string;
  result?: LotteryEntryResult;
}

export interface LotteryEntryList {
  data: LotteryEntry[];
  total: number;
}

export interface LotteryEntryResultList {
  data: LotteryEntryResult[];
  total: number;
}

export interface LotteryResult extends MongoDocument {
  tickets: { moon: number; galaxy: number };
  winnersTickets: { moon: number; galaxy: number };
  raiseAmount: { moon: number; galaxy: number };
  ticketAllocation: { moon: number; galaxy: number };
  chancesOfWinning: { moon: number };
  selectedTicketsChancesOfWinning: { moon: number };
  additionalPercentage: { moon: number };
  selectedWinnerTickets: { moon: number };
}