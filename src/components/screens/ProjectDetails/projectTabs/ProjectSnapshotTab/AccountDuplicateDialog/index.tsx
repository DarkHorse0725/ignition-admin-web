import { Dialog, DialogIcon } from "@/components/atoms/Dialog";
import { WalletIcon } from "@/components/icons";
import { APIClient } from "@/core/api";
import { SnapshotRecord } from "@/types";
import { Box, DialogContentText, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  email: string;
  open: boolean;
  onClose: () => void;
};

interface RecordData {
  email: string;
  numberOfAllocation: string;
  allocationValue: string;
}
export const AccountDuplicateDialog = ({
  projectId,
  email,
  open,
  onClose,
}: Props) => {
  const theme = useTheme();
  const [data, setData] = useState<SnapshotRecord>();
  useEffect(() => {
    (async () => {
      try {
        if (!email) return;

        const apiClient = APIClient.getInstance();
        const { data } = await apiClient.snapshot.getRecordDetails(
          projectId,
          email
        );

        setData(data);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      setData(undefined);
    };
  }, [email]);

  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={open}
      onClose={onClose}
      width="400px"
    >
      <DialogIcon>
        <WalletIcon size={53} />
      </DialogIcon>
      <Typography
        sx={{
          fontSize: "16px",
          color: theme.palette.common.white,
          fontWeight: "700",
          pb: "6px",
        }}
        component="span"
      >
        Account Duplicate
      </Typography>
      <DialogContentText
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            color: theme.palette.text.secondary,
            pb: 1,
            textAlign: "left",
          }}
          component="span"
        >
          There is already a Snapshot record associated this account
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: "700",
            color: theme.palette.text.secondary,
          }}
          component="span"
        >
          Account: {data?.email}
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: "700",
            color: theme.palette.text.secondary,
          }}
          component="span"
        >
          Number of Galaxy Allocation: {data?.numberOfAllocation}
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: "700",
            pb: 1,
            color: theme.palette.text.secondary,
          }}
          component="span"
        >
          Galaxy Allocation Value: {data?.allocationValue}$
        </Typography>
        <Typography
          sx={{ fontSize: "13px", color: theme.palette.text.secondary }}
          component="span"
        >
          Please use search function then editing this record.
        </Typography>
      </DialogContentText>
    </Dialog>
  );
};
