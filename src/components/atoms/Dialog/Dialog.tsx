import {
  Box,
  Dialog as DialogBase,
  DialogProps as DialogBaseProps,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export const DialogPaper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: "8px",
  padding: "20px",
  overflow: "inherit!important",
}));

export const Dialog = ({
  onClose,
  width,
  ...props
}: DialogBaseProps & { onClose: () => void; width: string }) => {
  const theme = useTheme();
  const handleClose = (
    event: Object,
    reason: "escapeKeyDown" | "backdropClick"
  ) => {
    if (reason === "backdropClick") return;
    onClose();
  };
  return (
    <DialogBase
      {...props}
      onClose={handleClose}
      PaperComponent={DialogPaper}
      PaperProps={{
        sx: { width },
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: "-20px", right: "-20px" }}
        onClick={onClose}
      >
        <Box
          sx={{
            display: "flex",
            width: "31px",
            height: "31px",
            borderRadius: "50%",
            border: `solid 1px ${theme.palette.grey[200]}`,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.grey[600],
          }}
        >
          <CloseIcon
            sx={{
              color: theme.palette.warning.main,
              fontSize: "18px",
            }}
          />
        </Box>
      </IconButton>
      {props.children}
    </DialogBase>
  );
};
