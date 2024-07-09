import yup from "@/core/yup";
import { PoolStatus } from "@/types";

interface IVestingValidationProps {
  announcementDate: Date | null | string | undefined;
  crowdFundingEndTime: Date | null | string | undefined;
  poolStatus: PoolStatus;
}

export const VestingValidateSchema = (props: IVestingValidationProps) => {
  const { announcementDate, crowdFundingEndTime, poolStatus } = props;
  return yup.object().shape({
    TGEDate: yup
      .date()
      .nullable()
      .notRequired()
      .min(new Date(), "TGE Date must be greater current time")
      .when(([], schema) => {
        if (!announcementDate) return schema;
        return schema.min(
          new Date(announcementDate),
          "TGE Date must be greater than Announcement Date"
        );
      })
      .when(([], schema) => {
        if (!crowdFundingEndTime) return schema;
        return schema.min(
          crowdFundingEndTime,
          "TGE Date must be after OpenPool End Time"
        );
      })
      .when(([], schema) => {
        if (
          poolStatus === PoolStatus.DRAFT ||
          poolStatus === PoolStatus.PUBLISHED
        )
          return schema;
        return schema.required("This field is required");
      }),
    description: yup.string().max(512, "Maximum 512 characters allowed"),
    TGEPercentage: yup
      .number()
      .nullable()
      .positive("TGE percentage must be a positive number")
      .min(0, "TGE percentage must be a positive number")
      .max(100, "Field must be a valid percentage")
      .maxDecimals(2, "TGE Percentage must be 2 decimals or less"),
    cliffLength: yup.object().shape({
      value: yup
        .number()
        .positive("Field must be a valid number")
        .min(0, "Field must be a valid number")
        .max(999999999, "Field must be a valid number"),
      periodUnit: yup.string().when("value", {
        is: (value: any) => !!value,
        then: (schema) => schema.required("This field is required"),
      }),
    }),
    frequency: yup.object().shape({
      value: yup
        .number()
        .positive("Field must be a valid number")
        .min(1, "Field must be a valid number")
        .max(999999999, "Field must be a valid number"),
      periodUnit: yup.string().when("value", {
        is: (value: any) => !!value,
        then: (schema) => schema.required("This field is required"),
      }),
    }),
    numberOfRelease: yup
      .number()
      .positive("Field must be a valid number")
      .min(1, "Field must be a valid number")
      .max(999999999, "Field must be a valid number"),
  });
};
