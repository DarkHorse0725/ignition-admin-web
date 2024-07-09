import { DatePickerField } from "@/components/atoms/DatePickerField";
import InputField from "@/components/atoms/InputField";
import { regexOnlyNumberAndDecimal, regexOnlyPositiveNumber } from "@/helpers";
import { Box, Tooltip, Typography } from "@mui/material";
import { NumberCurrencyInputFormat, WrappedInput } from "../components";
import {
  disabledMessage,
  removePrefixNumberString,
  validateEnteringInput,
} from "../projectFunction";
import { ILayoutFormStepProps } from "./types";
import { useSelectorProjectDetail } from "@/store/hook";
import { AlertWarningIcon } from "@/components/icons";
import { SelectField } from "@/components/atoms/SelectField";
interface IEventOnChange {
  keyCode: number;
  target: { value: string };
  preventDefault: () => void;
}
const validateNumberField = (
  e: IEventOnChange,
  name: string,
  setFieldValue: (field: string, value: string) => void
) => {
  if (
    e.target.value !== "" &&
    !validateEnteringInput(e, regexOnlyPositiveNumber.test(e.target.value))
  ) {
    e.preventDefault();
    return;
  }
  setFieldValue(name, e.target.value);
};

const PERIOD_UNIT_OPTIONS = [
  {
    label: "Minutes",
    value: "minute",
  },
  {
    label: "Hours",
    value: "hour",
  },
  {
    label: "Days",
    value: "day",
  },
  {
    label: "Weeks",
    value: "week",
  },
];
interface IProps extends ILayoutFormStepProps {
  errorCustom: { errorPercentage: string };
}
export const VestingInfoStep = (props: IProps) => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const { formValues, errorCustom, permission } = props;
  const {
    values,
    errors,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    touched,
  } = formValues;
  return (
    <>
      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "vesting.description",
            projectDetails,
            permission
          )}
        >
          <div>
            <InputField
              name="vesting.description"
              label="Vesting (Schedule Details)"
              value={values.vesting?.description}
              disabled={
                !!disabledMessage(
                  "vesting.description",
                  projectDetails,
                  permission
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("vesting.TGEDate", projectDetails, permission)}
        >
          <div>
            <DatePickerField
              name="vesting.TGEDate"
              label="TGE Date( Vesting Start Date )"
              minDateTime={new Date()}
              value={values.vesting.TGEDate}
              setFieldValue={setFieldValue}
              setFieldError={setFieldError}
              setFieldTouched={setFieldTouched}
              customError={errors?.vesting?.TGEDate as any}
              errors={errors}
              touched={touched}
              disabled={
                !!disabledMessage("vesting.TGEDate", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "vesting.TGEPercentage",
            projectDetails,
            permission
          )}
        >
          <div>
            <InputField
              placeholder=""
              name="vesting.TGEPercentage"
              label="TGE Percentage"
              value={values.vesting?.TGEPercentage}
              disabled={
                !!disabledMessage(
                  "vesting.TGEPercentage",
                  projectDetails,
                  permission
                )
              }
              InputProps={{
                inputComponent: NumberCurrencyInputFormat,
                inputProps: {
                  suffix: "%",
                },
              }}
              onKeyDown={(e: {
                keyCode: number;
                target: any;
                key: any;
                preventDefault: () => any;
              }) => {
                if (
                  !validateEnteringInput(
                    e,
                    regexOnlyNumberAndDecimal(1).test(
                      removePrefixNumberString("%", e.target.value)
                    )
                  ) ||
                  (e.key === "." && e.target.value === "")
                ) {
                  return e.preventDefault();
                }
              }}
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ paddingRight: "0.5rem" }}>
                Cliff Length
              </Typography>
              <AlertWarningIcon />
            </Box>
            <Box sx={{ width: "70%", display: "flex" }}>
              <Box sx={{ width: "70%", marginRight: "1rem" }}>
                <InputField
                  name="vesting.cliffLength.value"
                  label="Number"
                  value={values.vesting.cliffLength.value}
                  disabled={
                    !!disabledMessage(
                      "vesting.cliffLength.value",
                      projectDetails,
                      permission
                    )
                  }
                  onChange={(e: IEventOnChange) => {
                    validateNumberField(
                      e,
                      "vesting.cliffLength.value",
                      setFieldValue
                    );
                  }}
                />
              </Box>
              <Box sx={{ width: "25%" }}>
                <SelectField
                  name="vesting.cliffLength.periodUnit"
                  label="Period Unit"
                  selectOptions={PERIOD_UNIT_OPTIONS}
                  disabled={
                    !!disabledMessage(
                      "vesting.cliffLength.periodUnit",
                      projectDetails,
                      permission
                    )
                  }
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "50%" }}></Box>
        </Box>
      </WrappedInput>

      {/* Vesting Frequency */}
      <WrappedInput>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ paddingRight: "0.5rem" }}>
                Vesting Frequency
              </Typography>
              <AlertWarningIcon />
            </Box>
            <Typography>Per</Typography>
            <Box sx={{ width: "70%", display: "flex" }}>
              <Box sx={{ width: "70%", marginRight: "1rem" }}>
                <InputField
                  name="vesting.frequency.value"
                  label="Number"
                  value={values.vesting.frequency.value}
                  disabled={
                    !!disabledMessage(
                      "vesting.frequency.value",
                      projectDetails,
                      permission
                    )
                  }
                  onChange={(e: IEventOnChange) => {
                    validateNumberField(
                      e,
                      "vesting.frequency.value",
                      setFieldValue
                    );
                  }}
                />
              </Box>
              <Box sx={{ width: "25%" }}>
                <SelectField
                  name="vesting.frequency.periodUnit"
                  label="Period Unit"
                  selectOptions={PERIOD_UNIT_OPTIONS}
                  disabled={
                    !!disabledMessage(
                      "vesting.frequency.periodUnit",
                      projectDetails,
                      permission
                    )
                  }
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "50%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", paddingLeft: "5rem" }}>
                <Typography sx={{ paddingRight: "0.5rem" }}>
                  Number of Release
                </Typography>
                <AlertWarningIcon />
              </Box>
              <Box sx={{ width: "50%", marginRight: "1rem" }}>
                <InputField
                  name="vesting.numberOfRelease"
                  label="Number"
                  value={values.vesting.numberOfRelease}
                  disabled={
                    !!disabledMessage(
                      "vesting.numberOfRelease",
                      projectDetails,
                      permission
                    )
                  }
                  onChange={(e: IEventOnChange) => {
                    validateNumberField(
                      e,
                      "vesting.numberOfRelease",
                      setFieldValue
                    );
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </WrappedInput>
    </>
  );
};
