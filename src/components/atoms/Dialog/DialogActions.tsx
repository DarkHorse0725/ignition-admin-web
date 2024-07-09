import { Box, BoxProps } from "@mui/material";
import React, { ReactNode } from "react";

interface DialogActionsProps {
  children: ReactNode;
  justifyContent?: "center" | "right" | "space-between";
}

export const DialogActions = ({
  children,
  justifyContent = "center",
  ...props
}: DialogActionsProps & BoxProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent,
        alignItems: "center",
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
