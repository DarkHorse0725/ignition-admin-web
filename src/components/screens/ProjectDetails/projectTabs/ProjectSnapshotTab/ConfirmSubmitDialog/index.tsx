// Libraries
import { useTheme, DialogContentText, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Hooks & Components
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { SnapshotTabIcon } from "@/components/icons/SnapshotTabIcon";

interface ConfirmSubmitDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}
function ConfirmSubmitDialog({
  isOpen,
  handleClose,
  handleSubmit,
}: ConfirmSubmitDialogProps) {
  const theme = useTheme();

  return (
    <Dialog open={isOpen} onClose={handleClose} width="477px">
      <DialogIcon>
        <SnapshotTabIcon size={65} color={theme.palette.primary.main} />
      </DialogIcon>
      <DialogTitle>Confirm Submit Snapshot</DialogTitle>
      <Box sx={{ textAlign: "center" }}>
        <Typography color="text.secondary">
          The final list of Snapshot is about to send to Project contract.
        </Typography>
        <Typography color="text.secondary">
          You only can submit 1 time.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Do you want to proceed?
        </Typography>
      </Box>
      <DialogActions mt="10px" gap={2}>
        <LoadingButton
          sx={{ width: 117, height: 40 }}
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmSubmitDialog;
