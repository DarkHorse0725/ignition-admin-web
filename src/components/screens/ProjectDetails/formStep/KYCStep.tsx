import InputField from "@/components/atoms/InputField";
import { regexOnlyNumberAndDecimal } from "@/helpers";
import { Tooltip } from "@mui/material";
import { useFormikContext } from "formik";
import { WrappedInput } from "../components";
import { disabledMessage, validateEnteringInput } from "../projectFunction";
import { ILayoutFormStepProps } from "./types";
import { useSelectorProjectDetail } from "@/store/hook";

interface IEventOnChange {
  keyCode: number;
  target: { value: string };
  nativeEvent: any;
  preventDefault: () => void;
}
interface IProps extends ILayoutFormStepProps {}
export const KycStep = (props: IProps) => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const { formValues, permission } = props;
  const { values } = formValues;
  const { setFieldValue } = useFormikContext() as any;
  const validateKYCField = (
    e: IEventOnChange,
    name: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    if (
      !validateEnteringInput(
        e,
        regexOnlyNumberAndDecimal(2).test(e.target.value),
      ) ||
      (e.nativeEvent.data === "." && e.target.value === ".")
    ) {
      e.preventDefault();
      return;
    }
    setFieldValue(name, e.target.value);
  };
  values.KYCLimit = values.KYCLimit || values.totalRaise;
  values.nonKYCLimit = values.nonKYCLimit || 1000;
  return (
    <>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("KYCLimit", projectDetails, permission)}
        >
          <div>
            <InputField
              name="KYCLimit"
              label="KYC Limit * "
              value={values.KYCLimit}
              disabled={
                !!disabledMessage("KYCLimit", projectDetails, permission)
              }
              onChange={(e: IEventOnChange) => {
                validateKYCField(e, "KYCLimit", setFieldValue);
              }}
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("nonKYCLimit", projectDetails, permission)}
        >
          <div>
            <InputField
              name="nonKYCLimit"
              label="Non-KYC Limit * "
              value={values.nonKYCLimit}
              disabled={
                !!disabledMessage("nonKYCLimit", projectDetails, permission)
              }
              onChange={(e: IEventOnChange) => {
                validateKYCField(e, "nonKYCLimit", setFieldValue);
              }}
            />
          </div>
        </Tooltip>
      </WrappedInput>
    </>
  );
};
