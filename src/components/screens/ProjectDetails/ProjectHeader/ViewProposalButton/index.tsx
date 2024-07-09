import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Box, Button, DialogContentText, Tooltip, Typography, } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { useMetaMask } from "metamask-react";

import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { ConfirmWithdrawIcon } from "@/components/icons";
import { Dialog, DialogActions, DialogIcon, DialogTitle, } from "@/components/atoms/Dialog";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
import { getTokenInfo } from "@/helpers/getTokenInfo";
import { ADMIN_EXIST_ACTIVE, ActionName, AlertTypes, AllowedNetwork, NETWORK_NAMES, ProjectStatus, ProposalInfo, ProposalStatus, } from "@/types";
import Modal from "@/components/atoms/Modal";
import { ProjectTypeEnums } from "../../initData";
import { WarningWalletDialog } from "@/components/atoms/WarningWalletDialog";
import { PERMISSION, RESOURCES, getPermissionOfResource, } from "@/core/ACLConfig";
import { setProposalStatus } from "@/store/features/projectDetailsSlice";
import { useDispatch } from "react-redux";
import { checkExistAdmin } from "../../projectTabs/ProjectPoolsTab/poolFunction";

const apiClient = APIClient.getInstance();

interface TokenInfo {
  symbol: string;
  decimals: number | string;
}

interface ViewProposalButtonProps {
  setIsProposalApproved: (isApproved: boolean) => void;
  infoDialogOpen: boolean;
  setInfoDialogOpen: (isOpen: boolean) => void;
  purchaseAmount: number;
}

const ErrorTypography = ({ children }: { children: ReactNode }) => {
  return (
    <Typography variant="h6" color="error.main" sx={{ fontStyle: "italic" }}>
      {children}
    </Typography>
  );
};

const ViewProposalButton = (props: ViewProposalButtonProps) => {
  const { setIsProposalApproved, infoDialogOpen, setInfoDialogOpen, purchaseAmount, } = props;
  const { updateAlert, errorAlertHandler } = useAlertContext();
  const { current: projectDetails } = useSelectorProjectDetail();
  const {
    _id: projectId,
    network,
    token,
    pools,
    vesting,
    projectType,
    status,
  } = projectDetails;
  const { TGEDate } = vesting;
  const poolAddress = pools[0]?.contractAddress;
  const { decimal, symbol: projectTokenSymbol } = token;
  const { connect, account } = useMetaMask();
  const dispatch = useDispatch();
  const { role } = useSelectorAuth();
  const viewPermission = getPermissionOfResource(role, RESOURCES.PROJECT_PUBLISH);

  // For Review Proposal Dialog
  const [proposalInfo, setProposalInfo] = useState<ProposalInfo>();
  const { status: proposalStatus, IDOTokenAddress, _id: proposalId } = proposalInfo || { status: ProposalStatus.NotFound, IDOTokenAddress: "", _id: "", };
  const [viewProposalButtonLoading, setViewProposalButtonLoading] = useState(false);
  const [IDOTokenInfo, setIDOTokenInfo] = useState<TokenInfo>();
  const { symbol: IDOTokenSymbol, decimals: IDOTokenDecimals } = IDOTokenInfo || { symbol: "N/A", decimals: "N/A" };
  const [isSymbolMatch, setIsSymbolMatch] = useState(false);
  const [isDecimalMatch, setIsDecimalMatch] = useState(false);
  const [isActionButtonsLoading, setIsActionButtonsLoading] = useState(false);

  // For Confirmation Dialog
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [actionName, setActionName] = useState(ActionName.Reject);

  // For Non Admin Dialog
  const [notAdminModalOpen, setNotAdminModalOpen] = useState(false);

  const showViewProposalButton =
    !viewPermission.includes(PERMISSION.NONE) && // user has permission to view proposal (admin, super admin)
    proposalStatus !== ProposalStatus.Approved && // proposal is not approved
    dayjs().isBefore(dayjs(TGEDate)) && // current time is before TGE date
    purchaseAmount !== 0 && // user has purchased tokens
    projectType === ProjectTypeEnums.PRIVATE_SALE && // project type is private sale
    poolAddress && // pool contract is deployed
    status === ProjectStatus.FINISHED; // current time is before TGE date

  const handleGetIDOTokenInfo = useCallback(
    (tokenAddress: string, networkLabel: string) => {
      getTokenInfo(tokenAddress, networkLabel)
        .then((res: any) => {
          const { symbol, decimals } = res;
          const convertedDecimals = Number(decimals);
          setIDOTokenInfo({
            symbol,
            decimals: convertedDecimals,
          });
          setIsSymbolMatch(symbol === projectTokenSymbol);
          setIsDecimalMatch(convertedDecimals === decimal);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [projectTokenSymbol, decimal]
  );

  const getProposalInfo = useCallback(async () => {
    setViewProposalButtonLoading(true);

    try {
      const res = await apiClient.projects.getProposalInfo(projectId);
      const { IDOTokenAddress, status } = res;
      setProposalInfo(res);

      setIsProposalApproved(status === ProposalStatus.Approved); // to show/hide the proposal status in the header (ProjectHeader component)
      dispatch(setProposalStatus(status));

      const networkLabel = AllowedNetwork[`${network}`];
      handleGetIDOTokenInfo(IDOTokenAddress, networkLabel);
    } catch (error) {
      console.error(error);
      setProposalInfo(undefined);
      dispatch(setProposalStatus(ProposalStatus.NotFound));
    } finally {
      setViewProposalButtonLoading(false);
    }
  }, [projectId, setIsProposalApproved, dispatch, network, handleGetIDOTokenInfo]);

  useEffect(() => {
    if (projectId) getProposalInfo();
  }, [projectId, getProposalInfo]);

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  const openConfirmationDialog = (actionName: ActionName) => {
    setActionName(actionName);
    setConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const buildFundSignature = async () => {
    await apiClient.contracts.switchToSameEthereumNetwork(network);
    const IDOToken = IDOTokenAddress;
    const pool = poolAddress;
    const decimals = decimal;
    const domain = {
      name: "Pool",
      version: "1",
      chainId: network,
      verifyingContract: poolAddress,
    };

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      throw {
        status: 500,
        message: "Metamask not detected",
      };
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signTypedData(
      domain,
      {
        Fund: [
          { name: "IDOToken", type: "address" },
          { name: "pool", type: "address" },
          { name: "symbol", type: "string" },
          { name: "decimals", type: "uint8" },
        ],
      },
      {
        owner: account,
        IDOToken,
        pool,
        symbol: projectTokenSymbol,
        decimals,
      }
    );
    return signature;
  };

  const checkIsContractAdmin = async () => {
    const isContractAdmin = async (walletAddress: string | null = "") => {
      return await checkExistAdmin(ADMIN_EXIST_ACTIVE, walletAddress, network);
    }

    const handleNotContractAdmin = () => {
      closeInfoDialog();
      closeConfirmationDialog();
      setNotAdminModalOpen(true);
    }

    if (!account) {
      let accountConnected: string | null = "";
      const rs = await connect();
      accountConnected = rs && rs[0];
      const isAdminContract = await isContractAdmin(accountConnected);
      if (!isAdminContract) {
        handleNotContractAdmin();
        return false;
      }
    } else {
      const isAdminContract = await isContractAdmin(account);
      if (!isAdminContract) {
        handleNotContractAdmin();
        return false;
      }
    }
    return true;
  }

  const handleProposalAction = async () => {
    setIsActionButtonsLoading(true);
    try {
      if (actionName === ActionName.Reject) {
        await apiClient.projects.rejectProposal(projectId, proposalId);
      } else if (actionName === ActionName.Approve) {
        const isContractAdmin = await checkIsContractAdmin();
        if (!isContractAdmin) return;
        const signature = await buildFundSignature();
        await apiClient.projects.approveProposal(
          projectId,
          signature,
          proposalId
        );
      }

      updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
      closeInfoDialog();
      getProposalInfo();
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      closeConfirmationDialog();
      setIsActionButtonsLoading(false);
    }
  };

  const isApproveButtonEnabled = isSymbolMatch && isDecimalMatch;

  return (
    <>
      {showViewProposalButton &&
        (proposalStatus === ProposalStatus.Rejected ||
          proposalStatus === ProposalStatus.NotFound ? (
          <Tooltip title="There is no new proposal to review" placement="top">
            <Box>
              <Button sx={{ width: "171px", height: "40px", mr: 2 }} disabled>
                View Proposal
              </Button>
            </Box>
          </Tooltip>
        ) : (
          <LoadingButton
            sx={{ width: "171px", height: "40px", mr: 2 }}
            loading={viewProposalButtonLoading}
            onClick={() => setInfoDialogOpen(true)}
          >
            View Proposal
          </LoadingButton>
        ))}

      {/* Review Proposal Dialog */}
      <Dialog open={infoDialogOpen} onClose={closeInfoDialog} width="550px">
        <DialogIcon>
          <ConfirmWithdrawIcon />
        </DialogIcon>
        <DialogTitle>
          {proposalStatus !== ProposalStatus.Approved ? "Review" : "View"}{" "}
          Proposal
        </DialogTitle>
        <DialogContentText m="20px">
          <Box my={"10px"}>
            <ul>
              <li>
                <Typography variant="h6">
                  IDO Token Address: {IDOTokenAddress}
                </Typography>
                {!IDOTokenInfo && (
                  <ErrorTypography>
                    Address can not be found on {NETWORK_NAMES[network as AllowedNetwork]}
                  </ErrorTypography>
                )}
              </li>
              <li>
                <Typography variant="h6">
                  Symbol: {IDOTokenSymbol}
                </Typography>
                {IDOTokenInfo && !isSymbolMatch && (
                  <ErrorTypography>Symbol not match</ErrorTypography>
                )}
              </li>
              <li>
                <Typography variant="h6">
                  Token Decimal: {IDOTokenDecimals}
                </Typography>
                {IDOTokenInfo && !isDecimalMatch && (
                  <ErrorTypography>Token Decimal not match</ErrorTypography>
                )}
              </li>
            </ul>
          </Box>
          <Typography variant="h6" color="grey.800">
            Compare with token info of project on Ignition:
          </Typography>
          <Box my={"10px"}>
            <ul>
              <li>
                <Typography variant="h6">
                  Symbol: {projectTokenSymbol}
                </Typography>
              </li>
              <li>
                <Typography variant="h6">
                  Token Decimal: {decimal}
                </Typography>
              </li>
              <li>
                <Typography variant="h6">
                  Network: {NETWORK_NAMES[network as AllowedNetwork]}
                </Typography>
              </li>
              <li>
                <Typography variant="h6">
                  Pool Address: {poolAddress}
                </Typography>
              </li>
            </ul>
          </Box>
          {!isApproveButtonEnabled && (
            <ErrorTypography>
              IDO token information (Network, Decimal) must match with the
              project data to proceed the vesting and withdraw fund process. If
              not, you CAN NOT approve the proposal.
            </ErrorTypography>
          )}
        </DialogContentText>
        {proposalStatus !== ProposalStatus.Approved && (
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LoadingButton
              sx={{
                my: 2,
                width: 180,
                height: 40,
              }}
              onClick={() => openConfirmationDialog(ActionName.Reject)}
              color="secondary"
              loading={isActionButtonsLoading}
            >
              Reject
            </LoadingButton>
            <LoadingButton
              sx={{
                my: 2,
                ml: 2,
                width: 180,
                height: 40,
              }}
              disabled={!isApproveButtonEnabled}
              onClick={() => openConfirmationDialog(ActionName.Approve)}
              loading={isActionButtonsLoading}
              color="primary"
            >
              Approve
            </LoadingButton>
          </DialogActions>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmationDialogOpen}
        onClose={closeConfirmationDialog}
        width={396}
      >
        <Box>
          <DialogIcon>
            <ConfirmWithdrawIcon />
          </DialogIcon>
          <DialogTitle color="common.white">{actionName} Proposal</DialogTitle>
          <DialogActions
            mt="10px"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LoadingButton
              sx={{
                my: 2,
                width: 180,
                height: 40,
              }}
              onClick={closeConfirmationDialog}
              color="secondary"
              loading={isActionButtonsLoading}
            >
              Back
            </LoadingButton>
            <LoadingButton
              sx={{
                my: 2,
                ml: 2,
                width: 180,
                height: 40,
              }}
              onClick={handleProposalAction}
              loading={isActionButtonsLoading}
              color="primary"
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </Box>
      </Modal>

      {/* Warning Modal */}
      <WarningWalletDialog
        open={notAdminModalOpen}
        onClose={() => setNotAdminModalOpen(false)}
      />
    </>
  );
};

export default ViewProposalButton;
