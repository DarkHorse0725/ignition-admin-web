import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { AppDispatch } from "@/store";
import {
  setCancelLoading,
  updateDetails,
} from "@/store/features/projectDetailsSlice";
import {
  ADMIN_EXIST_ACTIVE,
  AlertTypes,
  ProjectStatus,
  ProjectTransactionType,
  TransactionKind,
  TransactionStatus,
} from "@/types";
import { Button, DialogContentText, Tooltip, useTheme } from "@mui/material";
import { useMetaMask } from "metamask-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { WithdrawTabIcon } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { WarningWalletDialog } from "@/components/atoms/WarningWalletDialog";
import { useSelectorProjectDetail } from "@/store/hook";
import { checkExistAdmin } from "../../projectTabs/ProjectPoolsTab/poolFunction";

const apiClient = APIClient.getInstance();
const CancelProjectButton = () => {
  const { updateAlert, errorAlertHandler } = useAlertContext();
  const { account, connect, status } = useMetaMask();
  const [isOpenNotAdminWalletDialog, setIsOpenNotAdminWalletDialog] =
    useState(false);
  const { current: projectDetails, cancelLoading } = useSelectorProjectDetail();
  const {
    _id,
    announcementDate,
    pools,
    network,
    status: projectStatus,
  } = projectDetails;
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const poolAddress = pools[0]?.contractAddress;
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactionsStatus = async () => {
      const client = APIClient.getInstance();
      if (projectStatus !== ProjectStatus.FINISHED) {
        const { data } = await client.transaction.getTransactionStatus(
          _id,
          TransactionKind.PROJECTv2,
          ProjectTransactionType.CANCEL
        );
        dispatch(setCancelLoading(data === TransactionStatus.PENDING));
      } else {
        const { data } = await client.transaction.getTransactionStatus(
          _id,
          TransactionKind.PROJECTv2,
          ProjectTransactionType.EMERGENCY_CANCELLED
        );
        dispatch(setCancelLoading(data === TransactionStatus.PENDING));
      }
    };
    fetchTransactionsStatus();
  }, []);

  const cancelProjectAfterDeploy = async (
    account: string | null,
    poolAddress: string,
    network: number
  ) => {
    if (status === "unavailable")
      return window.open("https://metamask.io/", "_blank");

    let accountConnected: string | null = "";

    if (status === "notConnected") {
      const rs = await connect();
      accountConnected = rs && rs[0];
    }

    const isActive = await checkExistAdmin(
      ADMIN_EXIST_ACTIVE,
      account || accountConnected,
      network
    );

    if (!isActive) {
      setIsOpenNotAdminWalletDialog(true);
      setOpenConfirmDialog(false);
      return;
    }

    try {
      dispatch(setCancelLoading(true));

      const galaxyPoolTrx = await apiClient.contracts.cancelPool(
        poolAddress,
        network,
        "cancel"
      );

      if (galaxyPoolTrx?.message) {
        updateAlert("", galaxyPoolTrx?.message, AlertTypes.ERROR);
      }
      const { hash, nonce } = galaxyPoolTrx;
      if (hash && account) {
        updateAlert("", "Data is being processed", AlertTypes.WARNING);
        projectStatus !== ProjectStatus.FINISHED
          ? await apiClient.transaction.createTransaction({
              project: _id,
              hash: hash,
              to: account,
              from: poolAddress,
              nonce: nonce,
              chainId: network,
              transactionKind: TransactionKind.PROJECTv2,
              transactionType: ProjectTransactionType.CANCEL,
            })
          : await apiClient.transaction.createTransaction({
              project: _id,
              hash: hash,
              to: account,
              from: poolAddress,
              nonce: nonce,
              chainId: network,
              transactionKind: TransactionKind.PROJECTv2,
              transactionType: ProjectTransactionType.EMERGENCY_CANCELLED,
            });
      }
    } catch (error) {
      console.log(error);

      errorAlertHandler(error);
      dispatch(setCancelLoading(false));
    } finally {
      closeDialog();
    }
  };

  const cancelProjectBeforeDeploy = async (projectId: string) => {
    const client = APIClient.getInstance();
    try {
      dispatch(setCancelLoading(true));
      const { data } = await client.projects.cancel(projectId);
      dispatch(updateDetails(data));
      updateAlert(``, `Project has been cancelled`, AlertTypes.SUCCESS);
      setOpenConfirmDialog(false);
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      dispatch(setCancelLoading(false));
    }
  };

  const handleCancelProject = async () => {
    if (!_id) return;
    poolAddress
      ? await cancelProjectAfterDeploy(account, poolAddress, network)
      : await cancelProjectBeforeDeploy(_id);
  };

  const closeDialog = () => {
    setOpenConfirmDialog(false);
    setIsOpenNotAdminWalletDialog(false);
  };

  return (
    <>
      <Tooltip
        title={
          !announcementDate
            ? "Announcement Date is Required"
            : cancelLoading && "Data is being processed"
        }
      >
        <span>
          <LoadingButton
            type="submit"
            loading={cancelLoading}
            sx={{ width: "112px", height: "40px" }}
            onClick={() => setOpenConfirmDialog(true)}
          >
            Cancel
          </LoadingButton>
        </span>
      </Tooltip>
      <WarningWalletDialog
        open={isOpenNotAdminWalletDialog}
        onClose={closeDialog}
      />

      <Dialog
        open={openConfirmDialog}
        onClose={() => {
          if (cancelLoading) return;
          closeDialog();
        }}
        width="396px"
      >
        <DialogIcon>
          <WithdrawTabIcon size={60} color={theme.palette.primary.main} />
        </DialogIcon>
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Project</DialogTitle>
        <DialogContentText textAlign={"center"} sx={{ fontSize: "14px" }}>
          You are cancelling the project. Once the project is <br /> cancelled,
          you can not perform any action with that <br />
          project. Do you want to proceed?
        </DialogContentText>
        <DialogActions
          mt="10px"
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Button
            sx={{
              my: 2,
              width: 156,
              height: 40,
              background: theme.palette.background.default,
              border: 1,
              borderColor: theme.palette.blue[400],
            }}
            disabled={cancelLoading}
            onClick={closeDialog}
          >
            No
          </Button>
          <LoadingButton
            sx={{
              my: 2,
              width: 156,
              height: 40,
            }}
            onClick={handleCancelProject}
            loading={cancelLoading}
            color="primary"
          >
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CancelProjectButton;
