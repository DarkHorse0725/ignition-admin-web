import { CheckboxField } from "@/components/atoms/CheckBoxField";
import { DatePickerField } from "@/components/atoms/DatePickerField";
import InputField from "@/components/atoms/InputField";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { Whitelist, WhitelistTier } from "@/types";
import { Box, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { WhitelistValidationSchema } from "./whitelistValidation";

const INITIAL_TIERS = [
  {
    paidTokens: 0,
    participantsAllowed: 0,
    participantsJoined: 0,
    poolName: "",
  },
];

const INITIAL_WHITELISTS__DATA: Whitelist = {
  _id: "",
  project: "",
  stakingContractAddressBinance: "",
  stakingContractAddressEthereum: "",
  openDate: "",
  closeDate: "",
  displayStakesEntries: false,
  displayWhitelistEntries: false,
  tiers: INITIAL_TIERS,
};

export const WhitelistForm = () => {
  const router = useRouter();
  let { id: whitelistId } = router.query as any | string;
  const [whitelistData, setWhitelistData] = useState<Whitelist>(
    INITIAL_WHITELISTS__DATA
  );
  const {
    project,
    stakingContractAddressBinance,
    stakingContractAddressEthereum,
    openDate,
    closeDate,
    displayStakesEntries,
    displayWhitelistEntries,
    tiers,
  } = whitelistData;
  const { errorAlertHandler } = useAlertContext();

  useEffect(() => {
    const fetchData = async (whitelistId: string) => {
      try {
        const client = APIClient.getInstance();
        const { data } = await client.whitelists.findOne(whitelistId);
        setWhitelistData(data);
      } catch (error) {
        errorAlertHandler(error);
      }
    };

    if (!whitelistId || whitelistId === "id") return;
    fetchData(whitelistId);
  }, [whitelistId]);

  const handleSubmit = async (
    values: Partial<Whitelist>,
    actions: FormikHelpers<Whitelist>
  ) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    const client = APIClient.getInstance();

    try {
      const { data } = whitelistId?.length
        ? await client.whitelists.update(whitelistId, values)
        : await client.whitelists.create(values);
      setSubmitting(false);
      if (data) {
        const route = "/admin/projects";
        router.push(route);
      }
    } catch (error) {
      errorAlertHandler(error);
    }
  };

  return (
    <Formik
      validateOnChange={true}
      initialValues={{
        _id: "",
        project: project || "",
        stakingContractAddressBinance: stakingContractAddressBinance || "",
        stakingContractAddressEthereum: stakingContractAddressEthereum || "",
        openDate: openDate || new Date(),
        closeDate: closeDate || new Date(),
        displayStakesEntries: displayStakesEntries || true,
        displayWhitelistEntries: displayWhitelistEntries || true,
        tiers: tiers || INITIAL_TIERS,
      }}
      validationSchema={WhitelistValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={whitelistId !== "id"}
    >
      {({
        values: {
          project,
          stakingContractAddressBinance,
          stakingContractAddressEthereum,
          openDate,
          closeDate,
          tiers,
        },
        isSubmitting,
        setFieldValue,
        setFieldError,
        errors,
        setFieldTouched,
        touched,
      }) => (
        <Box sx={{ mx: 2, pt: 2 }}>
          <Form>
            <InputField label={"Project"} name={"project"} value={project} />
            <Box sx={{ display: "flex", gap: "12px", py: 3 }}>
              <DatePickerField
                name="openDate"
                label="Open Date"
                value={openDate}
                minDateTime={dayjs()}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
                setFieldTouched={setFieldTouched}
                errors={errors}
                touched={touched}
                errorMessage="Open date must be current date and onward."
              />
              <DatePickerField
                name="closeDate"
                label="Close Date"
                value={closeDate}
                minDateTime={dayjs(openDate || "")}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
                setFieldTouched={setFieldTouched}
                errors={errors}
                touched={touched}
                errorMessage="End time cannot be before start time"
              />
            </Box>
            <Stack marginTop={5} spacing={3}>
              <InputField
                label={"Staking Contract Address Ethereum"}
                name={"stakingContractAddressEthereum"}
                value={stakingContractAddressEthereum}
              />
              <InputField
                label={"Staking Contract Address Binance"}
                name={"stakingContractAddressBinance"}
                value={stakingContractAddressBinance}
              />
            </Stack>
            <Typography sx={{ my: 2 }}>Tiers:</Typography>
            {tiers && tiers.length
              ? tiers.map((tier: WhitelistTier, index: number) => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "40px",
                      pb: 2,
                      maxWidth: "1240px",
                    }}
                    key={`${tier ? tier.paidTokens : ""} ${
                      tier ? tier.poolName : ""
                    }`}
                  >
                    <InputField
                      label={"Pool Name"}
                      name={`tiers[${index}].poolName`}
                      value={tier ? tier.poolName : ""}
                    />
                    <InputField
                      label={"Paid Tokens"}
                      type="number"
                      name={`tiers[${index}].paidTokens`}
                      value={tier ? tier.paidTokens : 0}
                    />
                    <InputField
                      label={"Participants Joined"}
                      type="number"
                      name={`tiers[${index}].participantsJoined`}
                      value={tier ? tier.participantsJoined : 0}
                    />
                    <InputField
                      label={"Participants Allowed"}
                      type="number"
                      name={`tiers[${index}].participantsAllowed`}
                      value={tier ? tier.participantsAllowed : 0}
                    />
                  </Box>
                ))
              : null}
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                m: 0,
                transform: "TranslateX(-12px)",
              }}
            >
              <Box>
                <CheckboxField
                  name={"displayStakesEntries"}
                  label={"Display stakes entries"}
                />
              </Box>
              <Box>
                <CheckboxField
                  name={"displayWhitelistEntries"}
                  label={"Display whitelist entries"}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                marginTop: "10px",
                justifyContent: "center",
              }}
            >
              <Button
                disabled={isSubmitting}
                type="submit"
                sx={{
                  padding: "10px 60px",
                }}
                color="primary"
              >
                SUBMIT
              </Button>
            </Box>
          </Form>
        </Box>
      )}
    </Formik>
  );
};
