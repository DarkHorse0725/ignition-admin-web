import { Stack, Typography } from "@mui/material";
import React from "react";

interface KeySetupGuideProps {
  secretKey: string;
  setQRCodeMode: Function;
}
const KeySetupGuide = ({ secretKey, setQRCodeMode }: KeySetupGuideProps) => {
  return (
    <Stack>
      <Typography color="text.secondary">
        1. In the Google Authenticator app tap the + then tap{" "}
        <Typography component="span" color="text.primary">
          Enter a setup key
        </Typography>
      </Typography>
      <Typography color="text.secondary">
        2. Enter your email address and this key (spaces don’t matter):
        <Typography color="text.primary" ml="15px">
          {secretKey}
        </Typography>
        <Typography color="error.main" ml="15px">
          (This key also serves as backup key for Google Authenticator. Please
          save and store it)
        </Typography>
      </Typography>
      <Typography color="text.secondary">
        3. Make sure{" "}
        <Typography component="span" color="text.primary">
          Time based
        </Typography>{" "}
        is selected
      </Typography>
      <Typography color="text.secondary">
        4. Tap{" "}
        <Typography component="span" color="text.primary">
          Add{" "}
        </Typography>{" "}
        to finish
      </Typography>
      <Typography
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          textAlign: "center",
        }}
        onClick={() => setQRCodeMode(true)}
      >
        View QR Code
      </Typography>
    </Stack>
  );
};

export default KeySetupGuide;
