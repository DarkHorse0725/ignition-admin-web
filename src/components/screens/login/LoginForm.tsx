import React, { useState } from "react";
import InputField from "@/components/atoms/InputField";
import { EyeIcon } from "@/components/icons";
import { Box } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { LoadingButton } from "@mui/lab";
import yup from "@/core/yup";
import { LoginFormValue } from "@/types";

interface LoginFormProps {
  onSubmit: (
    values: LoginFormValue,
    actions: FormikHelpers<LoginFormValue>
  ) => Promise<void>;
}

export const LoginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .trim("Email cannot include leading and trailing spaces")
    .required("This field is required"),
  password: yup.string().required("This field is required"),
});

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      validateOnChange={true}
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          <div>
            <InputField name="email" label="Email" type="text" shrink={true} />
          </div>
          <div>
            <InputField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              shrink={true}
              InputProps={{
                endAdornment: (
                  <EyeIcon
                    show={showPassword}
                    changeShow={() => setShowPassword(!showPassword)}
                  />
                ),
              }}
            />
          </div>

          <Box width={180} m="auto">
            <div>
              <LoadingButton
                type="submit"
                color="primary"
                loading={isSubmitting}
                fullWidth
                disabled={!isValid || !dirty || isSubmitting}
              >
                LOGIN
              </LoadingButton>
            </div>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
