import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { EProjectAsyncStatus, ProjectStatus } from "@/types";
import { detectPools, formatDate } from "@/helpers";
import { useSelectorProjectDetail } from "@/store/hook";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: "8px",
  color: theme.palette.text.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: 4,
}));

const SubmitStatusIndicator = ({ isSubmittingTime }: any) => {
  const theme = useTheme();
  const { current: projectDetails } = useSelectorProjectDetail();
  const {
    status,
    deploy_status,
    submit_snapshot_status,
    submit_snapshot_at,
    pools,
  } = projectDetails;
  const {
    galaxyPool: { galaxyOpenTime },
  } = detectPools(pools);

  if (
    submit_snapshot_status === EProjectAsyncStatus.SUCCESS &&
    submit_snapshot_at
  ) {
    return (
      <StyledBox sx={{ backgroundColor: theme.palette.success.dark }}>
        <CheckCircleOutline sx={{ marginRight: "5px" }} />
        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>
          Submitted to blockchain at{" "}
          {formatDate(new Date(Number(submit_snapshot_at) * 1000)) || "--"}
        </Typography>
      </StyledBox>
    );
  }

  return status === ProjectStatus.LIVE &&
    isSubmittingTime &&
    deploy_status === EProjectAsyncStatus.SUCCESS &&
    submit_snapshot_status !== EProjectAsyncStatus.SUCCESS ? (
    <StyledBox sx={{ backgroundColor: theme.palette.pink[100] }}>
      <ErrorOutline sx={{ marginRight: "5px" }} />
      <Typography sx={{ fontWeight: 700, fontSize: 12 }}>
        Please submit to blockchain before {formatDate(galaxyOpenTime)}{" "}
        (EarlyPool open time)
      </Typography>
    </StyledBox>
  ) : null;
};

export default SubmitStatusIndicator;
