import { Card } from "@/components/atoms/Card";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import Layout from "@/components/layout";
import { AppHeader, AppInfo } from "@/components/screens/apps/appDetails";
import { APIClient } from "@/core/api";
import { getSpecificPropertiesFromObject } from "@/helpers/objectFormatter";
import { useAlertContext } from "@/providers/AlertContext";
import { App } from "@/types";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

const INITIAL_APP_VALUES = {
  name: "",
  brand: "",
  environment: "",
  platform: "",
  maintenance: false,
  supportEmail: "",
  supportNumber: "",
  transactionalEmailFromEmail: "",
  transactionalEmailFromName: "",
  verifyEmailLink: "",
  verifyEmailSubject: "",
  verifyEmailTemplateId: "",
  forgotPasswordEmailLink: "",
  forgotPasswordEmailSubject: "",
  forgotPasswordEmailTemplateId: "",
  changeEmailLink: "",
  changeEmailSubject: "",
  changeEmailTemplateId: "",
};

const appMapping = {
  _id: false,
  createdAt: false,
  updatedAt: false,
  brand: true,
  name: true,
  environment: true,
  platform: true,
  maintenance: true,
  supportEmail: true,
  supportNumber: true,
  key: false,
  secret: false,
  transactionalEmailFromName: true,
  transactionalEmailFromEmail: true,
  forgotPasswordEmailSubject: true,
  forgotPasswordEmailTemplateId: true,
  forgotPasswordEmailLink: true,
  verifyEmailSubject: true,
  verifyEmailTemplateId: true,
  verifyEmailLink: true,
  changeEmailSubject: true,
  changeEmailTemplateId: true,
  changeEmailLink: true,
};

const AppDetails = () => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const [appDetails, setAppDetails] = useState<object>();
  const [loading, setLoading] = useState(false);

  const { id } = router.query;

  useEffect(() => {
    (async () => {
      try {
        if (!id || typeof id !== "string") return;

        if (id === "id") {
          setAppDetails(INITIAL_APP_VALUES);
          return;
        }

        setLoading(true);
        const client = APIClient.getInstance();
        const { data } = await client.apps.findOne(id);
        const filteredData = getSpecificPropertiesFromObject(data, appMapping);
        setAppDetails(filteredData);
      } catch (error) {
        errorAlertHandler(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCreateApp = (data: any) => {
    const client = APIClient.getInstance();
    return client.apps.create(data);
  };

  const handleUpdateApp = (data: any) => {
    const client = APIClient.getInstance();
    return client.apps.update(id as string, data);
  };

  const showCreateApp = (appDetails: any) => (
    <Card sx={{ mt: "15px", flexGrow: 1, overflow: "auto" }}>
      <Typography variant="h4" color="primary.main" mb={2}>
        Create App
      </Typography>
      <AppInfo data={appDetails} onSubmit={handleCreateApp} />
    </Card>
  );

  const showEditApp = (appDetails: App) => (
    <>
      <Card>
        <AppHeader data={{ ...appDetails, _id: (id as string) || "" }} />
      </Card>
      <Card sx={{ mt: "15px", flexGrow: 1, overflow: "auto" }}>
        <AppInfo data={appDetails} onSubmit={handleUpdateApp} />
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
        appDetails &&
        (id === "id"
          ? showCreateApp(appDetails)
          : showEditApp(appDetails as App))
      )}

      <FloatingBackButton />
    </Box>
  );
};

AppDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default AppDetails;
