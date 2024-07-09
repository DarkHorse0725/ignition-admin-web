import { APIClient } from "@/core/api";
import {
  AllowedNetwork,
  Country,
  NETWORK_LABELS,
  ProjectDetails,
  ProjectTag,
  PurchaseTokenResponse,
} from "@/types";
import { Box, Button, useTheme } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import {
  KycStep,
  ProjectInfoStep,
  SocialNetworksStep,
  TokenInfoStep,
} from "./formStep";
import { steps } from "./initData";
import {
  announcementDateErrorMessage,
  hasDuplicateStrings,
  isDateTimeGreaterThanCurrentTime,
  isSlugExist,
} from "./projectFunction";
import { CreateProjectValidateSchema } from "./ProjectValidation";
import { StepLabelComponent } from "./components";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import _ from "lodash";
import { cleanData } from "@/helpers";
import { useAlertContext } from "@/providers/AlertContext";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setDefault } from "@/store/features/projectDetailsSlice";
import { getPermissionOfResource, RESOURCES } from "@/core/ACLConfig";
import { useSelectorAuth } from "@/store/hook";

const environment = process.env.NEXT_PUBLIC_ENV || "";
const network =
  environment === "production"
    ? AllowedNetwork.ARBITRUM
    : environment === "development"
      ? AllowedNetwork.SEPOLIA
      : AllowedNetwork.GANACHE;

const initialValues: any = {
  brand: "ignition",
  name: "",
  slug: "",
  description: "",
  biography: "",
  logo: "",
  mainImage: "",
  featuredBannerImageURL: "",
  featuredImageVideoURL: "",
  featured: false,
  internal: false,
  hideTGE: false,
  nftSale: false,
  registrationEnabled: false,
  feeType: true,
  whitelistForm: "",
  winnersList: "",
  youtubeLiveVideo: "",
  restrictedCountries: "",
  currency: "",
  network,
  projectChain: NETWORK_LABELS[network].toLowerCase(),
  projectType: "",
  totalRaise: "",
  totalRaiseSoftLimit: "",
  tokenFee: "",
  poolOpenDate: "",
  announcementDate: null,
  collaboratorWallet: [""],
  KYCLimit: "",
  nonKYCLimit: "",
  canJoin: false,
  ended: false,
  tags: [],
  investors: "",
  marketMaker: "",
  social: {
    telegram: "",
    twitter: "",
    medium: "",
    website: "",
    whitepaper: "",
    audit: "",
    facebook: "",
    instagram: "",
    discord: "",
  },
  token: {
    price: "",
    contractAddress: "",
    symbol: "",
    tooltip: "",
    image: "",
    decimal: undefined,
    staking: "",
    ath: "",
    listingOn: {
      uniSwap: "",
      pancakeSwap: "",
    },
  },
  vesting: {
    TGEPercentage: "",
    TGEDate: "",
    description: "",
    vestingUrl: "",
    cliffLength: {
      value: undefined,
      periodUnit: "day",
    },
    frequency: {
      value: undefined,
      periodUnit: "day",
    },
    numberOfRelease: undefined,
  },
};

export const CreateProject = () => {
  const theme = useTheme();
  const router = useRouter();
  const { errorAlertHandler } = useAlertContext();
  const { role } = useSelectorAuth();
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_INFO,
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  const isLastStep = activeStep === steps.length - 1;
  const [purchaseToken, setPurchaseToken] = useState<
    Array<PurchaseTokenResponse>
  >([]);
  const [projects, setProjects] = useState<any>([]);
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  const currentValidationSchema = CreateProjectValidateSchema[activeStep];
  const [countries, setCountries] = useState<Country[]>([]);
  const [restrictedCountries, setRestrictedCountries] = useState<Country[]>([]);
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const dispatch = useDispatch();
  const [errorAnnouncementDate, setErrorAnnouncementDate] =
    useState<string>("");

  useEffect(() => {
    dispatch(setDefault());
    const getCountries = async () => {
      const result = await APIClient.getInstance().countries.list();
      if (!result) {
        return;
      }
      setCountries(result?.data);
    };
    const getListPurchaseToken = async () => {
      const result = await APIClient.getInstance().projects.listPurchaseToken();
      setPurchaseToken(result?.data);
    };
    const getListProject = async () => {
      const { data } = await APIClient.getInstance().projects.listAllProjects();
      setProjects(data);
    };
    const getListTags = async () => {
      const { data } = await APIClient.getInstance().tag.list();
      setTags(data);
    };
    const getListRestrictedCountries = async () => {
      const result =
        await APIClient.getInstance().countries.defaultRestrictedCountries();
      setRestrictedCountries(result);
    };
    dispatch(setDefault);
    getListPurchaseToken();
    getCountries();
    getListProject();
    getListRestrictedCountries();
    getListTags();
    return () => {
      setCountries([]);
    };
  }, [dispatch]);
  const handleSubmit = async (
    data: ProjectDetails,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    if (
      isSlugExist(data.slug, projects) ||
      hasDuplicateStrings(data.collaboratorWallet)
    ) {
      return;
    }
    setFieldValue("token.symbol", data.token.symbol.trim());
    setFieldValue("token.tooltip", data.token.tooltip.trim());
    if (isLastStep) {
      const hasError = checkForErrorsForm(data);
      if (hasError) {
        return;
      }
      try {
        let updatedData = prepareDataForm(data);
        const alpha3Items: Array<string> = [];
        const restrictedCountries = data.restrictedCountries || [];
        restrictedCountries.forEach((value: any) => {
          alpha3Items.push(typeof value === "string" ? value : value.alpha3);
        });
        const result = await APIClient.getInstance().projects.create({
          ...updatedData,
          restrictedCountries: alpha3Items,
        } as any);
        if (result) {
          const route = "/admin/projects";
          router.push(
            {
              pathname: route,
              query: { name: result.data.name, id: result.data._id },
            },
            route,
          );
        }
      } catch (err) {
        errorAlertHandler(err);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const checkForErrorsForm = (data: ProjectDetails) => {
    const { announcementDate } = data;
    if (!announcementDate) {
      return false;
    }
    if (announcementDateErrorMessage(announcementDate, data)) {
      return true;
    }
    if (!isDateTimeGreaterThanCurrentTime(announcementDate)) {
      setErrorAnnouncementDate("Announcement Date must not be in the past");
      setActiveStep(0);
      return true;
    } else {
      setErrorAnnouncementDate("");
    }

    return false;
  };

  const prepareDataForm = (data: ProjectDetails) => {
    const { announcementDate } = data;

    let updatedData = { ...data };

    const announcementDateConvertToUTC = new Date(announcementDate) as any;
    updatedData = {
      ...updatedData,
      tokenFee: Number(data.tokenFee),
      announcementDate: announcementDate
        ? announcementDateConvertToUTC.toUTCString()
        : null,
    };
    const purchaseTokenFilterIndex = purchaseToken?.findIndex(
      (p) =>
        Number(p.chainId) === Number(data.network) &&
        p.symbol === data.currency?.toUpperCase(),
    );

    if (purchaseTokenFilterIndex >= 0) {
      updatedData = {
        ...updatedData,
        purchaseToken: purchaseToken[purchaseTokenFilterIndex],
      };
    } else {
      updatedData = _.omit(updatedData, "purchaseToken");
    }
    const updatedToken: any = {
      ...updatedData.token,
      price: Number(updatedData.token?.price),
      ath: updatedData.token.ath ? Number(updatedData.token.ath) : undefined,
      symbol: updatedData.token?.symbol.trimEnd(),
      tooltip: updatedData.token?.symbol.trimEnd() || "",
      decimal: updatedData.token.decimal
        ? Number(updatedData.token.decimal)
        : 18,
    };
    const updatedVesting = {
      ...updatedData.vesting,
      TGEDate: updatedData.vesting.TGEDate || undefined,
      TGEPercentage: Number(updatedData.vesting.TGEPercentage),
      cliffLength: {
        ...updatedData.vesting.cliffLength,
        value: Number(updatedData.vesting.cliffLength.value),
      },
      frequency: {
        ...updatedData.vesting.frequency,
        value: Number(updatedData.vesting.frequency.value),
      },
      numberOfRelease: Number(updatedData.vesting.numberOfRelease),
    };
    return {
      ...updatedData,
      totalRaise: Number(updatedData.totalRaise),
      totalRaiseSoftLimit: Number(updatedData.totalRaiseSoftLimit),
      KYCLimit: Number(updatedData.KYCLimit),
      nonKYCLimit: Number(updatedData.nonKYCLimit),
      tags: data.tags,
      vesting: updatedVesting,
      token: cleanData(updatedToken, { removeEmptyStrings: true }),
    };
  };

  const renderContentStep = (step: number, formValues: any) => {
    switch (step) {
      case 0:
        return (
          <ProjectInfoStep
            formValues={formValues}
            errorsCustom={{
              errorAnnouncementDate: !isDateTimeGreaterThanCurrentTime(
                formValues.values.announcementDate,
              )
                ? errorAnnouncementDate
                : "",
            }}
            countries={countries}
            tags={tags}
            projects={projects}
            permission={permissionOfResource}
            setErrorAnnouncementDate={setErrorAnnouncementDate}
          />
        );
      case 1:
        return (
          <TokenInfoStep
            formValues={formValues}
            permission={permissionOfResource}
          />
        );
      case 2:
        return (
          <KycStep formValues={formValues} permission={permissionOfResource} />
        );
      case 3:
        return (
          <SocialNetworksStep
            formValues={formValues}
            permission={permissionOfResource}
          />
        );
      default:
        break;
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: "20px",
      }}
    >
      <Box sx={{ width: "700px", paddingBottom: "25px" }}>
        <StepLabelComponent activeStep={activeStep} dataStep={steps} />
      </Box>

      <Formik
        enableReinitialize={!!restrictedCountries?.length}
        validationSchema={currentValidationSchema}
        initialValues={{
          ...initialValues,
          restrictedCountries,
        }}
        onSubmit={(data, { setTouched, setFieldValue }) => {
          handleSubmit(data, setFieldValue);
          setTouched({});
        }}
      >
        {({ values, setFieldValue, errors, setFieldTouched, touched }) => {
          return (
            <Form>
              <Box>
                {renderContentStep(activeStep, {
                  values,
                  setFieldValue,
                  errors,
                  setFieldTouched,
                  touched,
                })}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: "25px",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      color="secondary"
                      startIcon={<KeyboardBackspaceIcon />}
                      onClick={handleBack}
                      sx={{
                        marginRight: "20px",
                      }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    sx={{
                      width: "188px",
                      height: "40px",
                    }}
                    type="submit"
                  >
                    Save and Continue
                  </Button>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
