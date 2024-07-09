import { SelectFieldOption } from "@/components/atoms/SelectField";
import { AllAllowedCurrencies, BrandEnums } from "@/types";

export enum ProjectTypeEnums {
  PRIVATE_SALE = "private_sale",
  PUBLIC_SALE = "public_sale",
}

const currencyOptions: SelectFieldOption[] = AllAllowedCurrencies.map(
  (currency: string, index: number): SelectFieldOption => {
    return {
      label: currency.toUpperCase(),
      value: currency,
    };
  },
);

const chainOptions: SelectFieldOption[] = [
  { label: "Arbitrum", value: "arbitrum" },
  { label: "Avalanche", value: "avalanche" },
  { label: "Base", value: "base" },
  { label: "Blast", value: "blast" },
  { label: "Binance Smart Chain", value: "bsc" },
  { label: "Ethereum", value: "eth" },
  { label: "Manta", value: "manta" },
  { label: "Optimism", value: "optimism" },
  { label: "Polygon", value: "polygon" },
  { label: "Scroll", value: "scroll" },
  { label: "zkSync Era", value: "zksync_era" },
];
const chainOptionsDevEnvironment: SelectFieldOption[] = [
  { label: "Arbitrum Seplia", value: "arbitrum_sepolia" },
  { label: "Avalanche Fuji", value: "avalanche_fuji" },
  { label: "Base Sepolia", value: "base_sepolia" },
  { label: "Blast Sepolia", value: "blast_sepolia" },
  { label: "BSC Testnet", value: "bsc_testnet" },
  { label: "Optimism Sepolia", value: "optimism_sepolia" },
  { label: "Polygon Mumbai", value: "polygon_mumbai" },
  { label: "Scroll Sepolia", value: "scroll_sepolia" },
  { label: "Sepolia", value: "sepolia" },
  { label: "zkSync Era Sepolia", value: "zksync_era_sepolia" },
];
const chainIdMappingsByNetwork: { [key: string]: number[] } = {
  eth: [1, 5],
  bnb: [56, 97],
  bsc_testnet: [56, 97],
  goerli: [1, 5],
};

// When creating a new object, include properties that have truthy values in the original object.
const mappingEditableData = {
  _id: true,
  brand: true,
  slug: true,
  name: true,
  description: true,
  logo: true,
  mainImage: true,
  featuredBannerImageURL: true,
  featuredImageVideoURL: true,
  poolOpenDate: false,
  announcementDate: true,
  status: true,
  ended: true,
  canJoin: true,
  projectType: true,
  claimable: true,
  whitelistForm: true,
  winnersList: true,
  youtubeLiveVideo: true,
  restrictedCountries: true,
  currency: true,
  network: true,
  projectChain: true,
  totalRaise: true,
  totalRaiseSoftLimit: true,
  token: true,
  tokenFee: true,
  vesting: true,
  KYCLimit: true,
  nonKYCLimit: true,
  social: true,
  pools: false,
  transactionState: false,
  transactionErrorReason: false,
  featured: true,
  internal: true,
  hideTGE: true,
  nftSale: true,
  registrationEnabled: true,
  feeType: true,
  collaboratorWallet: true,
  purchaseToken: false,
  deploy_status: false,
  submit_snapshot_at: false,
  submit_snapshot_status: false,
  submit_snapshot_tx_hash: false,
  biography: true,
  tags: true,
  investors: true,
  marketMaker: true,
};

const projectTypeOptions: SelectFieldOption[] = [
  {
    label: "Public",
    value: ProjectTypeEnums.PUBLIC_SALE,
  },
  {
    label: "Private",
    value: ProjectTypeEnums.PRIVATE_SALE,
  },
];

const steps = ["Project Info", "Token Info", "KYC Config", "Social Network"];

export const brandOptions: SelectFieldOption[] = [BrandEnums.IGNITION].map(
  (brand: string): SelectFieldOption => {
    return {
      label: brand,
      value: brand,
    };
  },
);

export {
  projectTypeOptions,
  mappingEditableData,
  steps,
  currencyOptions,
  chainOptions,
  chainOptionsDevEnvironment,
  chainIdMappingsByNetwork,
};
