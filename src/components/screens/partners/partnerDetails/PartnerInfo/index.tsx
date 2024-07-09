import InputField from "@/components/atoms/InputField";
import { Partner } from "@/types";
import { Box } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { PartnerValidationSchema } from "./PartnerValidationSchema";
import { GroupTitle } from "@/components/atoms/GroupTitle";
import { LoadingButton } from "@mui/lab";
import { useAlertContext } from "@/providers/AlertContext";
import { FocusError } from "@/components/atoms/FocusError";
import { useRouter } from "next/router";

interface PartnerInfoProps {
  data: Partner;
  onSubmit: Function;
}

export const PartnerInfo = ({ data, onSubmit }: PartnerInfoProps) => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const handleSubmit = async (
    data: Partial<Partner>,
    actions: FormikHelpers<Partner>,
  ) => {
    try {
      const { setSubmitting } = actions;
      setSubmitting(true);
      await onSubmit(data);
      setSubmitting(false);

      const route = "/admin/partners";
      router.push(route);
    } catch (error) {
      errorAlertHandler(error);
    }
  };
  return (
    <Formik
      validateOnChange={true}
      initialValues={data}
      validationSchema={PartnerValidationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box>
            <GroupTitle>Partner Info</GroupTitle>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                margin: "24px 0px 32px",
              }}
            >
              <div>
                <InputField name="name" label="Name *" />
              </div>
              <div>
                <InputField name="slug" label="Slug *" />
              </div>
              <div>
                <InputField name="description" label="Description" />
              </div>
              <div>
                <InputField name="bgImageURL" label="Background Image URL" />
              </div>
            </Box>
          </Box>

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
