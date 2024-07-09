import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { StepContentProps } from "../StepProps";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { LoadingButton } from "@mui/lab";

const Verify = ({ onNext, onBack }: StepContentProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    setError(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const apiClient = APIClient.getInstance();
      await apiClient.auth.verifyAuthenticationCode(value.trim());
      onNext();
      setValue("");
    } catch (error: any) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setValue("");
    setError(false);
    onBack();
  };

  return (
    <Stack spacing="30px" alignItems="center">
      <Box>
        <Typography>Google Verification Code</Typography>
        <TextField
          name="code"
          type="text"
          value={value}
          onChange={handleChange}
          sx={{ width: "300px" }}
          placeholder="Enter the 6 digit verification code"
          error={error}
        />
        {error && (
          <Typography color="error.main">
            Verification code is not correct
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Button
          onClick={handleBack}
          color="secondary"
          sx={{
            width: "196px",
          }}
        >
          Back
        </Button>
        <LoadingButton
          loading={isSubmitting}
          disabled={!value}
          onClick={handleSubmit}
          sx={{ width: "196px" }}
        >
          Next
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default Verify;
