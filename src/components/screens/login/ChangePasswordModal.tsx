import InputField from "@/components/atoms/InputField";
import { EyeIcon } from "@/components/icons";
import { Box, Stack, TextField, Typography, useTheme } from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { ResetPasswordFormValues } from "@/types";
import Modal from "@/components/atoms/Modal";

export const ResetPwdValidationSchema = yup.object().shape({
  cfPassword: yup
    .string()
    .required("This field is required")
    .oneOf([yup.ref("password")], "Passwords does NOT match"),
});

interface ResetPasswordProps {
  open: boolean;
  oldPassword: string;
  onClose: () => void;
  onSubmit: (
    values: ResetPasswordFormValues,
    actions: FormikHelpers<ResetPasswordFormValues>
  ) => Promise<void>;
}

const ChangePasswordModal = ({
  open,
  oldPassword,
  onClose,
  onSubmit,
}: ResetPasswordProps) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);

  const validateNewPassword = (value: string) => {
    if (!value) return "This field is required";
    if (value.length < 8 || value.length > 30)
      return "Password must be 8-30 characters";
    if (!/.*[A-Z]/.test(value)) return "Password must contain 1 uppercase";
    if (!/.*\d/.test(value)) return "Password must contain 1 number";
    if (!/.*\W/.test(value)) return "Password must contain 1 special character";
    if (value === oldPassword)
      return "Password can NOT be the same with old password";
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ backgroundColor: "black" }}
      width={500}
    >
      <Box>
        <Typography variant="h4" textAlign="center" mb="20px">
          Change your password
        </Typography>
        <Formik
          validateOnChange={true}
          initialValues={{
            password: "",
            cfPassword: "",
          }}
          validationSchema={ResetPwdValidationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, isValid, dirty, errors, setFieldValue }) => (
            <Form>
              <Stack spacing={3}>
                <div>
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
                    error={!!errors.password}
                    InputLabelProps={{ shrink: true }}
                    pattern="[A-Za-z]"
                    name="password"
                    label="New Password *"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      let value = event.target.value;
                      value = value.slice(0, 30);
                      setFieldValue("password", value);
                    }}
                    type={showPassword ? "text" : "password"}
                    validate={validateNewPassword}
                    InputProps={{
                      endAdornment: (
                        <EyeIcon
                          show={showPassword}
                          changeShow={() => setShowPassword(!showPassword)}
                        />
                      ),
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Use 8 or more characters with at least 1 uppercase, number &
                    symbols
                  </Typography>
                  {errors.password && (
                    <Typography variant={"body2"} color="error.main" mt="3px">
                      {errors.password}
                    </Typography>
                  )}
                </div>

                <div>
                  <InputField
                    name="cfPassword"
                    label="Confirm New Password *"
                    type={showCfPassword ? "text" : "password"}
                    shrink={true}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      let value = event.target.value;
                      value = value.slice(0, 30);
                      setFieldValue("cfPassword", value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <EyeIcon
                          show={showCfPassword}
                          changeShow={() => setShowCfPassword(!showCfPassword)}
                        />
                      ),
                    }}
                  />
                </div>

                <Box m="auto">
                  <div>
                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={isSubmitting}
                      fullWidth
                      disabled={!isValid || !dirty || isSubmitting}
                    >
                      Change Password
                    </LoadingButton>
                  </div>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
