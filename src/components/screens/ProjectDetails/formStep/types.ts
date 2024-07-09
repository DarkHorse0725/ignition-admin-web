import { PERMISSION } from "@/core/ACLConfig";
import { ProjectDetails } from "@/types";
import { FormikErrors, FormikTouched } from "formik";

export interface IFormProps {
  values: any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  setFieldTouched: (
    field: string,
    isTouched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => void;
  errors: any;
  touched: FormikTouched<Partial<ProjectDetails>>;
}
export interface ILayoutFormStepProps {
  formValues: IFormProps;
  permission: PERMISSION[];
}

export interface IEventOnChange {
  keyCode: number;
  target: { value: string };
  preventDefault: () => void;
}
