import { Dialog, DialogIcon } from "@/components/atoms/Dialog";
import { WalletIcon } from "@/components/icons";
import { DialogContentText } from "@mui/material";
import React from "react";

interface WarningContractAdminListProps {
  open: boolean;
  onClose: () => void;
}
const WarningContractAdminList = ({
  open,
  onClose,
}: WarningContractAdminListProps) => {
  return (
    <Dialog width="432px" open={open} onClose={onClose}>
      <DialogIcon>
        <WalletIcon />
      </DialogIcon>
      <DialogContentText
        textAlign="center"
        sx={{ fontSize: "11px", fontWeight: "700", mb: "30px" }}
        color="text.main"
      >
        Your connected wallet is not in the Contract Admin List
        <br />
        Please switch wallet to perform this action
      </DialogContentText>
    </Dialog>
  );
};

export default WarningContractAdminList;
