import yup from "@/core/yup";
import { formatDate } from "@/helpers";
import { PoolStatus, ProjectStatus } from "@/types";
import { addMinutes, subMinutes } from "date-fns";
import { isDateTimeGreaterThanCurrentTime } from "../../projectFunction";

export const CONDITION_HOUR = 0;
//export const CONDITION_HOUR = 30;
const datePlus30Hour = (date: Date | string) => {
  return addMinutes(new Date(date), CONDITION_HOUR * 60);
};
export const UpdateGalaxyPoolStepValidationSchema = (
  projectAnnouncementDate: any,
  galaxyStatus: PoolStatus,
  projectStatus: ProjectStatus,
  checkDisableOpenTimeInput: boolean,
  TGEDate: Date | string | null,
) => {
  let yupTierOpenTime = yup.date().nullable();

  let yubGalaxyEndTime = yup
    .date()
    .nullable()
    .when("tierOpenTime", ([tierOpenTime], schema) => {
      if (!tierOpenTime) return schema;
      else {
        return schema.min(
          addMinutes(new Date(tierOpenTime), 1),
          "EarlyPool End Time field must be later than EarlyPool Open Time ",
        );
      }
    });
  let yubCrowdfundEndTime = yup
    .date()
    .nullable()
    .when("endTime", ([endTime], schema) => {
      if (!!endTime === false) return schema;
      return schema.min(
        addMinutes(new Date(endTime), 1),
        "OpenPool End Time field must be later than EarlyPool End Time",
      );
    });
  if (
    (projectStatus === ProjectStatus.DRAFT ||
      projectStatus === ProjectStatus.PUBLISHED) &&
    !!projectAnnouncementDate &&
    !checkDisableOpenTimeInput
  ) {
    if (!isDateTimeGreaterThanCurrentTime(projectAnnouncementDate)) {
      yupTierOpenTime = yupTierOpenTime.min(
        addMinutes(new Date(datePlus30Hour(new Date())), 1),
        `EarlyPoolOpen Time must be later than ${formatDate(
          datePlus30Hour(new Date()).toString(),
        )}`,
      );
    } else {
      yupTierOpenTime = yupTierOpenTime.min(
        addMinutes(new Date(datePlus30Hour(projectAnnouncementDate)), 1),
        `EarlyPool Open Time must be later than ${formatDate(
          datePlus30Hour(projectAnnouncementDate).toString(),
        )}`,
      );
    }
  }
  if (
    galaxyStatus !== PoolStatus.DRAFT &&
    galaxyStatus !== PoolStatus.PUBLISHED
  ) {
    yupTierOpenTime = yupTierOpenTime
      .typeError("This is a required field")
      .required("This is a required field");
    yubGalaxyEndTime = yubGalaxyEndTime
      .required("This is a required field ")
      .typeError("This is a required field");
    yubCrowdfundEndTime = yupTierOpenTime
      .required("This is a required field ")
      .typeError("This is a required field")
      .when("endTime", ([endTime], schema) => {
        if (!!endTime === false) return schema;
        return schema.min(
          addMinutes(new Date(endTime), 1),
          "OpenPool End Time field must be later than EarlyPool End Time",
        );
      });
  }
  //condition for number
  const yupForNumber = yup
    .number()
    .required("This is a required field")
    .min(0, "Field must be a valid percentage")
    .max(100, "Field must be a valid percentage");
  return yup.object().shape(
    {
      totalRaise: yup
        .number()
        .required("This is a required field")
        .max(100, "Field must be a valid percentage")
        .positive("EarlyPool Raise Percentage must exceed 0"),
      tierOpenTime: yupTierOpenTime,
      endTime: yubGalaxyEndTime,
      participantFee: yupForNumber,
      earlyAccessPercentage: yup
        .number()
        .required("This is a required field")
        .min(0, "Field must be a valid percentage")
        .max(
          99.99,
          "Early access for OpenPool Percentage must not exceed or equal 100%",
        ),
      crowdfundEndTime: yubCrowdfundEndTime.when(([], schema) => {
        if (TGEDate) {
          return schema
            .typeError("OpenPool Time must be prior to TGE Date")
            .max(TGEDate, "OpenPool Time must be prior to TGE Date");
        }
        return schema;
      }),
      crowdfundParticipantFee: yupForNumber,
    },
    [
      ["tierOpenTime", "endTime"],
      ["endTime", "crowdfundEndTime"],
    ],
  );
};
