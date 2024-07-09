import {
  Box,
  StepLabel,
  Stepper,
  Step,
  Typography,
  Stack,
  Container,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import DownloadApp from "@/components/screens/googleAuth/DownloadApp";
import ScanQRCode from "@/components/screens/googleAuth/ScanQRCode";
import Complete from "@/components/screens/googleAuth/Complete";
import Verify from "@/components/screens/googleAuth/Verify";

const STEPS_LIST = [
  {
    label: "Download App",
    content: DownloadApp,
  },
  {
    label: "Scan QR Code",
    content: ScanQRCode,
  },
  {
    label: "Verify",
    content: Verify,
  },
  {
    label: "Complete",
    content: Complete,
  },
];

const steps = [
  "Select master blaster campaign settings",
  "Create an ad group",
  "Create an ad",
];

const GoogleAuth = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [backupCode, setBackupCode] = useState("");
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((activeStep) => activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container>
      <Stack
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "876px",
          borderRadius: "8px",
          outline: "none",
        }}
        spacing="40px"
      >
        <Typography variant="h4" color="text.primary" textAlign="center">
          Enable Google Authentication
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS_LIST.map(({ label }) => {
            return (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label.Mui-completed": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box sx={{ height: "450px" }}>
          {STEPS_LIST.map(({ label, content: ContentComponent }, index) => {
            const active = index === activeStep;
            return (
              <Box key={label} sx={{ display: active ? "block" : "none" }}>
                <ContentComponent
                  onBack={handleBack}
                  onNext={handleNext}
                  backupCode={backupCode}
                  updateBackupCode={setBackupCode}
                />
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Container>
  );
};

export default GoogleAuth;
