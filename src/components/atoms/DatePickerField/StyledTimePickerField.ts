import { TextField } from "@mui/material";
import { styled } from "@mui/system";

export const TimePickerField = styled(TextField)(({ theme }) => ({
  root: {
    "& svg.MuiSvgIcon-fontSizeMedium": {
      color: theme.palette.grey[200],
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.grey[400],
    },
    "& .MuiInputLabel-root": {
      backgroundColor: theme.palette.grey[400],
    },
    "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.palette.grey[200]} !important`,
    },
    "&  .MuiInputLabel-root": {
      fontSize: "0.875rem",
    },
    "& $notchedOutline": {
      borderWidth: "1px",
      borderColor: `${theme.palette.grey[200]} !important`,
    },
    "& .Mui-disabled": {
      WebkitTextFillColor: theme.palette.common.white,
    },
  },
  input: {
    color: `${theme.palette.common.white} !important`,
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: theme.palette.grey[200],
  },
}));
