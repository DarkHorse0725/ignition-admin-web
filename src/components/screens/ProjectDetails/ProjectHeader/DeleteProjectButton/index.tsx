import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { AppDispatch } from "@/store";
import { setDeleteLoading } from "@/store/features/projectDetailsSlice";
import {
  ADMIN_EXIST_ACTIVE,
  AlertTypes,
  ProjectStatus,
  ProjectTransactionType,
  TransactionKind,
  TransactionStatus,
} from "@/types";
import {
  Box,
  Button,
  DialogContentText,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useMetaMask } from "metamask-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { WarningWalletDialog } from "@/components/atoms/WarningWalletDialog";
import { useSelectorProjectDetail } from "@/store/hook";
import { useRouter } from "next/router";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { checkExistAdmin } from "../../projectTabs/ProjectPoolsTab/poolFunction";

const apiClient = APIClient.getInstance();
const DeleteProjectButton = () => {
  const { updateAlert, errorAlertHandler } = useAlertContext();
  const { account, connect, status } = useMetaMask();
  const [isOpenNotAdminWalletDialog, setIsOpenNotAdminWalletDialog] =
    useState(false);
  const { current: projectDetails, deleteLoading } = useSelectorProjectDetail();
  const { _id, pools, network, status: projectStatus } = projectDetails;
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const poolAddress = pools[0]?.contractAddress;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactionsStatus = async () => {
      const client = APIClient.getInstance();
      const { data } = await client.transaction.getTransactionStatus(
        _id,
        TransactionKind.PROJECTv2,
        ProjectTransactionType.DELETE
      );
      dispatch(setDeleteLoading(data === TransactionStatus.PENDING));
    };
    fetchTransactionsStatus();
  }, []);

  const deleteProjectAfterDeploy = async (
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
      dispatch(setDeleteLoading(true));
      const galaxyPoolTrx = await apiClient.contracts.cancelPool(
        poolAddress,
        network,
        "delete"
      );
      if (galaxyPoolTrx?.message) {
        updateAlert("", galaxyPoolTrx?.message, AlertTypes.ERROR);
      }
      const { hash, nonce } = galaxyPoolTrx;
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
          transactionType: ProjectTransactionType.DELETE,
        });
      }
    } catch (error) {
      errorAlertHandler(error);
      dispatch(setDeleteLoading(false));
    } finally {
      closeDialog();
    }
  };

  const deleteProjectBeforeDeploy = async (projectId: string) => {
    const client = APIClient.getInstance();
    try {
      dispatch(setDeleteLoading(true));
      const { data } = await client.projects.delete(projectId);
      updateAlert(``, `Project has been deleted`, AlertTypes.SUCCESS);
      router.push("/admin/projects");
      setOpenConfirmDialog(false);
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      dispatch(setDeleteLoading(false));
    }
  };

  const handleDeleteProject = async () => {
    if (!_id) return;
    poolAddress && projectStatus !== ProjectStatus.CANCELLED
      ? await deleteProjectAfterDeploy(account, poolAddress, network)
      : await deleteProjectBeforeDeploy(_id);
  };

  const closeDialog = () => {
    setOpenConfirmDialog(false);
    setIsOpenNotAdminWalletDialog(false);
  };
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Tooltip title={deleteLoading && "Data is being processed"}>
          <span>
            <LoadingButton
              type="submit"
              loading={deleteLoading}
              sx={{
                background: theme.palette.background.default,
                padding: 0,
                minWidth: "0px",
                "&.Mui-disabled": {
                  background: theme.palette.background.default,
                },
                "& .MuiCircularProgress-root": {
                  width: "30px!important",
                  height: "30px!important",
                  display: "inline-block",
                },
                "& .MuiCircularProgress-svg": {
                  width: "30px",
                  height: "30px",
                },
              }}
              onClick={() => setOpenConfirmDialog(true)}
            >
              <DeleteIcon
                width="18px"
                height="19px"
                fill={
                  deleteLoading
                    ? theme.palette.background.default
                    : theme.palette.grey[500]
                }
              />
            </LoadingButton>
          </span>
        </Tooltip>
        <WarningWalletDialog
          open={isOpenNotAdminWalletDialog}
          onClose={() => {
            if (deleteLoading) return;
            closeDialog();
          }}
        />
      </Box>
      <Dialog open={openConfirmDialog} onClose={closeDialog} width="396px">
        <DialogIcon>
          <DeleteIcon
            width="50"
            height="60"
            fill={theme.palette.primary.main}
          />
        </DialogIcon>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Project</DialogTitle>
        <DialogContentText textAlign={"center"} sx={{ fontSize: "14px" }}>
          You are deleting the project. Once the project is deleted,
          <br /> it will be removed from both Admin panel and Ignition.
          <br /> Do you want to proceed?
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
            onClick={closeDialog}
            disabled={deleteLoading}
          >
            No
          </Button>
          <LoadingButton
            sx={{
              my: 2,
              width: 156,
              height: 40,
            }}
            onClick={handleDeleteProject}
            loading={deleteLoading}
            color="primary"
          >
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProjectButton;
