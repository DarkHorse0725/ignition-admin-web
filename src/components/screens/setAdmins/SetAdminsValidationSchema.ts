import yup from "@/core/yup";
import { ACTIONS, MESSAGES } from "@/types";

export const SetAdminsValidationSchema = yup.object().shape({
  adminAddress: yup
    .string()
    .trim()
    .required("This is a required field")
    .notAddressZero("Invalid wallet address")
    .walletAddress("Invalid wallet address"),
});

export const getActionSuccessMessage = (action: ACTIONS | null) => {
  switch (action) {
    case ACTIONS.ADD_ADMIN:
      return MESSAGES.ADD_SUCCESS;
    case ACTIONS.DELETE_ADMIN:
      return MESSAGES.DELETE_SUCCESS;
    default:
      return "";
  }
};