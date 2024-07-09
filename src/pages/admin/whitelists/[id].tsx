import { Card } from "@/components/atoms/Card";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import Layout from "@/components/layout";
import { WhitelistForm } from "@/components/screens/whitelists";
import { NextPageWithLayout } from "@/pages/_app";
import { Box } from "@mui/material";
import { ReactElement } from "react";

const WhitelistDetails: NextPageWithLayout = () => {
  return (
    <Box ml="15px">
      <Card>
        <WhitelistForm />
      </Card>
      <FloatingBackButton />
    </Box>
  );
};

WhitelistDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default WhitelistDetails;
