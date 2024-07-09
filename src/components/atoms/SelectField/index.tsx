import React from "react";
import { useField, FieldProps, FieldAttributes, Field } from "formik";
import { MenuItem, TextField, Box, useTheme } from "@mui/material";
import { InputFieldProps } from "@/types";
export interface SelectFieldOption {
  label: string;
  value: string;
}
interface SelectFieldProps {
  handleChange: (v: any) => void;
  value: any;
  label: string;
  selectOptions: SelectFieldOption[];
  helpText?: string;
}

export const SelectField = ({
  selectOptions,
  ...props
}: SelectFieldProps & FieldProps & InputFieldProps & FieldAttributes<any>) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const theme = useTheme();
  return (
    <Box>
      <Field
        {...field}
        {...props}
        as={TextField}
        select
        variant="outlined"
        helperText={errorText}
        error={!!errorText}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: "100%",
          "& .Mui-error": {
            marginLeft: 0,
            fontSize: 11,
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.grey[400],
          },
          "& .MuiInputLabel-root": {
            backgroundColor: theme.palette.grey[400],
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.grey[300],
          },
        }}
      >
        {selectOptions.map((option: SelectFieldOption) => {
          const { label, value } = option;
          return (
            <MenuItem
              key={value}
              value={value}
              sx={{
                display: "block",
                textAlign: "left",
                padding: "6px 16px",
              }}
            >
              {label}
            </MenuItem>
          );
        })}
      </Field>
    </Box>
  );
};
