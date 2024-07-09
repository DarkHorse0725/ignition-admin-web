import yup from "@/core/yup";

export const WhitelistValidationSchema = yup.object({
  project: yup.string().mongoID("Project must be a valid Object ID").required(),
  openDate: yup
    .date()
    .nullable()
    .required("Open date is a required field")
    .min(new Date(), "Open date must be current date and onward"),
  closeDate: yup
    .date()
    .nullable()
    .required("Close date is a required field")
    .min(yup.ref("openDate"), "Close date cannot be before start time"),
  displayStakesEntries: yup.bool().required(),
  displayWhitelistEntries: yup.bool().required(),
  stakingContractAddressBinance: yup.string(),
  stakingContractAddressEthereum: yup
    .string()
    .required("Staking address is the required field"),
  tiers: yup.array().of(
    yup.object().shape({
      paidTokens: yup.number().min(0),
      poolName: yup.string().required("Pool name is the required field"),
      participantsAllowed: yup.number().min(0),
      participantsJoined: yup.number().min(0),
    })
  ),
});
