import yup from "@/core/yup";

export const withdrawValidationSchema = yup.object().shape({
  walletAddress: yup
    .string()
    .trim()
    .required("This is a required field")
    .walletAddress("Invalid wallet address")
    .notAddressZero("Invalid wallet address"),
});
