import { TextField, Typography, useTheme } from "@mui/material";
import { Field, FieldAttributes, useField } from "formik";
import React from "react";

interface InputFieldProps {
  isMultiline?: boolean;
  customError?: string;
  shrink?: boolean;
}
const InputField = ({
  isMultiline,
  customError,
  shrink = true,
  handleChange,
  ...props
}: InputFieldProps & FieldAttributes<any>) => {
  const theme = useTheme();
  const [, meta] = useField(props);
  const { error, touched } = meta;
  const errorText = customError || (error && touched ? error : "");
  return (
    <>
      <Field
        as={TextField}
        sx={{
          width: "100%",
          backgroundColor: theme.palette.grey[400],
          "& fieldset": {
            borderColor: theme.palette.grey[300],
          },
          "& .MuiInputBase-root .Mui-error": {
            borderColor: theme.palette.error.main,
          },
          "& .MuiInputLabel-root": {
            backgroundColor: theme.palette.grey[400],
          },
        }}
        error={!!errorText}
        multiline={isMultiline}
        InputLabelProps={{ shrink }}
        {...props}
      />

      {errorText && (
        <Typography variant={"body2"} color="error.main" mt="3px">
          {errorText}
        </Typography>
      )}
    </>
  );
};

export default InputField;
