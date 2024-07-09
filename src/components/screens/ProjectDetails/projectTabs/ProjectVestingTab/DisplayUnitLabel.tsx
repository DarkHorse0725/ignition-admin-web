import { Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  disable: boolean;
  styles?: any;
}

export const DisplayUnitLabel = ({ children, disable, styles }: IProps) => {
  const theme = useTheme();
  return (
    <Typography
      sx={{
        paddingRight: "0.5rem",
        color: disable
          ? theme.palette.text.disabled
          : theme.palette.common.white,
        ...styles,
      }}
    >
      {children}
    </Typography>
  );
};
