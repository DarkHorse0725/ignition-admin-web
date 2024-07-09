import { ProjectTypeEnums } from "@/components/screens/ProjectDetails/initData";
import { MongoDocument } from "../base";
import { Country } from "../country";
import { Pool } from "../pool";
export interface ProjectList {
  data: ProjectDetails[];
  total: number;
}
export interface PurchaseTokenResponse extends PurchaseToken {
  chainId: string;
}
export enum Currency {
  BNB = "bnb",
  ETH = "eth",
}

export enum CurrencyForTestMode {
  USDT = "usdt",
  USDC = "usdc",
}

export enum AllowedCurrency {
  USDT = "usdt",
  USDC = "usdc",
  BNB = "bnb",
  ETH = "eth",
  MATIC = "matic",
}

export enum ProjectChain {
  ARBITRUM = "arbitrum",
  AVALANCHE = "avalanche",
  BASE = "base",
  BLAST = "blast",
  BSC = "bsc",
  ETH = "eth",
  MANTA = "manta",
  OPTIMISM = "optimism",
  POLYGON = "polygon",
  SCROLL = "scroll",
  ZKSYNC_ERA = "zksync_era",
}

export enum ProjectChainTestNet {
  ARBITRUM_SEPOLIA = "arbitrum_sepolia",
  AVALANCHE_FUJI = "avalanche_fuji",
  BASE_SEPOLIA = "base_sepolia",
  BLAST_SEPOLIA = "blast_sepolia",
  BSC_TESTNET = "bsc_testnet",
  MANTA_TESTNET = "manta_testnet",
  OPTIMISM_SEPOLIA = "optimism_sepolia",
  POLYGON_MUMBAI = "polygon_mumbai",
  SEPOLIA = "sepolia",
  SCROLL_SEPOLIA = "scroll_sepolia",
  ZKSYNC_ERA_SEPOLIA = "zksyn_era_sepolia",
}

export enum ProjectChainLocal {
  GANACHE = "ganache",
}

export enum ProjectStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  LIVE = "live",
  CANCELLED = "cancelled",
  FINISHED = "finished",
  EMERGENCY_CANCELLED = "emergency_cancelled",
}

export interface ProjectTokenListingOnURL {
  uniSwap?: string;
  pancakeSwap?: string;
}
export interface ProjectToken {
  [key: string]: any;
  symbol: string;
  price: string;
  contractAddress: string;
  tooltip: string;
  airdrop?: boolean;
  decimal?: number;
  ath?: number;
  listingOn?: ProjectTokenListingOnURL;
  staking?: string;
}

export interface ProjectTag {
  _id: string;
  name: string;
  foreColor: string;
  bgColor: string;
}

export interface ProjectVesting {
  TGEDate: string | Date | null;
  TGEPercentage?: string;
  description: string;
  contractAddress?: string;
  cliffLength: {
    value: number;
    periodUnit: string;
  };
  frequency: {
    value: number;
    periodUnit: string;
  };
  numberOfRelease: number;
}

export enum ProjectTransactionState {
  NONE = "none",
  SET_ADMIN = "setting-admin",
  SET_ADMIN_ERROR = "setting-admin-error",
}

export interface PurchaseToken {
  symbol: string;
  decimal: number | undefined;
  address: string;
}

export enum EProjectAsyncStatus {
  NONE = "none",
  PRCOCESSING = "processing",
  PENDING = "pending",
  SUCCESS = "success",
}

export interface PurchaseTokenResponse extends PurchaseToken {
  chainId: string;
}

export interface ProjectSocial {
  [key: string]: any;
  telegram: string;
  twitter: string;
  medium?: string;
  website: string;
  whitepaper?: string;
}

export enum ProjectStages {
  DEFAULT = "default",
  APPEARING = "appearing",
  PURCHASING = "purchasing",
  VESTING = "vesting",
  REFUNDING = "refunding",
}

export interface ProjectDetails extends MongoDocument {
  brand: string;
  tags?: string[];
  slug: string;
  name: string;
  description: string;
  logo: string;
  mainImage: string;
  featuredBannerImageURL: string;
  featuredImageVideoURL: string;
  poolOpenDate: string;
  announcementDate: string;
  status: ProjectStatus;
  ended: boolean;
  canJoin: boolean;
  projectType: string;
  tokenFee: number;
  claimable?: boolean;
  whitelistForm?: string;
  winnersList?: string;
  youtubeLiveVideo?: string;
  restrictedCountries?: Country[];
  currency: string;
  network: number;
  projectChain: string;
  totalRaise: number | undefined;
  totalRaiseSoftLimit: number | undefined;
  token: ProjectToken;
  vesting: ProjectVesting;
  KYCLimit: number | undefined;
  nonKYCLimit: number | undefined;
  social: ProjectSocial;
  pools: Pool[];
  transactionState: ProjectTransactionState;
  transactionErrorReason?: string;
  featured: boolean;
  internal: boolean;
  hideTGE: boolean;
  nftSale: boolean;
  registrationEnabled: boolean;
  feeType: boolean;
  contractAddress?: string;
  collaboratorWallet?: string[];
  purchaseToken?: PurchaseToken;
  deploy_status?: EProjectAsyncStatus;
  submit_snapshot_at?: string;
  submit_snapshot_status?: EProjectAsyncStatus;
  submit_snapshot_tx_hash?: string;
  fundedToken: number;
  deploy_by: string | undefined;
  stage: ProjectStages;
  biography: string;
  investors?: string;
  marketMaker?: string;
}

export enum ETypeWithdraw {
  IDO = "IDO",
  TOTAL_FUND = "TOTAL_FUND",
}

export enum ActionName {
  Approve = "Approve",
  Reject = "Reject",
}

export enum ProposalStatus {
  Approved = "approved",
  Rejected = "rejected",
  Pending = "pending",
  NotFound = "not_found",
}

export interface ProposalInfo extends MongoDocument {
  IDOTokenAddress: string;
  project: string;
  status: ProposalStatus;
  __v: number;
}
