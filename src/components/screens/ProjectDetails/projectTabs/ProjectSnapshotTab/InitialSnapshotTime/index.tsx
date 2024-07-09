import { APIClient } from "@/core/api";
import { detectPools, formatDate } from "@/helpers";
import { useAlertContext } from "@/providers/AlertContext";
import { AppDispatch } from "@/store";
import { ADMIN_EXIST_ACTIVE, AlertTypes, EProjectAsyncStatus } from "@/types";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Tooltip, styled, useTheme } from "@mui/material";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import WarningContractAdminList from "../WarningContractAdminList";
import { getProjectDetails } from "@/store/features/projectDetailsSlice";
import ConfirmSubmitDialog from "../ConfirmSubmitDialog";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
// import { isBefore } from "date-fns";

const StyledWrapper = styled(Box)({
  borderRadius: 4,
  height: 42,
  flex: 1,
  padding: 8,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 12,
  lineHeight: "22px",
});

const StyledActionButton = styled(LoadingButton)(({ theme }) => ({
  height: 26,
  width: "88px",
  textTransform: "capitalize",
  fontWeight: 700,
  fontSize: "12px !important",
  lineHeight: "18px !important",
  letterSpacing: "0.02em",
  border: "1px solid #3856B0 !important",
  "&.Mui-disabled": {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.text.primary,
  },
}));

interface InitialSnapshotTimeProps {
  isSubmittingTime: boolean;
  isEditingTime: boolean;
  submittingTime?: Date;
  disableSubmitButton: boolean;
  totalRecords: number;
  isLoading: boolean;
  isEditingRecord: boolean;
  handleAddRecord: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isSnapshotted: boolean;
}

const InitialSnapshotTime = ({
  isSubmittingTime,
  isEditingTime,
  submittingTime,
  disableSubmitButton,
  totalRecords,
  isLoading,
  isEditingRecord,
  handleAddRecord,
  isSubmitting,
  setIsSubmitting,
  isSnapshotted,
}: InitialSnapshotTimeProps) => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useSelectorAuth();
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_SNAPSHOT,
  );

  const {
    _id: projectId,
    submit_snapshot_status,
    pools,
    network,
  } = projectDetails;

  const { status: statusConnectMetamask, connect, account } = useMetaMask();
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const [openWarningContractAdmin, setOpenWarningContractAdmin] =
    useState(false);

  // =========== For dialog ===========
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const {
    galaxyPool: { contractAddress },
  } = detectPools(pools);

  const handleSubmitSnapshot = async () => {
    setIsSubmitting(true);
    closeDialog();
    if (!projectId) return;

    const { ethereum }: any = window;
    if (!contractAddress) {
      setIsSubmitting(false);
      return updateAlert(``, `Pool address not found`, AlertTypes.ERROR);
    }
    // No Install
    if (!ethereum) {
      setIsSubmitting(false);
      return updateAlert(``, `Metamask not detected`, AlertTypes.ERROR);
    }

    //No connect
    if (statusConnectMetamask === "notConnected") await connect();

    if (!account) {
      setOpenWarningContractAdmin(true);
      setIsSubmitting(false);
      return;
    }

    const apiClient = APIClient.getInstance();
    const { data } = await apiClient.setAdmins.isExisted(ADMIN_EXIST_ACTIVE, {
      adminAddress: ethers.getAddress(account),
      network: network,
    });
    if (!data) {
      setOpenWarningContractAdmin(true);
      setIsSubmitting(false);
      return;
    }

    let root;
    try {
      const resp = await apiClient.snapshot.submit(projectId);
      root = resp.data;
    } catch (error) {
      setIsSubmitting(false);
      errorAlertHandler(error);
    }

    if (!root) return;
    try {
      const transactionReceipt: any = await apiClient.contracts.setRoot(
        contractAddress,
        network,
        root,
      );
      if (transactionReceipt?.hash) {
        updateAlert("", `Data is being processed`, AlertTypes.WARNING);
        await apiClient.projects.startSubmitSnapshot(
          projectId,
          transactionReceipt.hash,
        );

        dispatch(getProjectDetails(projectId));
      }
    } catch (error) {
      await apiClient.snapshot.cancel(projectId);
      setIsSubmitting(false);
      errorAlertHandler(error);
    }
  };

  const showSubmitBtn =
    isSubmittingTime &&
    totalRecords > 0 &&
    [EProjectAsyncStatus.PENDING, EProjectAsyncStatus.SUCCESS].includes(
      submit_snapshot_status ?? EProjectAsyncStatus.NONE,
    );

  return (
    <>
      <StyledWrapper
        sx={{
          background: !isSnapshotted
            ? theme.palette.error.main
            : theme.palette.blue[100],
          color: !isSnapshotted
            ? theme.palette.text.primary
            : theme.palette.blue[400],
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: 800 }}>
            {!isSnapshotted ? "Initial Snapshot Time:" : "Snapshot Completed"}
          </span>{" "}
          {!isSnapshotted
            ? submittingTime
              ? formatDate(submittingTime)
              : "--"
            : ""}
        </Box>
        {isSnapshotted && permissionOfResource.includes(PERMISSION.WRITE) && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {isEditingTime && (
              <Tooltip title={isSubmitting ? "Data is being processed" : ""}>
                <span>
                  <StyledActionButton
                    sx={{
                      background: theme.palette.blue[200],
                      color: theme.palette.blue[300],
                    }}
                    disabled={isEditingRecord || isLoading || isSubmitting}
                    onClick={handleAddRecord}
                  >
                    Add
                  </StyledActionButton>
                </span>
              </Tooltip>
            )}
            {showSubmitBtn && (
              <Tooltip
                title={
                  disableSubmitButton
                    ? "Pools have not been deployed"
                    : isSubmitting
                      ? "Data is being processed"
                      : ""
                }
              >
                <span>
                  <StyledActionButton
                    disabled={disableSubmitButton}
                    loading={isSubmitting}
                    onClick={openDialog}
                    color="primary"
                  >
                    Submit
                  </StyledActionButton>
                </span>
              </Tooltip>
            )}
          </Stack>
        )}
      </StyledWrapper>
      <WarningContractAdminList
        open={openWarningContractAdmin}
        onClose={() => setOpenWarningContractAdmin(false)}
      />
      <ConfirmSubmitDialog
        isOpen={isDialogOpen}
        handleClose={closeDialog}
        handleSubmit={handleSubmitSnapshot}
      />
    </>
  );
};

export default InitialSnapshotTime;
