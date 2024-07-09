import yup from "@/core/yup";
import { AllAvailableBrands, BrandEnums } from "@/types";
import { subMinutes } from "date-fns";

export const CreateProjectValidateSchema = [
  yup.object().shape({
    brand: yup
      .string()
      .default(BrandEnums.IGNITION)
      .oneOf(AllAvailableBrands)
      .required()
      .emptyAsUndefined(),
    slug: yup
      .string()
      .required("Slug is a required field")
      .max(128, "Slug must be at most 128 characters")
      .matches(
        /^[a-zA-Z0-9\-_.\&=?+]*$/,
        `Slug only allow english alphabetic, number, some special characters: - _ . & = ? +`,
      ),
    name: yup
      .string()
      .required("Name is a required field")
      .max(128, "Name must be at most 128 characters")
      .trim(),
    description: yup
      .string()
      .required("Description is a required field")
      .max(10000, "Maximum 10000 characters allowed")
      .trim(),
    biography: yup
      .string()
      .required("Bio is a required field")
      .max(250, "Maximum 250 characters allowed")
      .trim(),
    logo: yup
      .string()
      .min(1)
      .required("Logo is a required field")
      .url("Logo must be a valid URL"),
    mainImage: yup.string().min(1).url("Main image must be a valid URL"),
    featuredBannerImageURL: yup
      .string()
      .min(1)
      .url("Featured banner image must be a valid URL"),
    featuredImageVideoURL: yup
      .string()
      .min(1)
      .url("Featured image video must be a valid URL"),
    ended: yup.bool().default(false).required(),
    restrictedCountries: yup.array().nullable().notRequired(),
    tags: yup.array().max(3, "Tags must have less than or equal 3 tag"),
    network: yup.number().required("IDO network is a required field"),
    currency: yup.string().required("Currency is a required field"),
    projectType: yup
      .string()
      .required("Public/Private Sale is a required field"),
    totalRaise: yup
      .number()
      .typeError("Field must be between 1 and 1,000,000,000,000")
      .nullable()
      .min(1, "Field must be between 1 and 1,000,000,000,000")
      .max(1000000000000, "Field must be between 1 and 1,000,000,000,000")
      .totalRaiseRange(
        1,
        1000000000000,
        "Field must be between 1 and 1,000,000,000,000",
      )
      .positive("Field must be between 1 and 1,000,000,000,000")
      .integer("Field must be between 1 and 1,000,000,000,000")
      .test(
        "must-be-greater-than-or-equal-to-KYC-Limit",
        "Total Raise must be greater than or equal to KYC Limt ",
        function (value) {
          const { KYCLimit } = this.parent;
          if (value && KYCLimit > 0 && value > 0) {
            return value >= KYCLimit;
          }
          return true;
        },
      ),
    totalRaiseSoftLimit: yup
      .number()
      .typeError("Field must be between 1 and 1,000,000,000,000")
      .nullable()
      .min(1, "Field must be between 1 and 1,000,000,000,000")
      .max(1000000000000, "Field must be between 1 and 1,000,000,000,000")
      .totalRaiseRange(
        1,
        1000000000000,
        "Field must be between 1 and 1,000,000,000,000",
      )
      .positive("Field must be between 1 and 1,000,000,000,000")
      .integer("Field must be between 1 and 1,000,000,000,000")
      .test(
        "must-be-less-than-totalRaise",
        "Total Raise Soft Limit must be less than total raise",
        function (value) {
          const { totalRaise } = this.parent;
          if (value && totalRaise > 0 && value > 0) {
            return value < totalRaise;
          }
          return true;
        },
      ),
    tokenFee: yup
      .number()
      .positive("Token Fee must be a positive number")
      .min(0, "Token Fee  must be a positive number")
      .max(100, "Field must be a valid percentage")
      .maxDecimals(2, "Token Fee must be 2 decimals or less"),
    announcementDate: yup
      .date()
      .typeError("Please enter correct format date")
      .nullable()
      .notRequired(),
    contractAddress: yup
      .string()
      .trim()
      .nullable()
      .notRequired()
      .walletAddress("Field must be a valid Wallet Address"),
    collaboratorWallet: yup
      .array()
      .of(yup.string().walletAddress("Field must be a valid Wallet Address")),
    investors: yup.string().max(250, "Maximum 250 characters allowed").trim(),
    marketMaker: yup.string().max(250, "Maximum 250 characters allowed").trim(),
  }),
  // validate token info
  yup.object().shape({
    token: yup.object().shape({
      symbol: yup
        .string()
        .typeError("Price is a required field")
        .max(12, "Symbol must not exceed 12 characters")
        .trim(),
      image: yup.string().url("Token image must be a valid URL"),
      price: yup
        .number()
        .typeError("Price is a required field")
        .nullable()
        .positive("Token price must be a positive number")
        .min(0.00000001, "Token price must exceed 0.000000000")
        .max(1000000000000, "Token price must not exceed 1,000,000,000,000")
        .maxDecimals(4, "Token price must be 4 decimals or less"),
      decimal: yup
        .number()
        .required("Decimal is a required field")
        .default(18)
        .positive("Only allow positive integer number")
        .integer("Only allow positive integer number")
        .min(1, "Token decimal must exceed 0"),
      contractAddress: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .walletAddress("Field must be a valid Wallet Address"),
      ath: yup
        .number()
        .nullable()
        .positive("This field must be a positive number")
        .min(0.00000001, "This field must exceed 0")
        .max(1000000000000, "This field must not exceed 1,000,000,000,000")
        .maxDecimals(2, "This field must be 2 decimals or less"),
      staking: yup.string().customUrl("Field must be a valid URL").nullable(),
      listingOn: yup.object().shape({
        uniSwap: yup.string().customUrl("Field must be a valid URL").nullable(),
        pancakeSwap: yup
          .string()
          .customUrl("Field must be a valid URL")
          .nullable(),
      }),
    }),
  }),
  //validate KYC
  yup.object().shape({
    KYCLimit: yup
      .number()
      .typeError("KYC Limit must be a number")
      .positive("KYC Limit must be a positive number")
      .max(1000000000000, "This field must not exceed 1,000,000,000,000")
      .maxDecimals(2, "KYC Limit must be 2 decimals or less")
      .test(
        "is-not-greater-than-totalRaise",
        "KYC Limit cannot be greater than Total Raise",
        function (value) {
          const { totalRaise } = this.parent;
          if (totalRaise > 0) {
            return (value || 0) <= totalRaise;
          }
          return true;
        },
      ),
    nonKYCLimit: yup
      .number()
      .typeError("Non-KYC Limit must be a number")
      .positive("Non-KYC Limit must be a positive number")
      .max(1000, "This field must not exceed 1,000")
      .maxDecimals(2, "Non-KYC Limit must be 2 decimals or less"),
  }),
  yup.object().shape({
    social: yup.object().shape({
      facebook: yup.string().customUrl("Field must be a valid URL").nullable(),
      twitter: yup.string().customUrl("Field must be a valid URL").nullable(),
      discord: yup.string().customUrl("Field must be a valid URL").nullable(),
      instagram: yup.string().customUrl("Field must be a valid URL").nullable(),
      telegram: yup.string().customUrl("Field must be a valid URL").nullable(),
      website: yup.string().customUrl("Field must be a valid URL").nullable(),
      medium: yup.string().customUrl("Field must be a valid URL").nullable(),
    }),
    redeem: yup.bool().default(false).required(),
    featured: yup.bool().default(false).required(),
    internal: yup.bool().default(false).required(),
    hideTGE: yup.bool().default(false).required(),
    nftSale: yup.bool().default(false).required(),
    registrationEnabled: yup.bool().default(false).required(),
    feeType: yup.bool().default(false).required(),
  }),
];

export const CONDITION_HOUR = 15 / 60;
// export const CONDITION_HOUR = 30;
export const dateSub30Hour = (date: Date | string) => {
  return subMinutes(new Date(date), CONDITION_HOUR * 60);
};
export const ProjectInfoTabValidateSchema = (
  poolOpenTime: Date | undefined,
  isDisabledAnnouncementDate: boolean,
) => {
  let validateYupAnnounceDate = yup.date().nullable().notRequired();
  if (poolOpenTime) {
    validateYupAnnounceDate = validateYupAnnounceDate
      .required(
        "Announcement Date can not be left blank because EarlyPool Open Date has been set up",
      )
      .typeError(
        "Announcement Date can not be left blank because EarlyPool Open Date has been set up",
      );
    if (isDisabledAnnouncementDate) {
      validateYupAnnounceDate = yup.date().nullable().notRequired();
    }
  }

  return yup.object().shape({
    brand: yup.string().oneOf(AllAvailableBrands).required(),
    slug: yup
      .string()
      .required("Slug is a required field")
      .max(128, "Slug must be at most 128 characters")
      .matches(
        /^[a-zA-Z0-9\-_.\&=?+]*$/,
        `Slug only allow english alphabetic, number, some special characters: - _ . & = ? +`,
      ),
    name: yup
      .string()
      .required("Name is a required field")
      .max(128, "Name must be at most 128 characters")
      .trim(),
    tags: yup.array().max(3, "Tags must have less than or equal 3 tags"),
    description: yup
      .string()
      .required("Description is a required field")
      .max(10000, "Maximum 10000 characters allowed")
      .trim(),
    biography: yup
      .string()
      .required("Bio is a required field")
      .max(250, "Maximum 250 characters allowed")
      .trim(),
    logo: yup
      .string()
      .min(1)
      .required("Logo is a required field")
      .url("Logo must be a valid URL"),
    mainImage: yup.string().min(1).url("Main image must be a valid URL"),
    featuredBannerImageURL: yup
      .string()
      .min(1)
      .url("Featured banner image must be a valid URL"),
    featuredImageVideoURL: yup
      .string()
      .min(1)
      .url("Featured image video must be a valid URL"),
    ended: yup.bool().default(false).required(),
    restrictedCountries: yup.array().nullable().notRequired(),
    network: yup.number().required("IDO network is a required field"),
    currency: yup.string().required("Currency is a required field"),
    projectType: yup
      .string()
      .required("Public/Private Sale is a required field"),
    totalRaise: yup
      .number()
      .typeError("Field must be between 1 and 1,000,000,000,000")
      .nullable()
      .max(1000000000000, "Field must be between 1 and 1,000,000,000,000")
      .totalRaiseRange(
        1,
        1000000000000,
        "Field must be between 1 and 1,000,000,000,000",
      )
      .integer("Field must be between 1 and 1,000,000,000,000")
      .test(
        "must-be-greater-than-or-equal-to-KYC-Limit",
        "Total Raise must be greater than or equal to KYC Limt ",
        function (value) {
          const { KYCLimit } = this.parent;
          if (value && KYCLimit > 0 && value > 0) {
            return value >= KYCLimit;
          }
          return true;
        },
      ),
    totalRaiseSoftLimit: yup
      .number()
      .typeError("Field must be between 1 and 1,000,000,000,000")
      .nullable()
      .min(1, "Field must be between 1 and 1,000,000,000,000")
      .max(1000000000000, "Field must be between 1 and 1,000,000,000,000")
      .totalRaiseRange(
        1,
        1000000000000,
        "Field must be between 1 and 1,000,000,000,000",
      )
      .positive("Field must be between 1 and 1,000,000,000,000")
      .integer("Field must be between 1 and 1,000,000,000,000")
      .test(
        "must-be-less-than-totalRaise",
        "Total Raise Soft Limit must be less than total raise",
        function (value) {
          const { totalRaise } = this.parent;
          if (value && totalRaise > 0 && value > 0) {
            return value < totalRaise;
          }
          return true;
        },
      ),
    tokenFee: yup
      .number()
      .max(100, "Field must be a valid percentage")
      .maxDecimals(2, "Token Fee must be 2 decimals or less"),
    announcementDate: validateYupAnnounceDate,
    contractAddress: yup
      .string()
      .trim()
      .nullable()
      .notRequired()
      .walletAddress("Field must be a valid Wallet Address"),
    collaboratorWallet: yup
      .array()
      .of(
        yup
          .string()
          .notRequired()
          .walletAddress("Field must be a valid Wallet Address"),
      )
      .nullable(),
    token: yup.object().shape({
      symbol: yup
        .string()
        // .required("Symbol is required field")
        .max(12, "Symbol must not exceed 12 characters")
        .trim(),
      image: yup.string().url("Token image must be a valid URL"),
      price: yup
        .number()
        .typeError("Price is a required field")
        .max(1000000000000, "Token price must not exceed 1,000,000,000,000")
        .maxDecimals(4, "Token price must be 4 decimals or less"),
      decimal: yup
        .number()
        .required("Decimal is a required field")
        .default(18)
        .positive("Only allow positive integer number")
        .integer("Only allow positive integer number")
        .min(1, "Token decimal must exceed 0"),
      contractAddress: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .walletAddress("Field must be a valid Wallet Address"),
      ath: yup
        .number()
        .nullable()
        .max(1000000000000, "This field must not exceed 1,000,000,000,000")
        .maxDecimals(2, "This field must be 2 decimals or less"),
      staking: yup.string().customUrl("Field must be a valid URL").nullable(),
      listingOn: yup.object().shape({
        uniSwap: yup.string().customUrl("Field must be a valid URL").nullable(),
        pancakeSwap: yup
          .string()
          .customUrl("Field must be a valid URL")
          .nullable(),
      }),
    }),
    KYCLimit: yup
      .number()
      .typeError("KYC Limit must be a number")
      .max(1000000000000, "This field must not exceed 1,000,000,000,000")
      .maxDecimals(2, "KYC Limit must be 2 decimals or less")
      .test(
        "is-not-greater-than-totalRaise",
        "KYC Limit cannot be greater than Total Raise",
        function (value) {
          const { totalRaise } = this.parent;
          if (totalRaise > 0) {
            return (value || 0) <= totalRaise;
          }
          return true;
        },
      ),
    nonKYCLimit: yup
      .number()
      .typeError("Non-KYC Limit must be a number")
      .max(1000000000000, "This field must not exceed 1,000,000,000,000")
      .maxDecimals(2, "Non-KYC Limit must be 2 decimals or less"),
    social: yup.object().shape({
      facebook: yup.string().customUrl("Field must be a valid URL").nullable(),
      twitter: yup.string().customUrl("Field must be a valid URL").nullable(),
      discord: yup.string().customUrl("Field must be a valid URL").nullable(),
      instagram: yup.string().customUrl("Field must be a valid URL").nullable(),
      telegram: yup.string().customUrl("Field must be a valid URL").nullable(),
      website: yup.string().customUrl("Field must be a valid URL").nullable(),
      medium: yup.string().customUrl("Field must be a valid URL").nullable(),
    }),
    redeem: yup.bool().default(false).required(),
    investors: yup.string().max(250, "Maximum 250 characters allowed").trim(),
    marketMaker: yup.string().max(250, "Maximum 250 characters allowed").trim(),
    featured: yup.bool().default(false).required(),
    internal: yup.bool().default(false).required(),
    hideTGE: yup.bool().default(false).required(),
    nftSale: yup.bool().default(false).required(),
    registrationEnabled: yup.bool().default(false).required(),
    feeType: yup.bool().default(false).required(),
  });
};
