import { Typography, TypographyProps } from "@mui/material";
import React from "react";

export const DialogTitle = ({ children, ...props }: TypographyProps) => {
  return (
    <Typography
      variant="h5"
      color="primary.main"
      textAlign="center"
      mb="5px"
      {...props}
    >
      {children}
    </Typography>
  );
};
