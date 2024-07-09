import InputField from "@/components/atoms/InputField";
import { AllBrands, AllEnvs, AllPlatforms, App } from "@/types";
import { Box } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { AppValidationSchema } from "./AppValidationSchema";
import { GroupTitle } from "@/components/atoms/GroupTitle";
import { LoadingButton } from "@mui/lab";
import { useAlertContext } from "@/providers/AlertContext";
import { SelectField, SelectFieldOption } from "@/components/atoms/SelectField";
import { CheckboxField } from "@/components/atoms/CheckBoxField";
import { FocusError } from "@/components/atoms/FocusError";
import { useRouter } from "next/router";

const platformOptions: SelectFieldOption[] = AllPlatforms.map(
  (platform: string): SelectFieldOption => {
    return {
      label: platform,
      value: platform,
    };
  },
);

const brandOptions: SelectFieldOption[] = AllBrands.map(
  (brand: string): SelectFieldOption => {
    return {
      label: brand,
      value: brand,
    };
  },
);

const envOptions: SelectFieldOption[] = AllEnvs.map(
  (env: string): SelectFieldOption => {
    return {
      label: env,
      value: env,
    };
  },
);

interface AppInfoProps {
  data: App;
  onSubmit: Function;
}

export const AppInfo = ({ data, onSubmit }: AppInfoProps) => {
  const { errorAlertHandler } = useAlertContext();
  const router = useRouter();
  const handleSubmit = async (
    data: Partial<App>,
    actions: FormikHelpers<App>,
  ) => {
    try {
      const { setSubmitting } = actions;
      setSubmitting(true);
      await onSubmit(data);
      setSubmitting(false);

      const route = "/admin/apps";
      router.push(route);
    } catch (error) {
      errorAlertHandler(error);
    }
  };
  return (
    <Formik
      validateOnChange={true}
      initialValues={data}
      validationSchema={AppValidationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box>
            <GroupTitle>App Info</GroupTitle>
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
                <SelectField
                  name="brand"
                  label="Brand *"
                  selectOptions={brandOptions}
                />
              </div>
              <div>
                <SelectField
                  name="environment"
                  label="Environment *"
                  selectOptions={envOptions}
                />
              </div>
              <div>
                <SelectField
                  name="platform"
                  label="Platform *"
                  selectOptions={platformOptions}
                />
              </div>
              <div>
                <InputField name="supportedEmail" label="Supported Email *" />
              </div>
              <div>
                <InputField
                  name="supportedNumber"
                  label="Supported Number *"
                  placeholder="(123) 456-7890"
                />
              </div>
              <CheckboxField label="Maintenance?" name="maintenance" />
            </Box>

            <GroupTitle>Email Info</GroupTitle>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                mt: "24px",
              }}
            >
              <div>
                <InputField
                  name="transactionalEmailFromEmail"
                  label="Transactional Email From Email *"
                />
              </div>
              <div>
                <InputField
                  name="transactionalEmailFromName"
                  label="Transactional Email From Name *"
                />
              </div>
              <div>
                <InputField
                  name="forgotPasswordEmailSubject"
                  label="Forgot Password Email Subject *"
                />
              </div>
              <div>
                <InputField
                  name="forgotPasswordEmailTemplateId"
                  label="Forgot Password Email TemplateId *"
                  placeholder="d-xxx..."
                />
              </div>
              <div>
                <InputField
                  name="forgotPasswordEmailLink"
                  label="Forgot Password Email Link *"
                />
              </div>
              <div>
                <InputField
                  name="verifyEmailSubject"
                  label="Verify Email Subject *"
                />
              </div>
              <div>
                <InputField
                  name="verifyEmailTemplateId"
                  label="Verify Email TemplateId *"
                  placeholder="d-xxx..."
                />
              </div>
              <div>
                <InputField
                  name="verifyEmailLink"
                  label="Verify Email Link *"
                />
              </div>
              <div>
                <InputField
                  name="changeEmailSubject"
                  label="Change Email Subject *"
                />
              </div>
              <div>
                <InputField
                  name="changeEmailTemplateId"
                  label="Change Email TemplateId *"
                  placeholder="d-xxx..."
                />
              </div>
              <div>
                <InputField
                  name="changeEmailLink"
                  label="Change Email Link *"
                />
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
