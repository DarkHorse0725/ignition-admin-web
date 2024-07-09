import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, useTheme } from "@mui/material";
import { useRouter } from "next/router";

export const FloatingBackButton = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Box
      sx={{
        width: "56px",
        height: "56px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.error.main,
        borderRadius: "50%",
        position: "fixed",
        bottom: "10px",
        right: "10px",
        color: theme.palette.text.primary,
        cursor: "pointer",
      }}
      onClick={() => router.back()}
    >
      <CancelIcon />
    </Box>
  );
};
