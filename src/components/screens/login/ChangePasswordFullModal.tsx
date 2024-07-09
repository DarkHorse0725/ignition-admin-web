import InputField from "@/components/atoms/InputField";
import { EyeIcon } from "@/components/icons";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import Modal from "@/components/atoms/Modal";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import CloseIcon from "@mui/icons-material/Close";
import yup from "@/core/yup";
import { AlertTypes } from "@/types";

const ChangePwdValidationSchema = yup.object().shape({
  currentPassword: yup.string().required("This field is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be 8-30 characters")
    .max(30, "Password must be 8-30 characters")
    .matches(/.*[A-Z]/, "Password must contain 1 uppercase")
    .matches(/.*\d/, "Password must contain 1 number")
    .matches(/.*\W/, "Password must contain 1 special character")
    .required("This field is required"),
  cfPassword: yup
    .string()
    .required("This field is required")
    .oneOf([yup.ref("newPassword")], "Passwords does NOT match"),
});

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  cfPassword: string;
}

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

const enum ERROR_MESSAGE {
  INCORRECT_PWD = "Incorrect password",
  NEW_PWD_NOT_MATCH = "New password cannot be old password",
}

const ChangePasswordFullModal = ({ open, onClose }: ChangePasswordProps) => {
  const theme = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const [updatedFailed, setUpdatedFailed] = useState<ERROR_MESSAGE>();

  const handleChangePassword = async (
    { currentPassword, cfPassword, newPassword }: ChangePasswordFormValues,
    actions: FormikHelpers<ChangePasswordFormValues>
  ) => {
    const { setSubmitting, resetForm } = actions;
    setSubmitting(true);

    const apiClient = APIClient.getInstance();
    try {
      await apiClient.auth.changePassword(
        currentPassword,
        newPassword,
        cfPassword
      );
      setSubmitting(false);
      onClose();
      updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
    } catch (error: any) {
      if (error.message === ERROR_MESSAGE.INCORRECT_PWD) {
        resetForm();
        setUpdatedFailed(ERROR_MESSAGE.INCORRECT_PWD);
        return;
      }
      if (error.message === ERROR_MESSAGE.NEW_PWD_NOT_MATCH) {
        resetForm();
        setUpdatedFailed(ERROR_MESSAGE.NEW_PWD_NOT_MATCH);
        return;
      }
      errorAlertHandler(error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width={500}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h4" textAlign="center" mb="20px">
          Change password
        </Typography>
        <Formik
          validateOnChange={true}
          initialValues={{
            currentPassword: "",
            newPassword: "",
            cfPassword: "",
          }}
          validationSchema={ChangePwdValidationSchema}
          onSubmit={handleChangePassword}
        >
          {({
            isSubmitting,
            isValid,
            dirty,
            errors,
            setFieldValue,
            touched,
          }) => {
            return (
              <Form>
                <Stack spacing={3}>
                  <div>
                    <InputField
                      name="currentPassword"
                      label="Current Password *"
                      type={showCurrentPassword ? "text" : "password"}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        let value = event.target.value;
                        value = value.slice(0, 30);
                        setFieldValue("currentPassword", value);
                        setUpdatedFailed(undefined);
                      }}
                      customError={
                        updatedFailed === ERROR_MESSAGE.INCORRECT_PWD
                          ? ERROR_MESSAGE.INCORRECT_PWD
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <EyeIcon
                            show={showCurrentPassword}
                            changeShow={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          />
                        ),
                      }}
                    />
                  </div>

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
                      error={!!(errors.newPassword && touched.newPassword)}
                      InputLabelProps={{ shrink: true }}
                      pattern="[A-Za-z]"
                      name="newPassword"
                      label="New Password *"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        let value = event.target.value;
                        value = value.slice(0, 30);
                        setFieldValue("newPassword", value);
                        setUpdatedFailed(undefined);
                      }}
                      type={showNewPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <EyeIcon
                            show={showNewPassword}
                            changeShow={() =>
                              setShowNewPassword(!showNewPassword)
                            }
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
                      Use 8 or more characters with at least 1 uppercase, number
                      & symbols
                    </Typography>
                    {errors.newPassword && touched.newPassword && (
                      <Typography variant={"body2"} color="error.main" mt="3px">
                        {errors.newPassword}
                      </Typography>
                    )}
                    {updatedFailed === ERROR_MESSAGE.NEW_PWD_NOT_MATCH && (
                      <Typography variant={"body2"} color="error.main" mt="3px">
                        Password can NOT be the same with old password
                      </Typography>
                    )}
                  </div>

                  <div>
                    <InputField
                      name="cfPassword"
                      label="Confirm New Password *"
                      type={showCfPassword ? "text" : "password"}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        let value = event.target.value;
                        value = value.slice(0, 30);
                        setFieldValue("cfPassword", value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <EyeIcon
                            show={showCfPassword}
                            changeShow={() =>
                              setShowCfPassword(!showCfPassword)
                            }
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
                        Next
                      </LoadingButton>
                    </div>
                  </Box>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ChangePasswordFullModal;
