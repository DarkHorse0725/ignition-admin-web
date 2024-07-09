import {
  getPermissionOfResource,
  PERMISSION,
  RESOURCES,
} from "@/core/ACLConfig";
import { APIClient } from "@/core/api";
import { cleanData } from "@/helpers";
import { getSpecificPropertiesFromObject } from "@/helpers/objectFormatter";
import { useAlertContext } from "@/providers/AlertContext";
import { updateDetails } from "@/store/features/projectDetailsSlice";
import {
  AlertTypes,
  Country,
  ProjectDetails,
  ProjectStatus,
  ProjectTag,
  PurchaseTokenResponse,
} from "@/types";
import { Box, Button, useTheme } from "@mui/material";
import { Form, Formik } from "formik";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { WrappedInput, WrappedInputTitle } from "../../components";
import {
  KycStep,
  ProjectInfoStep,
  SocialNetworksStep,
  TokenInfoStep,
} from "../../formStep";
import { mappingEditableData } from "../../initData";
import {
  disabledMessage,
  // errorPercentageRequired,
  hasDuplicateStrings,
  isDateTimeGreaterThanCurrentTime,
  isSlugExist,
} from "../../projectFunction";
import { ProjectInfoTabValidateSchema } from "../../ProjectValidation";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";

const ProjectInfoTab = () => {
  const { current: projectDetail } = useSelectorProjectDetail();
  const { role } = useSelectorAuth();
  const theme = useTheme();
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_INFO,
  );
  const router = useRouter();
  const { id } = router.query as any;
  const topMessageRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const { announcementDate, status, pools } = projectDetail;
  const galaxyPool = pools[0];
  // const crowdFundingPool = pools[1];
  const newObject = getSpecificPropertiesFromObject(
    projectDetail,
    mappingEditableData,
  );
  const [purchaseToken, setPurchaseToken] = useState<
    Array<PurchaseTokenResponse>
  >([]);
  //error state
  const [errorAnnouncementDate, setErrorAnnouncementDate] =
    useState<string>("");
  useEffect(() => {
    const getCountries = async () => {
      const result = await APIClient.getInstance().countries.list();
      if (!result) {
        return;
      }
      setCountries(result?.data);
    };
    const getListProject = async () => {
      const { data } = await APIClient.getInstance().projects.listAllProjects();
      setProjects(data);
    };
    const getListPurchaseToken = async () => {
      const result = await APIClient.getInstance().projects.listPurchaseToken();
      setPurchaseToken(result?.data);
    };
    const getListTags = async () => {
      const { data } = await APIClient.getInstance().tag.list();
      setTags(data);
    };
    getCountries();
    getListProject();
    getListPurchaseToken();
    getListTags();
  }, []);
  const ScrollToTop = () => {
    topMessageRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSubmit = async (data: ProjectDetails) => {
    const hasError = checkForErrorsForm(data);
    if (hasError) {
      console.log("handlsubmit errors:", JSON.stringify(hasError));
      return;
    }
    try {
      let updatedData = prepareDataForm(data);
      const alpha3Items: Array<string> = [];
      const restrictedCountries = data.restrictedCountries || [];
      restrictedCountries.forEach((value: any) => {
        alpha3Items.push(typeof value === "string" ? value : value.alpha3);
      });
      const result = await APIClient.getInstance().projects.update(
        id,
        cleanData({ ...updatedData, restrictedCountries: alpha3Items }) as any,
      );
      if (result) {
        dispatch(updateDetails(result.data));
        updateAlert(
          ``,
          `Updated Project: ${result.data._id}`,
          AlertTypes.SUCCESS,
        );
        ScrollToTop();
      }
    } catch (err) {
      errorAlertHandler(err);
    }
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

    const symbol = updatedData.token?.symbol
      ? updatedData.token?.symbol.trimEnd()
      : "";

    const updatedToken: any = {
      ...updatedData.token,
      price: Number(updatedData.token?.price || 0),
      ath: updatedData.token.ath ? Number(updatedData.token.ath) : 0,
      symbol,
      tooltip: symbol,
    };
    if (updatedData.token.TGEPercentage) {
      updatedToken.TGEPercentage = Number(updatedData.token.TGEPercentage);
    }
    if (updatedData.token.decimal) {
      updatedToken.decimal = Number(updatedData.token.decimal);
    } else {
      updatedToken.decimal = 18;
    }

    return {
      ...updatedData,
      totalRaise: Number(updatedData.totalRaise),
      totalRaiseSoftLimit: Number(updatedData.totalRaiseSoftLimit),
      KYCLimit: Number(updatedData.KYCLimit),
      nonKYCLimit: Number(updatedData.nonKYCLimit),
      tags: data.tags,
      token: cleanData(updatedToken, { removeEmptyStrings: true }),
    };
  };

  const checkForErrorsForm = (data: ProjectDetails) => {
    const { slug, announcementDate, collaboratorWallet } = data;

    if (
      isSlugExist(slug, projects, projectDetail._id) ||
      // errorPercentageRequired(data) ||
      hasDuplicateStrings(collaboratorWallet)
    ) {
      return true;
    }
    if (
      !isDateTimeGreaterThanCurrentTime(announcementDate) &&
      (data.status === ProjectStatus.DRAFT ||
        data.status === ProjectStatus.PUBLISHED) &&
      announcementDate
    ) {
      setErrorAnnouncementDate("Announcement Date must not be in the past");
      return true;
    }

    setErrorAnnouncementDate("");
    return false;
  };
  const [announcementDateTouched, setAnnouncementDateTouched] =
    useState<boolean>(false);
  return (
    <Box>
      <p ref={topMessageRef}></p>
      <Formik
        validateOnChange={true}
        initialValues={
          {
            ...newObject,
            announcementDate: (announcementDate
              ? announcementDate.toString()
              : "") as any,
            token: {
              ...newObject.token,
              contractAddress: newObject.token.contractAddress || "",
              image: newObject.token.image || "",
            },
          } as any
        }
        validationSchema={ProjectInfoTabValidateSchema(
          galaxyPool?.galaxyOpenTime,
          !!disabledMessage(
            "announcementDate",
            projectDetail,
            permissionOfResource,
          ) ||
            (!announcementDateTouched && status !== ProjectStatus.DRAFT),
        )}
        enableReinitialize={!!projectDetail}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldTouched,
          setFieldValue,
          setFieldError,
          errors,
          touched,
          dirty,
          isSubmitting,
        }) => {
          const formValues = {
            values,
            setFieldTouched,
            setFieldValue,
            setFieldError,
            errors,
            touched,
          };
          return (
            <Form style={{ position: "relative", paddingBottom: "20px" }}>
              <WrappedInputTitle>Project Info</WrappedInputTitle>
              <ProjectInfoStep
                formValues={formValues}
                tags={tags}
                countries={countries}
                projects={projects}
                permission={permissionOfResource}
                setErrorAnnouncementDate={setErrorAnnouncementDate}
                errorsCustom={{
                  errorAnnouncementDate: !isDateTimeGreaterThanCurrentTime(
                    announcementDate,
                  )
                    ? errorAnnouncementDate
                    : "",
                }}
                setAnnouncementDateTouched={setAnnouncementDateTouched}
              />
              <WrappedInputTitle>Token Info</WrappedInputTitle>
              <TokenInfoStep
                formValues={formValues}
                permission={permissionOfResource}
              />
              <WrappedInputTitle>KYC Config</WrappedInputTitle>
              <KycStep
                formValues={formValues}
                permission={permissionOfResource}
              />
              <WrappedInputTitle>Social Networks</WrappedInputTitle>
              <SocialNetworksStep
                formValues={formValues}
                permission={permissionOfResource}
              />
              {permissionOfResource.includes(PERMISSION.WRITE) && (
                <Box
                  sx={{
                    width: "100%",
                    height: "56px",
                    bottom: "19px",
                    position: "fixed",
                    zIndex: 999,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      display: "flex",
                      justifyContent: "center",
                      width: "84%",
                      padding: "8px 0",
                    }}
                  >
                    <Box>
                      <Button
                        sx={{
                          padding: "9px 32px",
                        }}
                        disabled={
                          [
                            ProjectStatus.CANCELLED,
                            ProjectStatus.EMERGENCY_CANCELLED,
                          ].includes(status) ||
                          !dirty ||
                          isSubmitting
                        }
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ProjectInfoTab;
