import { Card } from "@/components/atoms/Card";
import { FloatingAddButton } from "@/components/atoms/FloatingAddButton";
import Layout from "@/components/layout";
import { WhitelistsTable } from "@/components/screens/whitelists";
import { NextPageWithLayout } from "@/pages/_app";
import { Box } from "@mui/material";
import React, { ReactElement } from "react";

const Whitelist: NextPageWithLayout = () => {
  return (
    <Box ml="15px">
      <Card>
        <WhitelistsTable />
      </Card>
      <FloatingAddButton href={"/admin/whitelists/id"} />
    </Box>
  );
};

Whitelist.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Whitelist;
