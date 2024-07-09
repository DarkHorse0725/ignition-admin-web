import { Box, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}
export const WrappedInputTitle = ({ children }: IProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: "15px",
        backgroundColor: "rgba(144, 155, 249, 0.08)",
        borderRadius: "10px",
        marginLeft: "10px",
        color: theme.palette.primary.main,
        fontWeight: 700,
        margin: " 0 18px",
        fontSize: "14px",
      }}
    >
      {children}
    </Box>
  );
};
export const WrappedInput = ({ children }: IProps) => {
  return <Box sx={{ margin: "20px" }}>{children}</Box>;
};
