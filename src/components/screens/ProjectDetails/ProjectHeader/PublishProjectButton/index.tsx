import { Box, Button, Tooltip, Typography, useTheme } from "@mui/material";
import { isAfter } from "date-fns";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertTypes, Pool } from "@/types";
import { LoadingButton } from "@mui/lab";
import { AppDispatch } from "@/store";
import { PublishIcon } from "@/components/icons";
import { formatDate } from "@/helpers";
import { useAlertContext } from "@/providers/AlertContext";
import { APIClient } from "@/core/api";
import { updateDetails } from "@/store/features/projectDetailsSlice";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { useSelectorProjectDetail } from "@/store/hook";

const PublishProjectButton = () => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const { _id, announcementDate, name, brand, pools } = projectDetails;
  const dispatch = useDispatch<AppDispatch>();
  const [showPublishDialog, setShowPublishDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const theme = useTheme();

  const getPublishButtonStatus = (
    projectAnnouncementDate: string | undefined | null,
    pools: Pool[],
  ) => {
    if (!projectAnnouncementDate) {
      return {
        isDisablePublishButton: true,
        tooltip: "Announcement Date is Required",
      };
    }
    if (isAfter(new Date(), new Date(projectAnnouncementDate).setSeconds(59))) {
      return {
        isDisablePublishButton: true,
        tooltip: "Announcement Date must not be in the past",
      };
    }

    // const isPoolConfigured =
    //   pools &&
    //   pools[0]?.galaxyRaisePercentage !== undefined &&
    //   pools[0]?.galaxyParticipantFee !== undefined &&
    //   pools[1]?.earlyAccessPercentage !== undefined &&
    //   pools[1]?.crowdfundingParticipantFee !== undefined;

    // if (!isPoolConfigured) {
    //   return {
    //     isDisablePublishButton: true,
    //     tooltip: "Please fulfill all the required fields from Pool Info",
    //   };
    // }
    return { isDisablePublishButton: false, tooltip: "" };
  };

  const { isDisablePublishButton, tooltip } = useMemo(
    () => getPublishButtonStatus(announcementDate, pools),
    [announcementDate, pools, showPublishDialog],
  );

  const handlePublishProject = async () => {
    const { isDisablePublishButton, tooltip } = getPublishButtonStatus(
      announcementDate,
      pools,
    );
    if (isDisablePublishButton)
      return (
        updateAlert(``, tooltip, AlertTypes.ERROR), setShowPublishDialog(false)
      );

    try {
      setLoading(true);
      const client = APIClient.getInstance();
      const { data } = await client.projects.publish(_id);
      dispatch(updateDetails(data));
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const closePublishDialog = () => {
    setShowPublishDialog(false);
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <span>
          <Button
            sx={{ px: "67px", py: "10px" }}
            disabled={isDisablePublishButton || loading}
            onClick={() => setShowPublishDialog(true)}
          >
            {"Publish"}
          </Button>
        </span>
      </Tooltip>
      <Dialog
        open={showPublishDialog}
        onClose={closePublishDialog}
        width="525px"
      >
        <DialogIcon>
          <PublishIcon />
        </DialogIcon>
        <DialogTitle>Publish Project</DialogTitle>
        <Box sx={{ fontSize: "16px", mt: 2 }}>
          <Typography
            sx={{
              padding: "0 20px",
              textAlign: "center",
              color: theme.palette.grey[800],
            }}
          >
            By publishing this project, you are allowing the
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                padding: "0 5px",
                fontWeight: "600",
              }}
            >
              project: {name}
            </Typography>
            to publish and become public/visible on the specified
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                padding: "0 5px",
                fontWeight: "600",
              }}
            >
              announcement date: {formatDate(announcementDate)}
            </Typography>
            on the {brand} website
          </Typography>
        </Box>
        <DialogActions mt="10px">
          <LoadingButton
            sx={{
              my: 2,
              width: 180,
              height: 40,
            }}
            onClick={handlePublishProject}
            loading={loading}
            color="primary"
          >
            Confirm & Publish
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PublishProjectButton;
