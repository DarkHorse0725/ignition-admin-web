import { Card } from "@/components/atoms/Card";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import Layout from "@/components/layout";
import {
  PartnerHeader,
  PartnerInfo,
} from "@/components/screens/partners/partnerDetails";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { Partner } from "@/types";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

const INITIAL_APP_VALUES = {
  name: "",
  slug: "",
  code: "",
  description: "",
  bgImageURL: "",
};

const PartnerDetails = () => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const [partnerDetails, setPartnerDetails] = useState<object>();
  const [loading, setLoading] = useState(false);

  const { id } = router.query;

  useEffect(() => {
    (async () => {
      try {
        if (!id || typeof id !== "string") return;

        if (id === "id") {
          setPartnerDetails(INITIAL_APP_VALUES);
          return;
        }

        setLoading(true);
        const client = APIClient.getInstance();
        const { data } = await client.partners.findOne(id);
        setPartnerDetails(data);
      } catch (error) {
        errorAlertHandler(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCreatePartner = (data: any) => {
    const client = APIClient.getInstance();
    return client.partners.create(data);
  };

  const handleUpdatePartner = (data: Partner) => {
    const client = APIClient.getInstance();
    return client.partners.update(id as string, data);
  };

  const showCreatePartner = (partnerDetails: Partner) => (
    <Card sx={{ mt: "15px", flexGrow: 1, overflow: "auto" }}>
      <Typography variant="h4" color="primary.main" mb={2}>
        Create Partner
      </Typography>
      <PartnerInfo data={partnerDetails} onSubmit={handleCreatePartner} />
    </Card>
  );

  const showEditPartner = (partnerDetails: Partner) => (
    <>
      <Card>
        <PartnerHeader
          data={{ ...partnerDetails, _id: (id as string) || "" }}
        />
      </Card>
      <Card sx={{ mt: "15px", flexGrow: 1, overflow: "auto" }}>
        <PartnerInfo data={partnerDetails} onSubmit={handleUpdatePartner} />
      </Card>
    </>
  );

  return (
    <Box
      ml="15px"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {loading ? (
        <Typography>Loading ...</Typography>
      ) : (
        partnerDetails &&
        (id === "id"
          ? showCreatePartner(partnerDetails as Partner)
          : showEditPartner(partnerDetails as Partner))
      )}

      <FloatingBackButton />
    </Box>
  );
};

PartnerDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PartnerDetails;
