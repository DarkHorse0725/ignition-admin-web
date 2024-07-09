import React from "react";
import { IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ColumnChooser } from "@devexpress/dx-react-grid";

export const ToggleButton = ({
  onToggle,
  buttonRef,
}: ColumnChooser.ToggleButtonProps) => {
  return (
    <IconButton onClick={onToggle} ref={buttonRef as any}>
      <VisibilityOutlinedIcon color="primary" />
    </IconButton>
  );
};
