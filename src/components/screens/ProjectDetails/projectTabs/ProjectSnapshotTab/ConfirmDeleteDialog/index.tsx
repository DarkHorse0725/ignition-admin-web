import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  account: string;
  onSubmit: () => Promise<void>;
}
const ConfirmDeleteDialog = ({
  open,
  onClose,
  account,
  onSubmit,
}: ConfirmDeleteDialogProps) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose} width="350px">
      <DialogIcon>
        <DeleteIcon width={64} height={64} fill={theme.palette.primary.main} />
      </DialogIcon>
      <DialogTitle>Confirm Remove Record</DialogTitle>
      <Stack spacing="15px">
        <Typography variant="body1" color="text.secondary">
          You are about to remove a record from Snapshot list.
        </Typography>
        <Typography
          sx={{ fontSize: "12px", fontWeight: 700 }}
          color="text.secondary"
        >
          Account: {account}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Do you want to proceed?
        </Typography>
        <DialogActions>
          <LoadingButton sx={{ width: "112px" }} onClick={onSubmit}>
            Submit
          </LoadingButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
