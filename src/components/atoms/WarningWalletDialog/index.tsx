import { WalletIcon } from "@/components/icons";
import { Dialog, DialogIcon } from "../Dialog";
import { DialogContentText } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const WarningWalletDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={open}
      onClose={onClose}
      width="432px"
    >
      <DialogIcon>
        <WalletIcon />
      </DialogIcon>
      <DialogContentText sx={{ pb: 2 }}>
        Your connected wallet is not in the Contract Admin List
        <br /> Please switch wallet to perform this action
      </DialogContentText>
    </Dialog>
  );
};
