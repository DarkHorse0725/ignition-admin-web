import * as React from "react";
import { FieldAttributes, FieldProps, Field, useField } from "formik";
import TextField from "@mui/material/TextField";

import { Autocomplete, Chip, Paper, useTheme } from "@mui/material";

type InputFieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface DropDownFieldProps {
  handleChange: (v: any) => void;
  label: string;
  helpText?: string;
  isDisabled?: boolean;
  getListFunction: string;
  valueField: string;
}

function CustomPaper({ children }: any) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        "& .MuiAutocomplete-listbox": {
          "& .MuiAutocomplete-option": {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.grey[900],
            },
          },
        },
      }}
    >
      {children}
    </Paper>
  );
}
const MultiSelectMenu: React.FC<any> = (props) => {
  const { valueField, options, getOptions, disabled } = props;
  const theme = useTheme();
  return (
    <Autocomplete
      multiple
      PaperComponent={CustomPaper}
      options={options}
      getOptionLabel={(option) => option.name}
      value={props.form.values[`${valueField}`] || []}
      disabled={disabled}
      onChange={(e, values) => {
        props.form.setFieldValue(valueField, values);
      }}
      onInputChange={(e, val) => {
        setTimeout(() => {
          getOptions(val);
        }, 1000);
      }}
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => {
        if (typeof option === "object") {
          if (typeof value === "object") {
            if (option.alpha3 && value.alpha3) {
              return option.alpha3 === value.alpha3;
            }
          }
          if (option.alpha3) {
            return option.alpha3 === value;
          }
        }
        return option === value;
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index: number) => (
          <Chip
            variant="outlined"
            label={typeof option === "string" ? option : option.alpha3}
            {...getTagProps({ index })}
            key={index}
            sx={{
              border: "1px solid rgb(189, 189, 189)",
              borderRadius: "16px",
              color: theme.palette.common.white,
            }}
            disabled={disabled}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={disabled}
          label="Restrict Countries"
          sx={{
            color: theme.palette.common.black,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.grey[400],
            },
            "& .MuiInputLabel-root": {
              backgroundColor: theme.palette.grey[400],
            },
          }}
        />
      )}
    />
  );
};

export const MultipleSelectCountries = ({
  getOptionsList,
  isDisabled,
  label,
  valueField,
  options,
  ...props
}: DropDownFieldProps &
  FieldProps &
  InputFieldProps &
  FieldAttributes<any>) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const theme = useTheme();
  return (
    <div>
      <Field
        {...field}
        {...props}
        getOptions={getOptionsList} //show list filter options after user enter text input
        options={options} //show list full options
        valueField={valueField} //formik name input
        component={MultiSelectMenu}
        InputLabelProps={{ shrink: true }}
        label={label}
        select
        variant="outlined"
        disabled={isDisabled}
        inputProps={{ style: { color: theme.palette.common.white } }}
        helperText={errorText}
        error={!!errorText}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.grey[400],
          },
          "& .MuiInputLabel-root": {
            backgroundColor: theme.palette.grey[400],
          },
          "& .MuiOutlinedInput-notchedOutline": {
            backgroundColor: theme.palette.grey[300],
          },
        }}
      />
    </div>
  );
};
