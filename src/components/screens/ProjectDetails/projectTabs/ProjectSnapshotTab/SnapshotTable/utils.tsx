import { emailValidator } from "@/helpers/validator";

export const validateAccount = (account: string): string => {
  if (!account) {
    return "This field is required";
  } else if (account.length > 320) {
    return "Maximum 320 characters";
  } else if (!emailValidator(account)) {
    return "Account is invalid";
  }
  return "";
};

export const validateAllocations = (alloc: string): string => {
  if (!alloc) return "This field is required";

  const count = Number(alloc);
  if (count <= 0) return "Must be an integer larger than 0";
  if (count > 999999) return "This field must not exceed 999,999";
  return "";
};
