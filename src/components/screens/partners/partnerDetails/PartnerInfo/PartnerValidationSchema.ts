import yup from "@/core/yup";

export const PartnerValidationSchema = yup.object().shape({
  name: yup.string().min(2).max(128).trim().required(),
  slug: yup.string().min(2).max(128).trim().required(),
  description: yup.string().min(2).max(10000).trim(),
  bgImageURL: yup.string().url().trim(),
});
