import { AppleIcon } from "@/components/icons/AppleIcon";
import { ChromeIcon } from "@/components/icons/ChromeIcon";
import { GooglePlayIcon } from "@/components/icons/GooglePlayIcon";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { StepContentProps } from "../StepProps";
import Link from "next/link";

interface AppCardProps {
  icon: React.FC;
  label: string;
  link: string;
}
const AppCard = ({ icon: Icon, label, link }: AppCardProps) => {
  return (
    <Link target="blank" href={link}>
      <Stack spacing="10px" alignItems="center">
        <Icon />
        <Typography>Download from</Typography>
        <Typography>{label}</Typography>
      </Stack>
    </Link>
  );
};

const APPS_LIST = [
  {
    icon: AppleIcon,
    label: "App Store",
    link: "https://apps.apple.com/us/app/google-authenticator/id388497605",
  },
  {
    icon: GooglePlayIcon,
    label: "Google Play",
    link: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US",
  },
  {
    icon: ChromeIcon,
    label: "Google Chrome",
    link: "https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai",
  },
];
const DownloadApp = ({ onNext }: StepContentProps) => {
  const theme = useTheme();
  return (
    <Stack spacing="30px" alignItems="center">
      <Typography textAlign="center">
        Download and install Google Authenticator app
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
        }}
      >
        {APPS_LIST.map((items, index) => (
          <AppCard key={index} {...items} />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Button onClick={onNext} sx={{ width: "196px" }}>
          Next
        </Button>
      </Box>
    </Stack>
  );
};

export default DownloadApp;
