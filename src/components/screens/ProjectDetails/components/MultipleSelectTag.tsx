import theme from "@/theme";
import { InputFieldProps, ProjectTag } from "@/types";
import {
  Autocomplete,
  Box,
  Checkbox,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Field, FieldAttributes, FieldProps, useField } from "formik";
import { DropDownFieldProps } from "./MultipleSelectCountries";

function CustomPaper({ children }: any) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        "& .MuiAutocomplete-listbox": {
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "auto auto auto",
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

const MultiSelectMenu = (props: any) => {
  const { options, valueField, disabled, form, helperText } = props;
  const value = (form.values[`${valueField}`] as any) || [];
  const handleOnChange = (data: any) => {
    form.setFieldTouched(valueField, true);
    if (
      value &&
      value.findIndex((item: ProjectTag) => item.name === data.name) >= 0
    ) {
      props.form.setFieldValue(
        valueField,
        value.filter((tag: ProjectTag) => tag.name !== data.name)
      );
    } else {
      props.form.setFieldValue(valueField, [...value, data]);
    }
  };
  return (
    <Autocomplete
      disablePortal
      multiple
      disabled={disabled}
      PaperComponent={CustomPaper}
      id="combo-box-demo"
      options={options || []}
      value={props.form.values[`${valueField}`] || []}
      sx={{ width: "100%" }}
      onChange={(e, values) => {
        props.form.setFieldValue(valueField, values);
      }}
      getOptionLabel={(option) => option.name}
      onInputChange={(e, val) => {}}
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={disabled}
          label="Tags"
          InputLabelProps={{ shrink: true }}
          error={!!helperText}
          sx={{
            color: theme.palette.common.black,
            width: "100%",
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.grey[400],
            },
            "& .MuiInputLabel-root": {
              backgroundColor: theme.palette.grey[400],
            },
          }}
        />
      )}
      renderTags={(value: ProjectTag[]) => {
        return value.map((tag, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: tag.bgColor,
              padding: "2px 15px",
              borderRadius: "8px",
              marginRight: "8px",
              marginBottom: "4px",
            }}
          >
            <Typography sx={{ color: tag.foreColor, fontWeight: 600 }}>
              {tag.name.toUpperCase()}
            </Typography>
          </Box>
        ));
      }}
      renderOption={(props, option) => {
        return (
          <Box
            key={option.name}
            sx={{
              display: "inline-block",
              marginRight: "8px",
              marginBottom: "12px",
            }}
          >
            <Checkbox
              disableRipple
              checked={
                value &&
                value.findIndex(
                  (item: ProjectTag) => item.name === option.name
                ) >= 0
              }
              sx={{ padding: 0, marginRight: "8px" }}
              onChange={() => handleOnChange(option)}
            />
            <Typography
              component={"span"}
              sx={{
                color: option.foreColor,
                backgroundColor: option.bgColor,
                padding: "4px 15px",
                borderRadius: "5px",
                fontWeight: 600,
              }}
            >
              {option.name.toUpperCase()}
            </Typography>
          </Box>
        );
      }}
    />
  );
};

export const MultipleSelectTags = ({
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
            width: "100%",
          },
          "& .MuiInputLabel-root": {
            backgroundColor: theme.palette.grey[400],
          },
          "& .MuiOutlinedInput-notchedOutline": {
            backgroundColor: theme.palette.grey[300],
          },
          "& span": {
            borderColor: theme.palette.grey[300],
          },
        }}
      />
      <Typography variant={"body2"} color="error.main" mt="3px">
        {errorText}
      </Typography>
    </div>
  );
};
