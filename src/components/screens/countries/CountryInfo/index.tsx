import { CheckboxField } from "@/components/atoms/CheckBoxField";
import { FocusError } from "@/components/atoms/FocusError";
import InputField from "@/components/atoms/InputField";
import yup from "@/core/yup";
import { useAlertContext } from "@/providers/AlertContext";
import { Country } from "@/types";
import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React from "react";
const CountryValidationSchema = yup.object({
  name: yup.string().min(2).required(),
  alpha2: yup.string().required().max(2),
  alpha3: yup.string().required().max(3),
  countryCode: yup.number(),
  iso31662: yup.string(),
  region: yup.string().required(),
  regionCode: yup.number().required(),
});

interface CountryInfoProps {
  data: Country;
  onSubmit: Function;
}
const CountryInfo = ({ data, onSubmit }: CountryInfoProps) => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const handleSubmit = async (
    data: Partial<Country>,
    actions: FormikHelpers<Country>
  ) => {
    try {
      const { setSubmitting } = actions;
      setSubmitting(true);
      const { status } = await onSubmit(data);
      setSubmitting(false);

      const route = "/admin/Countries";
      router.push(route);
    } catch (error) {
      errorAlertHandler(error);
    }
  };

  return (
    <Formik
      validateOnChange={true}
      initialValues={data}
      validationSchema={CountryValidationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack spacing={2}>
            <div>
              <InputField name="name" label="Name *" />
            </div>
            <Box
              sx={{
                display: "flex",
                gap: "24px",
              }}
            >
              <div>
                <InputField name="alpha2" label="Alpha2 *" />
              </div>
              <div>
                <InputField name="alpha3" label="Alpha3 *" />
              </div>
            </Box>
            <div>
              <InputField name="countryCode" label="Country Code" />
            </div>
            <div>
              <InputField name="iso31662" label="ISO31662" />
            </div>
            <Box
              sx={{
                display: "flex",
                gap: "24px",
              }}
            >
              <div>
                <InputField name="region" label="Region *" />
              </div>
              <div>
                <InputField name="regionCode" label="Region Code *" />
              </div>
            </Box>

            <CheckboxField
              name="restricted"
              label="Default Restricted Country"
            />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center", mt: "16px" }}>
            <LoadingButton
              sx={{ padding: "9px 32px" }}
              type="submit"
              color="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </LoadingButton>
          </Box>
          <FocusError />
        </Form>
      )}
    </Formik>
  );
};

export default CountryInfo;
