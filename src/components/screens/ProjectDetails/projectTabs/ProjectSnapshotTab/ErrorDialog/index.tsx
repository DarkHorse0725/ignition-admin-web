import { Dialog, DialogIcon } from "@/components/atoms/Dialog";
import { InformationIcon } from "@/components/icons";
import { DialogContentText, Typography, useTheme } from "@mui/material";

type Props = {
  subtitle: string;
  open: boolean;
  onClose: () => void;
};
export const ErrorDialog = ({ subtitle, open, onClose }: Props) => {
  const theme = useTheme();
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={open}
      onClose={onClose}
      width="370px"
    >
      <DialogIcon>
        <InformationIcon
          fill={theme.palette.primary.main}
          height={53}
          width={53}
        />
      </DialogIcon>
      <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            fontSize: "16px",
            color: theme.palette.common.white,
            fontWeight: "700",
            pb: "6px",
          }}
          component="span"
        >
          Error
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            color: theme.palette.grey[800],
            fontWeight: "700",
            pb: "8px",
          }}
          component="span"
        >
          {subtitle}
        </Typography>
        <Typography
          sx={{ fontSize: "13px", color: theme.palette.grey[800] }}
          component="span"
        >
          To add an account to the Snapshot list, please ask the users to
          connect wallets beforehand.
        </Typography>
      </DialogContentText>
    </Dialog>
  );
};
