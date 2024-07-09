import { Box, Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { StepContentProps } from "../StepProps";
import { APIClient } from "@/core/api";
import QRCodeGuide from "./QRCodeGuide";
import KeySetupGuide from "./KeySetupGuide";
import { useRouter } from "next/router";
import { useAlertContext } from "@/providers/AlertContext";

const ScanQRCode = ({ onNext, onBack, updateBackupCode }: StepContentProps) => {
  const [url, setUrl] = useState<string>("");
  const [qrCodeMode, setQrCodeMode] = useState(true);
  const [secretKey, setSecretKey] = useState("");
  const { errorAlertHandler } = useAlertContext();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const apiClient = APIClient.getInstance();
        const resp = await apiClient.auth.generateQRCode();
        const { otpAuthUrl, secret } = resp.data.data;
        const data = await QRCode.toDataURL(otpAuthUrl);
        updateBackupCode && updateBackupCode(secret);
        setSecretKey(secret);
        setUrl(data);
      } catch (error: any) {
        errorAlertHandler(error);
      }
    };
    generateQRCode();
  }, []);

  return (
    <Stack alignItems="center" spacing="15px">
      {qrCodeMode ? (
        <QRCodeGuide url={url} setQRCodeMode={setQrCodeMode} />
      ) : (
        <KeySetupGuide secretKey={secretKey} setQRCodeMode={setQrCodeMode} />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Button
          onClick={onBack}
          color="secondary"
          sx={{
            width: "196px",
          }}
        >
          Back
        </Button>
        <Button onClick={onNext} sx={{ width: "196px" }}>
          Next
        </Button>
      </Box>
    </Stack>
  );
};

export default ScanQRCode;
