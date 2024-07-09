import yup from "@/core/yup";
import { AllAvailableJobIntervalTypes, AllAvailableJobTypes } from "@/types";

export const JobValidationSchema = yup.object().shape({
  name: yup.mixed().oneOf(AllAvailableJobTypes).required('Name is required'),
  duration: yup.number().required(),
  interval: yup.mixed().oneOf(AllAvailableJobIntervalTypes).required('Name is required'),
});
