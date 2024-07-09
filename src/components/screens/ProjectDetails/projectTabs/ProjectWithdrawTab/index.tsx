import { Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { WithdrawProjectFee } from "./WithdrawProjectFee";
import { WithdrawParticipantFee } from "./WithdrawParticipantFee";
import { useSelectorProjectDetail } from "@/store/hook";

const ProjectWithdrawTab = () => {
  const theme = useTheme();
  const { current: projectDetails } = useSelectorProjectDetail();
  const { crowdfundingEndTime } = projectDetails.pools[1];
  return (
    <Box sx={{ mt: 3, mx: "16px" }}>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: theme.palette.blue[100],
          color: theme.palette.blue[400],
          padding: 1,
          borderRadius: 1,
          fontWeight: 700,
          fontSize: "12px",
          lineHeight: "15px",
        }}
      >
        <Typography fontWeight={700} color={theme.palette.blue[400]}>
          Alert: Fee withdrawal is enabled after Lockup time (14 days after TGE
          Date)
        </Typography>
        <Typography color={theme.palette.blue[400]} fontStyle={"italic"}>
          {`Last updated at Pool Close (${
            crowdfundingEndTime
              ? format(new Date(crowdfundingEndTime), "MM/dd/yyyy p")
              : "--"
          })`}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: "22px", pt: 3 }}>
        <WithdrawProjectFee />
        <WithdrawParticipantFee />
      </Box>
    </Box>
  );
};

export default ProjectWithdrawTab;
