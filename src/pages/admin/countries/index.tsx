import { Card } from "@/components/atoms/Card";
import { FloatingAddButton } from "@/components/atoms/FloatingAddButton";
import Layout from "@/components/layout";
import CountriesTable from "@/components/screens/countries/CountriesTable";
import { Box } from "@mui/material";
import React, { ReactElement } from "react";

const Countries = () => {
  return (
    <Box ml="15px">
      <Card>
        <CountriesTable />
      </Card>

      <FloatingAddButton href={"/admin/countries/id"} />
    </Box>
  );
};

Countries.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Countries;
