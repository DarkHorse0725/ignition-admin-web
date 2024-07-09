import Layout from "@/components/layout";
import AppsTable from "@/components/screens/apps/appsTable";
import React, { ReactElement } from "react";
import { Box } from "@mui/material";
import { Card } from "@/components/atoms/Card";
import { FloatingAddButton } from "@/components/atoms/FloatingAddButton";

const Apps = () => {
  return (
    <Box ml="15px">
      <Card>
        <AppsTable />
      </Card>

      <FloatingAddButton href={"/admin/apps/id"} />
    </Box>
  );
};

Apps.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Apps;
