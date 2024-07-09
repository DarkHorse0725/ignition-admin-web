import Modal from "@/components/atoms/Modal";
import { SuccessfulIcon } from "@/components/icons";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

interface SuccessfulPwdResetModalProps {
  open: boolean;
  onClose: () => void;
}
const SuccessfulPwdResetModal = (props: SuccessfulPwdResetModalProps) => {
  const router = useRouter();
  return (
    <Modal {...props} width={500} sx={{ backgroundColor: "black" }}>
      <Stack alignItems="center" spacing={2}>
        <SuccessfulIcon />
        <Typography variant="h5" textAlign="center">
          You have successfully changed your password.
          <br />
          Please login again.
        </Typography>
        <Button onClick={() => router.reload()} fullWidth>
          Login
        </Button>
      </Stack>
    </Modal>
  );
};

export default SuccessfulPwdResetModal;
