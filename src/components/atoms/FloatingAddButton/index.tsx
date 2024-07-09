import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, useTheme } from "@mui/material";
import { useRouter } from "next/router";

export interface FloatingAddButtonProps {
  href: string;
}

export const FloatingAddButton = ({ href }: FloatingAddButtonProps) => {
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
        backgroundColor: theme.palette.primary.main,
        borderRadius: "50%",
        position: "fixed",
        bottom: "10px",
        right: "10px",
        color: theme.palette.text.primary,
        cursor: "pointer",
      }}
      onClick={() => router.push(href)}
    >
      <AddIcon />
    </Box>
  );
};
