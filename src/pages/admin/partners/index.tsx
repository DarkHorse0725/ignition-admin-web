import Layout from "@/components/layout";
import PartnersTable from "@/components/screens/partners/partnersTable";
import React, { ReactElement } from "react";
import { Box } from "@mui/material";
import { Card } from "@/components/atoms/Card";
import { FloatingAddButton } from "@/components/atoms/FloatingAddButton";

const Partners = () => {
  return (
    <Box ml="15px">
      <Card>
        <PartnersTable />
      </Card>

      <FloatingAddButton href={"/admin/partners/id"} />
    </Box>
  );
};

Partners.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Partners;
