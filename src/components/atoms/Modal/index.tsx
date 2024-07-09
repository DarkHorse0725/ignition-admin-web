import React from "react";
import { Box, Modal as ModalBase, ModalProps } from "@mui/material";

const Modal = ({
  children,
  onClose,
  width = 400,
  ...props
}: ModalProps & { onClose: () => void; width?: number }) => {
  const handleClose = (e: any, reason: string) => {
    if (reason === "backdropClick") return;
    onClose && onClose();
  };

  return (
    <ModalBase {...props} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${width}px`,
          bgcolor: "background.default",
          border: "none",
          outline: "none",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        {children}
      </Box>
    </ModalBase>
  );
};

export default Modal;
