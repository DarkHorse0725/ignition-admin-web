import { Card } from "@/components/atoms/Card";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import Layout from "@/components/layout";
import CountryInfo from "@/components/screens/countries/CountryInfo";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { Country } from "@/types";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

const INITIAL_COUNTRY_VALUES = {
  name: "",
  alpha2: "",
  alpha3: "",
  countryCode: "",
  iso31662: "",
  region: "",
  regionCode: "",
  restricted: false,
};
const CountryDetails = () => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const [countryDetails, setCountryDetails] = useState<Object>();
  const [loading, setLoading] = useState(false);
  const { id } = router.query;

  const handleCreateCountry = (data: any) => {
    const client = APIClient.getInstance();
    return client.countries.create(data);
  };

  const handleUpdateCountry = (data: any) => {
    const client = APIClient.getInstance();
    return client.countries.update(id as string, data);
  };

  useEffect(() => {
    (async () => {
      try {
        if (!id || typeof id !== "string") return;
        if (id === "id") {
          setCountryDetails(INITIAL_COUNTRY_VALUES);
          return;
        }

        setLoading(true);
        const client = APIClient.getInstance();
        const data = await client.countries.findOne(id);
        setCountryDetails(data);
      } catch (error) {
        errorAlertHandler(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <Box
      ml="15px"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {loading ? (
        <Typography>Loading ...</Typography>
      ) : (
        countryDetails && (
          <Card>
            {id === "id" ? (
              <>
                <Typography variant="h4" color="primary.main" mb={2}>
                  Create Country
                </Typography>
                <CountryInfo
                  data={countryDetails as Country}
                  onSubmit={handleCreateCountry}
                />
              </>
            ) : (
              <>
                <Typography variant="h4" color="primary.main" mb={2}>
                  Country Details
                </Typography>
                <CountryInfo
                  data={countryDetails as Country}
                  onSubmit={handleUpdateCountry}
                />
              </>
            )}
          </Card>
        )
      )}

      <FloatingBackButton />
    </Box>
  );
};

CountryDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CountryDetails;
