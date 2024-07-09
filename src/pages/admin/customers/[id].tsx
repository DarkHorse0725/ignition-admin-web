import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Stack, Typography, styled } from "@mui/material";
import { Form, Formik } from "formik";

// Components import
import { APIClient } from "@/core/api";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import { Customer } from "@/types";
import { Card } from "@/components/atoms/Card";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import { useAlertContext } from "@/providers/AlertContext";
import InputField from "@/components/atoms/InputField";
import { LoadingButton } from "@mui/lab";
import { CustomerValidationSchema } from "@/components/screens/customers/CustomerValidationSchema";
import { CheckboxField } from "@/components/atoms/CheckBoxField";
import {
  initCustomerData,
  mappingEditableData,
} from "@/components/screens/customers/initData";
import { getSpecificPropertiesFromObject } from "@/helpers/objectFormatter";

const apiClient = APIClient.getInstance();

interface Wallet {
  account: string;
  chainId: number;
}

export const FlexBox = styled(Box)({
  display: "flex",
  gap: "12px",
});

const CustomerDetails: NextPageWithLayout = () => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const { id: customerId } = router.query as { id: string };
  const isNewCustomer = customerId === "createNew" || customerId === undefined;

  const [customerData, setCustomerData] = useState(initCustomerData);
  const editableData = getSpecificPropertiesFromObject(
    customerData,
    mappingEditableData
  );

  useEffect(() => {
    if (!isNewCustomer) {
      getCustomerData();
    }
  }, [customerId]);

  const getCustomerData = async () => {
    const response = await apiClient.customers.getCustomerById(customerId);
    const { data } = response;
    setCustomerData((prev) => ({ ...prev, ...data }));
  };

  const submitCustomer = async (customerId: string, values: any) => {
    try {
      const data: Partial<Customer> = {
        ...values,
        password: "123456789012",
      };
      const result = isNewCustomer
        ? await apiClient.customers.create(data)
        : await apiClient.customers.update(customerId, data);
      errorAlertHandler(result);
      return result;
    } catch (ex) {
      console.error("error creating pool", ex);
    }
  };

  return (
    <Stack spacing={2} sx={{ ml: 2 }}>
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Customer Details</Typography>
        </Stack>
      </Card>
      <Card>
        <Formik
          validateOnChange={true}
          enableReinitialize={!isNewCustomer}
          initialValues={{ ...editableData }}
          validationSchema={CustomerValidationSchema}
          onSubmit={async (data: Partial<Customer>, { setSubmitting }) => {
            setSubmitting(true);
            const result = await submitCustomer(customerId, data);
            setSubmitting(false);

            const route = "/admin/customers";
            router.push(route);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Stack spacing={2.5}>
                <FlexBox>
                  <InputField name="name" label="Name" />
                  <InputField name="surname" label="Surname" />
                </FlexBox>
                <InputField name="email" label="Email" />
                <InputField name="address" label="Address" />
                <InputField name="brand" label="Brand" />
                <FlexBox>
                  <InputField name="city" label="City" />
                  <InputField name="province" label="Province" />
                </FlexBox>
                <FlexBox>
                  <InputField label={"Country name"} name={"country.name"} />
                  <InputField label={"Country code"} name={"countryCode"} />
                </FlexBox>
                <InputField name="status" label="Status" type="number" />

                <Typography variant="h5">Customer wallets:</Typography>

                {values.wallets
                  ? values.wallets.map((wallet: Wallet, index: number) => (
                      <FlexBox
                        key={`${
                          values.wallets ? values.wallets[index].account : ""
                        } ${
                          values.wallets ? values.wallets[index].chainId : ""
                        }`}
                      >
                        <InputField
                          label={"Wallet account"}
                          name={`wallets[${index}].account`}
                          styleblock={{ width: 450 }}
                        />
                        <InputField
                          label={"Wallet chain ID"}
                          name={`wallets[${index}].chainId`}
                          styleblock={{ width: 150 }}
                        />
                      </FlexBox>
                    ))
                  : null}

                <Box>
                  <CheckboxField
                    label={"Change password next login?"}
                    name={"changePasswordNextLogin"}
                  />
                </Box>

                {/* Submit button */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <LoadingButton
                    sx={{ padding: "9px 32px" }}
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isNewCustomer ? "Create" : "Edit"} Customer
                  </LoadingButton>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
      <FloatingBackButton />
    </Stack>
  );
};

CustomerDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CustomerDetails;
