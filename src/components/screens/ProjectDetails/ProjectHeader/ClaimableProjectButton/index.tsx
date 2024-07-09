import CheckListIcon from "@/components/icons/CheckListIcon";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { AppDispatch } from "@/store";
import {
  ADMIN_EXIST_ACTIVE,
  AlertTypes,
  ProjectTransactionType,
  TransactionKind,
  TransactionStatus,
} from "@/types";
import { Box, DialogContentText, Tooltip } from "@mui/material";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { setClaimableLoading } from "@/store/features/projectDetailsSlice";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { WarningWalletDialog } from "@/components/atoms/WarningWalletDialog";
import { useSelectorProjectDetail } from "@/store/hook";

const ClaimableButton = () => {
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const { account, connect } = useMetaMask();
  const { current: projectDetails, claimableLoading } =
    useSelectorProjectDetail();
  const dispatch = useDispatch<AppDispatch>();
  const { claimable, pools, network, _id } = projectDetails;
  const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const poolAddress = pools[0]?.contractAddress;

  useEffect(() => {
    const fetchTransactionsStatus = async () => {
      const client = APIClient.getInstance();
      const { data } = await client.transaction.getTransactionStatus(
        _id,
        TransactionKind.PROJECTv2,
        claimable
          ? ProjectTransactionType.DISABLE_CLAIM
          : ProjectTransactionType.ENABLE_CLAIM
      );
      setLoadingData(false);
      dispatch(setClaimableLoading(data === TransactionStatus.PENDING));
    };
    fetchTransactionsStatus();
  }, []);

  const setClaimable = async () => {
    try {
      if (!(poolAddress && network)) return;
      dispatch(setClaimableLoading(true));
      const apiClient = APIClient.getInstance();
      const trx = await apiClient.contracts.toggleClaimable(
        poolAddress,
        network,
        !claimable
      );

      const { hash, nonce } = trx;

      if (hash && account) {
        updateAlert("", "Data is being processed", AlertTypes.WARNING);
        const resp = await apiClient.transaction.createTransaction({
          project: _id,
          hash: hash,
          to: account,
          from: poolAddress,
          nonce: nonce,
          chainId: network,
          transactionKind: TransactionKind.PROJECTv2,
          transactionType: claimable
            ? ProjectTransactionType.DISABLE_CLAIM
            : ProjectTransactionType.ENABLE_CLAIM,
        });
      }
    } catch (error) {
      errorAlertHandler(error);
      dispatch(setClaimableLoading(false));
    } finally {
      closeDialog();
    }
  };

  const closeDialog = () => {
    setOpenWarningDialog(false);
    setOpenConfirmDialog(false);
  };

  const handleClaimable = async () => {
    try {
      let _account = account;
      if (!_account) {
        const _accounts = await connect();
        if (_accounts && _accounts.length > 0) {
          _account = _accounts[0];
        } else {
          throw Error("Connect error");
        }
      }

      const client = APIClient.getInstance();

      const { data } = await client.setAdmins.isExisted(ADMIN_EXIST_ACTIVE, {
        adminAddress: ethers.getAddress(_account),
        network: Number(network),
      });

      if (!data) {
        return setOpenWarningDialog(true);
      }

      return setOpenConfirmDialog(true);
    } catch (error) {
      errorAlertHandler(error);
    }
  };

  return (
    <>
      <Tooltip title={claimableLoading ? "Data is being processed" : ""}>
        <Box>
          <LoadingButton
            sx={{ px: 4, whiteSpace: "nowrap", height: "40px" }}
            loading={claimableLoading}
            disabled={loadingData}
            onClick={handleClaimable}
          >
            {claimable ? "Disable Claim" : "Enable Claim"}
          </LoadingButton>
        </Box>
      </Tooltip>

      <WarningWalletDialog open={openWarningDialog} onClose={closeDialog} />

      <Dialog
        sx={{ textAlign: "center" }}
        open={openConfirmDialog}
        onClose={closeDialog}
        width="477px"
      >
        <DialogIcon>
          <CheckListIcon />
        </DialogIcon>
        <DialogTitle>Confirmation Required</DialogTitle>
        <DialogContentText>Are you sure you want to proceed?</DialogContentText>
        <DialogActions mt="10px">
          <LoadingButton
            sx={{
              my: 2,
              width: 180,
              height: 40,
            }}
            onClick={setClaimable}
            loading={claimableLoading}
            color="primary"
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClaimableButton;
