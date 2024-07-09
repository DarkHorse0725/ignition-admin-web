import React from "react";
import {
  FieldProps,
  FieldAttributes,
  useField,
  FieldArray,
  Field,
} from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Button,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/system";
import { InputFieldProps } from "@/types";

export const MultiInputField = ({
  disabled,
  width = "auto",
  ...props
}: FieldProps & { value: string[] } & InputFieldProps &
  FieldAttributes<any>) => {
  const theme = useTheme();
  const [, meta] = useField<{}>(props);
  const { touched, value, name } = props;
  const errorText = meta.error && meta.touched ? meta.error : "";
  const addMoreForm = (arrayHelpers: any) => {
    arrayHelpers.push("");
  };
  const showExistErrorMessage = (list: [], value: string, index: number) => {
    const findIndexOfFirstValue = list.findIndex(
      (e: string) => e.toUpperCase() === value.toUpperCase()
    );
    if (findIndexOfFirstValue < 0 || findIndexOfFirstValue === index) return "";

    for (let i = 0; i <= list.length; i++) {
      const valueIndex = list[i] as any;
      if (
        value !== "" &&
        valueIndex?.toUpperCase() == value.toString()?.toUpperCase() &&
        i != findIndexOfFirstValue
      ) {
        return "Address already exists";
      }
    }
    // return "";
  };
  return (
    <Box>
      <FieldArray
        name={name}
        render={(arrayHelpers): any => {
          return (
            <div>
              {value &&
                value.length > 0 &&
                value.map((val: any, index: number) => {
                  return (
                    <Box sx={{ marginBottom: "20px" }} key={index}>
                      <Field
                        {...props}
                        disabled={disabled}
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
                        }}
                        value={value[index]}
                        name={`${name}.${index}`}
                        as={TextField}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              style={{ outline: "none" }}
                            >
                              {value.length !== 1 && (
                                <IconButton
                                  aria-label="hide row"
                                  onClick={() => arrayHelpers.remove(index)}
                                  edge="end"
                                  disabled={disabled}
                                >
                                  <ClearIcon />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                        onWheel={(e: any) => e.target.blur()}
                        helperText={
                          (touched?.collaboratorWallet?.length &&
                            touched?.collaboratorWallet[index] &&
                            errorText[index]) ||
                          showExistErrorMessage(value, value[index], index)
                        }
                        error={
                          !!(
                            (touched?.collaboratorWallet?.length &&
                              touched?.collaboratorWallet[index] &&
                              !!errorText[index]) ||
                            showExistErrorMessage(value, value[index], index)
                          )
                        }
                      />
                    </Box>
                  );
                })}
              {!disabled && value?.length < 10 && (
                <Box sx={{ display: "flex", marginTop: "10px" }}>
                  <Button
                    variant="outlined"
                    onClick={() => addMoreForm(arrayHelpers)}
                    sx={{
                      textTransform: "capitalize",
                      width: "125px",
                      height: "40px",
                    }}
                    color="secondary"
                  >
                    <Typography
                      sx={{ textTransform: "capitalize", fontSize: "14px" }}
                    >
                      Add More
                    </Typography>
                  </Button>
                </Box>
              )}
            </div>
          );
        }}
      />
    </Box>
  );
};
