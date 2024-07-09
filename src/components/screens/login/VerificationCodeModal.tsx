import Modal from "@/components/atoms/Modal";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface VerificationCodeModalProps {
  open: boolean;
  email: string;
  password: string;
  onClose: () => void;
}
const VerificationCodeModal = ({
  open,
  onClose,
  email,
  password,
}: VerificationCodeModalProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    if (value) setError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      const apiClient = APIClient.getInstance();
      const data = await apiClient.auth.loginWithVerificationCode(
        email,
        password,
        value
      );
      router.push("/admin/projects");
    } catch (error: any) {
      if (error.message === "Wrong authentication code") {
        setError(true);
        return;
      }

      errorAlertHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack spacing={3}>
        <Typography variant="h4" textAlign="center">
          2-Step Verification
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb="20px">
            <Typography mb="10px">
              Get a verification code from the Google Authenticator app
            </Typography>

            <TextField
              name="code"
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="Enter the 6-digit verification code"
              error={error}
              fullWidth
            />

            {error && (
              <Typography variant={"body2"} color="error.main" mt="3px">
                Verification code is not correct
              </Typography>
            )}
          </Box>
          <Box m="auto">
            <LoadingButton
              type="submit"
              color="primary"
              loading={isSubmitting}
              fullWidth
              disabled={!value}
            >
              Next
            </LoadingButton>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default VerificationCodeModal;
