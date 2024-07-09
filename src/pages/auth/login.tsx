import { Box, Typography, useTheme } from "@mui/material";
import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import ChangePasswordModal from "@/components/screens/login/ChangePasswordModal";
import VerificationCodeModal from "@/components/screens/login/VerificationCodeModal";
import LoginForm from "@/components/screens/login/LoginForm";
import { AlertTypes, LoginFormValue, ResetPasswordFormValues } from "@/types";
import SuccessfulPwdResetModal from "@/components/screens/login/SuccessfulPwdResetModal";

const Login = () => {
  const router = useRouter();
  const theme = useTheme();
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const [openResetPwd, setOpenResetPwd] = useState(false);
  const [openVerificationCode, setOpenVerificationCode] = useState(false);
  const [openSuccessfulPwdReset, setOpenSuccessfulPwdReset] = useState(false);
  const [loginData, setLoginData] = useState<LoginFormValue>({
    email: "",
    password: "",
  });

  const handleSubmit = async (
    values: LoginFormValue,
    actions: FormikHelpers<LoginFormValue>
  ) => {
    const { setSubmitting } = actions;
    setLoginData(values);
    setSubmitting(true);

    const { email, password } = values;
    const apiClient = APIClient.getInstance();
    try {
      const { data } = await apiClient.auth.login(email, password);
      setSubmitting(false);

      if (data.userStatus?.toUpperCase() === "INACTIVE") {
        setOpenResetPwd(true);
        return;
      }
      if (data.user2FaStatus?.toUpperCase() === "INACTIVE") {
        router.push("/auth/google_auth");
        return;
      }
      router.push("/admin/projects");
    } catch (error: any) {
      if (error.message === "Missing 2Fa Verification Code") {
        setOpenVerificationCode(true);
        return;
      }
      if (
        error.message ===
        "Your password have expired. Please contract admin for new password"
      ) {
        updateAlert("", "Incorrect Password", AlertTypes.ERROR);
        return;
      }
      errorAlertHandler(error);
    }
  };

  const handleResetPassword = async (
    { cfPassword, password: newPassword }: ResetPasswordFormValues,
    actions: FormikHelpers<ResetPasswordFormValues>
  ) => {
    const { setSubmitting } = actions;
    setSubmitting(true);

    const apiClient = APIClient.getInstance();
    try {
      await apiClient.auth.changePassword(
        loginData!.password,
        newPassword,
        cfPassword
      );
      setSubmitting(false);
      setOpenResetPwd(false);
      setOpenSuccessfulPwdReset(true);
    } catch (error) {
      errorAlertHandler(error);
    }
  };

  useEffect(() => {
    if (!openSuccessfulPwdReset) return;
    setTimeout(() => {
      setOpenSuccessfulPwdReset(false);
      router.reload();
    }, 10000);
  }, [openSuccessfulPwdReset]);

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        height: "100vh",
        pt: 5,
      }}
    >
      <Box
        width={560}
        sx={{
          margin: "auto",
          "form > *:not(:last-child)": { marginBottom: "32px" },
        }}
      >
        <Typography variant="h1" textAlign="center" mb="10px">
          Login
        </Typography>
        <Typography variant="h6" textAlign="center" mb="32px">
          Launchpad Admin
        </Typography>
        <LoginForm onSubmit={handleSubmit} />
      </Box>
      <ChangePasswordModal
        open={openResetPwd}
        onClose={() => setOpenResetPwd(false)}
        onSubmit={handleResetPassword}
        oldPassword={loginData.password}
      />
      <VerificationCodeModal
        open={openVerificationCode}
        onClose={() => setOpenVerificationCode(false)}
        email={loginData.email}
        password={loginData.password}
      />
      <SuccessfulPwdResetModal
        open={openSuccessfulPwdReset}
        onClose={() => setOpenSuccessfulPwdReset(false)}
      />
    </Box>
  );
};

export default Login;
