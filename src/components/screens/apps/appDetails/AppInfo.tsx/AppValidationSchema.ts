import yup from "@/core/yup";
import { AllBrands, AllEnvs, AllPlatforms } from "@/types";

const phoneRegExp = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;

export const AppValidationSchema = yup.object({
  name: yup.string().min(2).max(120).trim().required(),
  platform: yup.string().oneOf(AllPlatforms).required(),
  brand: yup.string().oneOf(AllBrands).required(),
  environment: yup.string().oneOf(AllEnvs).required(),
  supportEmail: yup.string().email().required(),
  supportNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number must be valid")
    .required(),
  transactionalEmailFromEmail: yup.string().email().trim().required(),
  transactionalEmailFromName: yup
    .string()
    .min(2)
    .max(120)
    .nullable()
    .required(),
  forgotPasswordEmailSubject: yup
    .string()
    .min(2)
    .max(120)
    .nullable()
    .required(),
  forgotPasswordEmailTemplateId: yup
    .string()
    .min(34)
    .sendGridTemplateID()
    .required(),
  forgotPasswordEmailLink: yup
    .string()
    .customUrl("Forgot password email link must be a valid URL")
    .max(128)
    .required(),
  verifyEmailSubject: yup.string().min(2).max(120).nullable().required(),
  verifyEmailTemplateId: yup.string().min(34).sendGridTemplateID().required(),
  verifyEmailLink: yup
    .string()
    .customUrl("Verify email link must be a valid URL")
    .max(128)
    .required(),
  changeEmailSubject: yup.string().min(2).max(120).nullable().required(),
  changeEmailTemplateId: yup.string().min(34).sendGridTemplateID().required(),
  changeEmailLink: yup
    .string()
    .customUrl("Change password email link must be a valid URL")
    .max(128)
    .required(),
});
