import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dialog, DialogActions, DialogIcon } from "@/components/atoms/Dialog";
import { DialogContentText, Typography, useTheme } from "@mui/material";
import { ConfirmWithdrawIcon } from "@/components/icons";
import { AllowedNetwork } from "@/types";
import { LoadingButton } from "@mui/lab";

type Props = {
  walletAddress: string;
  amount: string | number;
  network: number;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitPending: boolean;
};

export default function ConfirmWithdraw({
  walletAddress,
  amount,
  network,
  open,
  onClose,
  onConfirm,
  onBack,
  isSubmitPending,
}: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const networkLabel = AllowedNetwork[network];
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ padding: theme.spacing(2) }}
      width="370px"
    >
      <ArrowBackIcon
        onClick={() => !isSubmitPending && onBack}
        sx={{
          color: isSubmitPending
            ? theme.palette.text.disabled
            : theme.palette.text.primary,
        }}
      />
      <DialogIcon>
        <ConfirmWithdrawIcon />
      </DialogIcon>
      <Typography
        variant="h4"
        component="span"
        sx={{
          flexGrow: 1,
          color: theme.palette.text.primary,
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0.02em",
          paddingTop: "10px",
          textAlign: "center",
        }}
      >
        Confirm withdraw
      </Typography>
      <DialogContentText
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: "17px",
          wordBreak: "break-all",
        }}
      >
        <Typography
          component="span"
          sx={{
            display: "block",
            color: theme.palette.grey[800],
            pt: 1,
            pb: 2,
          }}
        >
          You are about to withdraw USDT/USDC from IDO pool:
        </Typography>
        Receiving address: {walletAddress}
        <br />
        Amount: {amount}
        <br />
        Network: {networkLabel}
      </DialogContentText>
      <DialogActions sx={{ display: "flex", gap: "15px", pt: 4 }}>
        <LoadingButton
          sx={{
            width: 1 / 2,
            height: "40px",
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            textTransform: "none",
          }}
          variant="outlined"
          onClick={() => {
            onClose && onClose();
          }}
          loading={loading}
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          type="submit"
          sx={{ width: 1 / 2, height: "40px" }}
          onClick={handleConfirm}
          loading={loading}
        >
          Withdraw
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
