import { Button, Stack, TextField, Typography, useTheme } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { StepContentProps } from "../StepProps";

const Complete = ({ backupCode }: StepContentProps) => {
  const route = useRouter();
  const theme = useTheme();
  return (
    <Stack spacing="15px" alignItems="center">
      <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
      <Typography>
        You have successfully enabled Google Authenticator.
      </Typography>
      <Typography>Please save this key as a backup</Typography>
      <TextField value={backupCode}></TextField>
      <Typography>
        This key will allow you to recover your Google Authenticator incase you
        loose access to your current 2FA device.
      </Typography>
      <Button
        onClick={() => route.push("/admin/projects")}
        color="secondary"
        sx={{
          width: "196px",
        }}
      >
        Back to Projects Page
      </Button>
    </Stack>
  );
};

export default Complete;
