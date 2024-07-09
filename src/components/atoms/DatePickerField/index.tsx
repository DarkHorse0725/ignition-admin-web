import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FieldAttributes, FieldProps, useField } from "formik";
import { IconButton, InputAdornment, useTheme } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { InputFieldProps } from "@/types";
import { TimePickerField } from "./StyledTimePickerField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const DatePickerField = ({
  InputProps,
  setFieldValue,
  label,
  value,
  minDateTime,
  setFieldTouched,
  customError,
  disabled,
  ...props
}: FieldProps & InputFieldProps & FieldAttributes<any>) => {
  const [field, meta] = useField<{}>(props);
  const [open, setOpen] = React.useState(false);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const currentError = customError || errorText;
  const anchorRef = React.useRef<any>(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const handleInputClick = (e: any) => {
    const target = e.target as HTMLElement;
    if (disabled) {
      return;
    }
    if (target instanceof HTMLInputElement) {
      setOpen(true);
      setAnchorEl(anchorRef?.current);
    }
  };
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      error={!!currentError}
      helperText={currentError}
      {...field}
      {...props}
    >
      <DateTimePicker
        open={open}
        onClose={() => setOpen(false)}
        componentsProps={{
          actionBar: {
            actions: ["accept"],
          },
        }}
        disabled={disabled}
        ref={anchorRef}
        renderInput={(props) => (
          <TimePickerField
            onClick={(e: any) => {
              handleInputClick(e);
            }}
            {...props}
            disabled={disabled}
            name={field.name}
            error={Boolean(currentError)}
            helperText={currentError}
            onBlur={() => setFieldTouched(field.name, true, false)}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              e.preventDefault();
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.grey[400],
              },
              "& .Mui-error": {
                marginLeft: 0,
                fontSize: 11,
              },
              "& .MuiInputLabel-root": {
                backgroundColor: theme.palette.grey[400],
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      if (disabled) {
                        return;
                      }
                      setFieldValue(field.name, null);
                      setOpen(false);
                    }}
                  >
                    <ClearIcon color={disabled ? "disabled" : "inherit"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: { color: theme.palette.common.white },
              shrink: true,
            }}
          />
        )}
        label={label}
        value={value}
        minDateTime={minDateTime}
        PopperProps={{
          placement: "top-start",
          anchorEl: anchorEl,
        }}
        onChange={(newValue: string | Date | null) => {
          if (props.handleOnChange) {
            props.handleOnChange(newValue);
          } else {
            setFieldValue(field.name, newValue, true);
          }
        }}
      />
    </LocalizationProvider>
  );
};
