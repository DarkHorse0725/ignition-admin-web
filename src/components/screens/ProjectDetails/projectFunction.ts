import { PERMISSION } from "@/core/ACLConfig";
import { getJsonApi } from "@/core/api/services/contract.service/contract.utils";
import { DOUBLE_ZERO_STRING_CONSTANT } from "@/helpers/constant";
import {
  KeyboardKeyCodeEnums,
  PoolStatus,
  ProjectDetails,
  ProjectStatus,
} from "@/types";
import { differenceInHours, parseISO } from "date-fns";
import _ from "lodash";
import {
  chainOptions,
  chainOptionsDevEnvironment,
  chainIdMappingsByNetwork,
  ProjectTypeEnums,
} from "./initData";
import { contracts } from "@/helpers/setupContract";

const isDateTimeGreaterThanCurrentTime = (
  dateTime: string | Date | null,
): boolean => {
  const currentDate = new Date();
  const selectedDate = dateTime ? new Date(dateTime) : currentDate;

  return currentDate < selectedDate;
};

const isSlugExist = (
  slug: string | undefined,
  projects: ProjectDetails[],
  projectId?: string | null,
) => {
  if (!slug || !projects.length) {
    return false;
  }

  return projects.findIndex((e) => e.slug === slug && e._id !== projectId) >= 0;
};

const validateEnteringInput = (
  e: {
    keyCode: number;
    target: any;
    preventDefault: () => void;
    key?: any;
  },
  regexValidate: any,
) => {
  if (e.keyCode === KeyboardKeyCodeEnums.Backspace) {
    return true;
  }
  if (
    !regexValidate ||
    e.keyCode === KeyboardKeyCodeEnums.MinusStandard ||
    e.keyCode === KeyboardKeyCodeEnums.Minus
  ) {
    return false;
  }
  return true;
};

const filterAllAllowedNetworks = (value: string | null) => {
  const options =
    process.env.NEXT_PUBLIC_ENV === "production"
      ? chainOptions
      : chainOptionsDevEnvironment;
  return options?.filter((item) => item.value === value);
};

// 1.567897 => (2) => 1.56
const getNumberOfDecimalsAfterDot = (number: number, numberDecimal: number) => {
  let splitNumber = number.toString().split(".");
  if (splitNumber.length >= 2) {
    if (splitNumber[1] == DOUBLE_ZERO_STRING_CONSTANT) return splitNumber[0];
    return splitNumber[0] + "." + splitNumber[1].slice(0, numberDecimal);
  }
  return number;
};

const removePrefixNumberString = (prefix: string, numberString: string) => {
  if (numberString.startsWith(prefix)) {
    return numberString.substring(1).replaceAll(",", "");
  } else if (numberString.endsWith(prefix)) {
    return numberString
      .substring(0, numberString.length - 1)
      .replaceAll(",", "");
  }
  return numberString;
};

const hasDuplicates = (arr: string[] | null | undefined) => {
  return new Set(arr).size !== arr?.length;
};

const hasDuplicateStrings = (arr: string[] | null | undefined) => {
  if (!arr || arr.length === 0) return false;
  const normalizedArray = arr.map((item) => item.toLowerCase()); // Convert all strings to lowercase

  return normalizedArray.length !== new Set(normalizedArray).size;
};

const calculateTokenAmount = (totalRaise: number, priceOfCurrency: number) => {
  return totalRaise / priceOfCurrency;
};

const getBalanceOf = async (
  tokenContractAddress: string,
  projectChain: any,
  address: string,
) => {
  const jsonRpc = getJsonApi(projectChain);
  if (!jsonRpc) throw new Error(`${projectChain} is not supported`);

  const rs = await contracts(tokenContractAddress, jsonRpc);
  const balance = await rs.balanceOf(address);
  return balance;
};

// check project Chain includes ido network
const checkMatchChainId = (
  chainId: any,
  idoNetwork: number | undefined | null,
) => {
  if (
    !Object.prototype.hasOwnProperty.call(chainIdMappingsByNetwork, chainId)
  ) {
    return false;
  }
  return (
    chainIdMappingsByNetwork[chainId].findIndex(
      (e: number) => e === idoNetwork,
    ) >= 0
  );
};
// validate field TGE Percentage
const errorPercentageRequired = (values: any) => {
  if (!checkMatchChainId(values?.projectChain, values?.network)) return "";
  // projectType is private => no error
  if (values?.projectType !== ProjectTypeEnums.PUBLIC_SALE) return "";
  // tge field is not empty => no error
  if (
    values?.token?.TGEPercentage &&
    !(values?.token?.TGEPercentage).toString().length
  ) {
    return "TGE Percentage is a required field";
  }
  if (
    values?.token?.TGEPercentage !== "" &&
    values?.token?.TGEPercentage >= 0
  ) {
    return "";
  }
  return "TGE Percentage is a required field";
};

const announcementDateErrorMessage = (
  announcementDateField: string | null,
  projectDetails: ProjectDetails,
) => {
  const { status, announcementDate } = projectDetails;
  if (status !== ProjectStatus.DRAFT) return "";
  const galaxyOpenPoolTime = projectDetails.pools[0]?.galaxyOpenTime;
  if (galaxyOpenPoolTime && announcementDate) {
    if (!announcementDateField) {
      return "Announcement Date can not be left blank because EarlyPool Open Date has been set up";
    } else {
      const dateString = new Date(galaxyOpenPoolTime).toISOString();
      if (
        differenceInHours(
          parseISO(dateString),
          parseISO(announcementDateField),
        ) < 30
      ) {
        return "Announcement Date must be 30 hours before the EarlyPool Open Time";
      }
    }
  }
  return "";
};

const whitelistedFieldPoolDeployed = ["TGEDate"];

const blacklistedFields: string[] = [
  "network",
  "currency",
  "projectChain",
  "totalRaise",
  "announcementDate",
  "tokenFee",
  "projectType",
  "token.symbol",
  "token.price",
  "token.decimal",
  "token.contractAddress",
  "token.TGEPercentage",
  "KYCLimit",
  "nonKYCLimit",
  "collaboratorWallet",
  "TGEPercentage",
  "vesting.cliffLength.value",
  "vesting.frequency.value",
  "vesting.numberOfRelease",
  "Vesting (Schedule Details)",
];

const disabledMessage = (
  inputFieldName = "",
  projectInfo: ProjectDetails,
  permission: PERMISSION[],
) => {
  const { pools, status } = projectInfo;
  if (!permission.includes(PERMISSION.WRITE)) {
    return "You have no permission to modify this field!";
  }
  if (
    inputFieldName === "token.contractAddress" &&
    pools.some((p) => p.status !== PoolStatus.DRAFT && p.deployed)
  ) {
    return `Token Contract Address is no longer editable due to Project status being set to '${status}'`;
  }

  switch (status) {
    case ProjectStatus.PUBLISHED: {
      // if (inputFieldName === "KYCLimit") {
      //   return "KYC Limit is no longer editable due to Project status being set to 'Published'";
      // }
      // if (inputFieldName === "nonKYCLimit") {
      //   return "Non-KYC Limit is no longer editable due to Project status being set to 'Published'";
      // }
      break;
    }
    case ProjectStatus.LIVE: {
      const poolNotDeployed = !pools[0].deployed;
      if (poolNotDeployed) {
        // if (inputFieldName === "KYCLimit") {
        //   return "KYC Limit  is no longer editable due to Project status being set to 'Live'";
        // }
        // if (inputFieldName === "nonKYCLimit") {
        //   return "Non-KYC Limit is no longer editable due to Project status being set to 'Live'";
        // }
        if (inputFieldName === "announcementDate") {
          return `AnnouncementDate field is no longer editable due to Project status being set to 'Live'`;
        }
      } else {
        if (whitelistedFieldPoolDeployed.includes(inputFieldName)) {
          return "";
        }
        if (blacklistedFields.includes(inputFieldName)) {
          return `'${inputFieldName.toUpperCase()}' field is no longer editable due to Project status being set to 'Live'`;
        }
      }
      break;
    }
    case ProjectStatus.FINISHED: {
      if (inputFieldName.length && blacklistedFields.includes(inputFieldName)) {
        return `'${inputFieldName.toUpperCase()}' field is no longer editable due to Project status being set to 'Finished'`;
      }
      break;
    }
    case ProjectStatus.CANCELLED:
    case ProjectStatus.EMERGENCY_CANCELLED: {
      return `'${inputFieldName.toUpperCase()}' field is no longer editable due to Project status being set to 'Cancel'`;
    }
    default:
      return undefined;
  }
  return undefined;
};

export {
  isDateTimeGreaterThanCurrentTime,
  isSlugExist,
  validateEnteringInput,
  filterAllAllowedNetworks,
  hasDuplicates,
  removePrefixNumberString,
  getNumberOfDecimalsAfterDot,
  calculateTokenAmount,
  errorPercentageRequired,
  announcementDateErrorMessage,
  checkMatchChainId,
  disabledMessage,
  getBalanceOf,
  hasDuplicateStrings,
};
