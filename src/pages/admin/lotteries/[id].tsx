// Libraries import
import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Stack, Typography, styled } from "@mui/material";

// Components import
import { APIClient } from "@/core/api";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import { Lottery } from "@/types";
import { Card } from "@/components/atoms/Card";
import TabsComponent from "@/components/screens/lotteries/tabsComponent";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateDetails } from "@/store/features/lotteryDetailsSlice";

const apiClient = APIClient.getInstance();

const TextWrapper = styled(Box)({
  display: "flex",
});

const LabelText = styled(Typography)(({ theme }) => ({
  variant: "body1",
  color: theme.palette.grey[500],
  marginRight: "1rem",
}))

const LotteryDetails: NextPageWithLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  let { id: lotteryId } = router.query as { id: string };
  const [lotteryDetails, setLotteryDetails] = useState<Lottery>();

  useEffect(() => {
    if (lotteryId) getLotteryById(lotteryId)
  }, [lotteryId])

  const getLotteryById = async (id: string) => {
    const response = await apiClient.lotteries.findOne(id)
    const { data } = response;
    setLotteryDetails(data)
    dispatch(updateDetails(data))
  };

  const { status } = lotteryDetails || {}

  return (
    <Stack spacing={2} sx={{ ml: 2 }}>
      {/* Header */}
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Lottery Details</Typography>
          <TextWrapper>
            <LabelText>ID:</LabelText>
            <Typography variant="body1">{lotteryId}</Typography>
          </TextWrapper>
          <TextWrapper>
            <LabelText>Status:</LabelText>
            <Typography variant="body1" color="primary.main" fontWeight={700}>{status?.toUpperCase()}</Typography>
          </TextWrapper>
        </Stack>
      </Card>
      {/* Body */}
      <Card>
        <TabsComponent />
      </Card>
      <FloatingBackButton />
    </Stack>
  )
}

LotteryDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LotteryDetails;