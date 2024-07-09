import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  EProjectAsyncStatus,
  Pool,
  ProjectDetails,
  ProjectStages,
  ProjectStatus,
  ProjectTransactionState,
  ProposalStatus,
} from "@/types";
import { APIClient } from "@/core/api";
import { updatePoolEndTime } from "../supportedFunction";

export interface ProjectDetailsState {
  current: ProjectDetails;
  isNewVersion: boolean;
  loading: boolean;
  isOpenPoolDialog: boolean;
  isLoadingPoolTransaction: boolean;
  isLoadingVestingTransaction: boolean;
  claimableLoading: boolean;
  cancelLoading: boolean;
  deleteLoading: boolean;
  withdrawParticipantFeeLoading: boolean;
  withdrawProjectFeeLoading: boolean;
  proposalStatus?: ProposalStatus;
}

export const getProjectDetails = createAsyncThunk(
  "projectDetails/getProjectDetails",
  async (id: string) => {
    const { data } = await client.projects.findOne(id);
    return data;
  },
);

export const initialProjectDetails: ProjectDetails = {
  _id: "",
  brand: "ignition",
  slug: "",
  name: "",
  description: "",
  logo: "",
  mainImage: "",
  featuredBannerImageURL: "",
  featuredImageVideoURL: "",
  poolOpenDate: "",
  announcementDate: "",
  status: ProjectStatus.DRAFT,
  ended: false,
  canJoin: false,
  projectType: "",
  claimable: false,
  whitelistForm: "",
  winnersList: "",
  youtubeLiveVideo: "",
  restrictedCountries: [],
  currency: "",
  network: 97,
  projectChain: "",
  tokenFee: 0,
  totalRaise: undefined,
  totalRaiseSoftLimit: undefined,
  fundedToken: 0,
  token: {
    symbol: "",
    price: "",
    contractAddress: "",
    TGEDate: "",
    vesting: "",
    vestingUrl: "",
    tooltip: "",
    airdrop: false,
    image: "",
    TGEPercentage: "",
    decimal: undefined,
    ath: 0,
    listingOn: {
      uniSwap: "",
      pancakeSwap: "",
    },
    staking: "",
  },
  vesting: {
    TGEPercentage: "",
    TGEDate: "",
    description: "",
    cliffLength: {
      value: 0,
      periodUnit: "days",
    },
    frequency: {
      value: 1,
      periodUnit: "days",
    },
    numberOfRelease: 1,
    contractAddress: "",
  },
  KYCLimit: undefined,
  nonKYCLimit: undefined,
  social: {
    telegram: "",
    twitter: "",
    medium: "",
    website: "",
    whitepaper: "",
  },
  pools: [],
  transactionState: ProjectTransactionState.NONE,
  transactionErrorReason: "",
  featured: false,
  internal: false,
  hideTGE: false,
  nftSale: false,
  registrationEnabled: false,
  feeType: true,
  purchaseToken: {
    symbol: "",
    decimal: undefined,
    address: "",
  },
  deploy_status: EProjectAsyncStatus.NONE,
  submit_snapshot_at: "",
  submit_snapshot_status: EProjectAsyncStatus.NONE,
  submit_snapshot_tx_hash: "",
  stage: ProjectStages.DEFAULT,
  deploy_by: "",
  biography: "",
  investors: "",
  marketMaker: "",
};

const isNewVersion = (project: ProjectDetails) => {
  return project.pools.some(
    (pool) => pool.name.toLocaleLowerCase() === "crowdfunding",
  );
};

const initialState: ProjectDetailsState = {
  current: initialProjectDetails,
  isNewVersion: true,
  loading: false, // fetching project detail
  isOpenPoolDialog: false,
  isLoadingPoolTransaction: false,
  isLoadingVestingTransaction: false,
  claimableLoading: false,
  cancelLoading: false,
  deleteLoading: false,
  withdrawParticipantFeeLoading: false,
  withdrawProjectFeeLoading: false,
};

export const projectDetailsSlice = createSlice({
  name: "projectDetails",
  initialState,
  reducers: {
    updateDetails: (state, action: PayloadAction<ProjectDetails>) => {
      const projectDetails = action.payload as ProjectDetails;
      state.current = projectDetails;
      state.isNewVersion = isNewVersion(projectDetails);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProjectStatus: (state, action: PayloadAction<ProjectStatus>) => {
      state.current.status = action.payload;
    },
    updateClaimable: (state, action: PayloadAction<boolean>) => {
      state.current.claimable = action.payload as boolean;
    },
    updatePools: (state, action: PayloadAction<Pool[]>) => {
      state.current = {
        ...state.current,
        pools: action.payload,
      };
    },
    updatePoolDate: (
      state,
      action: PayloadAction<{
        pool: string;
        updatedTime: Date | string | null;
      }>,
    ) => {
      const { pool, updatedTime } = action.payload;
      state.current = {
        ...state.current,
        pools: updatePoolEndTime(pool, updatedTime, state.current.pools),
      };
    },
    updateTGEDate: (state, action: PayloadAction<Date | string | null>) => {
      state.current.vesting.TGEDate = action.payload;
    },
    setSubmitSnapshotStatus: (
      state,
      action: PayloadAction<EProjectAsyncStatus>,
    ) => {
      state.current.submit_snapshot_status = action.payload;
    },
    setOpenPoolDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenPoolDialog = action.payload;
    },
    setLoadingPoolTransaction: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPoolTransaction = action.payload;
    },
    setLoadingVestingTransaction: (state, action: PayloadAction<boolean>) => {
      state.isLoadingVestingTransaction = action.payload;
    },
    setClaimableLoading: (state, action: PayloadAction<boolean>) => {
      state.claimableLoading = action.payload;
    },
    setCancelLoading: (state, action: PayloadAction<boolean>) => {
      state.cancelLoading = action.payload;
    },
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteLoading = action.payload;
    },
    setWithdrawParticipantFeeLoading: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.withdrawParticipantFeeLoading = action.payload;
    },
    setWithdrawProjectFeeLoading: (state, action: PayloadAction<boolean>) => {
      state.withdrawProjectFeeLoading = action.payload;
    },
    setProposalStatus: (state, action: PayloadAction<ProposalStatus>) => {
      state.proposalStatus = action.payload;
    },
    setDefault: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProjectDetails.fulfilled, (state, action) => {
      const projectDetails = action.payload as ProjectDetails;
      state.loading = false;
      state.current = projectDetails;
      state.isNewVersion = isNewVersion(projectDetails);
    });
  },
});

export const {
  updateDetails,
  setLoading,
  setProjectStatus,
  updateClaimable,
  updatePools,
  setDefault,
  updatePoolDate,
  setOpenPoolDialog,
  setSubmitSnapshotStatus,
  setLoadingPoolTransaction,
  setClaimableLoading,
  setCancelLoading,
  setDeleteLoading,
  setWithdrawParticipantFeeLoading,
  setWithdrawProjectFeeLoading,
  updateTGEDate,
  setLoadingVestingTransaction,
  setProposalStatus,
} = projectDetailsSlice.actions;

export default projectDetailsSlice.reducer;
const client = APIClient.getInstance();
