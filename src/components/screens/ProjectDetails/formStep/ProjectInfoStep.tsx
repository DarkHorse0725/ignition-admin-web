import { CheckboxField } from "@/components/atoms/CheckBoxField";
import { DatePickerField } from "@/components/atoms/DatePickerField";
import InputField from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import {
  Country,
  ProjectDetails,
  ProjectTag,
  SUPPORTED_NETWORKS_SELECTIONS,
} from "@/types";
import { Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import {
  MultipleSelectTags,
  NumberCurrencyInputFormat,
  WrappedInput,
} from "../components";
import { MultiInputField } from "../components/MultipleInputField";
import { MultipleSelectCountries } from "../components/MultipleSelectCountries";
import { brandOptions, currencyOptions, projectTypeOptions } from "../initData";
import {
  disabledMessage,
  isSlugExist,
  removePrefixNumberString,
  validateEnteringInput,
} from "../projectFunction";
import { ILayoutFormStepProps } from "./types";
import { useSelectorProjectDetail } from "@/store/hook";
import { regexOnlyNumberAndDecimal } from "@/helpers";
import { Dispatch, SetStateAction } from "react";
import { CustomDescriptionField } from "../components/DescriptionField";

interface IErrorsCustom {
  errorAnnouncementDate: string;
}
interface IProjectInfoStepProps extends ILayoutFormStepProps {
  errorsCustom: IErrorsCustom;
  countries: Country[];
  tags: ProjectTag[];
  projects: ProjectDetails[];
  setAnnouncementDateTouched?: any;
  setErrorAnnouncementDate: Dispatch<SetStateAction<string>>;
}

export const ProjectInfoStep = (props: IProjectInfoStepProps) => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const router = useRouter();
  const { id } = router.query as any;
  const {
    formValues,
    countries,
    projects,
    errorsCustom,
    permission,
    setAnnouncementDateTouched,
    setErrorAnnouncementDate,
    tags,
  } = props;
  const { errorAnnouncementDate } = errorsCustom;
  const {
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    errors,
    touched,
  } = formValues;
  const filterCountries = (name: string, countries: Country[]) => {
    return countries.filter((country) => {
      return country.name.includes(name);
    });
  };
  return (
    <Box>
      <WrappedInput>
        <Tooltip title={disabledMessage("brand", projectDetails, permission)}>
          <div>
            <SelectField
              name="brand"
              label="Brand *"
              selectOptions={brandOptions}
              value={values.brand}
              disabled={!!disabledMessage("brand", projectDetails, permission)}
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <Tooltip
              title={disabledMessage("name", projectDetails, permission)}
            >
              <div>
                <InputField
                  name="name"
                  label="Name *"
                  value={values.name}
                  disabled={
                    !!disabledMessage("name", projectDetails, permission)
                  }
                />
              </div>
            </Tooltip>
          </Box>
          <Box sx={{ width: "50%" }}>
            <Tooltip
              title={disabledMessage("slug", projectDetails, permission)}
            >
              <div>
                <InputField
                  name="slug"
                  label="Slug *"
                  value={values.slug}
                  customError={
                    isSlugExist(values.slug, projects, id)
                      ? "Slug has been used"
                      : ""
                  }
                  disabled={
                    !!disabledMessage("name", projectDetails, permission)
                  }
                />
              </div>
            </Tooltip>
          </Box>
        </Box>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("short bio", projectDetails, permission)}
        >
          <div>
            <InputField
              name="biography"
              label="Short Bio *"
              value={values.biography}
              disabled={
                !!disabledMessage("biography", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("description", projectDetails, permission)}
        >
          <div>
            <CustomDescriptionField
              formValues={formValues}
              label="Description *"
              disabled={
                !!disabledMessage("description", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip title={disabledMessage("tags", projectDetails, permission)}>
          <div>
            <MultipleSelectTags
              isDisabled={!!disabledMessage("tags", projectDetails, permission)}
              label="Tags"
              name="tags"
              valueField="tags"
              autocomplete="off"
              options={tags}
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip title={disabledMessage("logo", projectDetails, permission)}>
          <div>
            <InputField
              placeholder="http(s)://example.com"
              name="logo"
              label="Logo URL (Recommended ratio 1:1) *"
              value={values.logo}
              disabled={!!disabledMessage("logo", projectDetails, permission)}
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("mainImage", projectDetails, permission)}
        >
          <div>
            <InputField
              placeholder="http(s)://example.com"
              name="mainImage"
              label="Main Image URL (Recommended ratio 16:9)"
              value={values.mainImage}
              disabled={
                !!disabledMessage("mainImage", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "featuredBannerImageURL",
            projectDetails,
            permission,
          )}
        >
          <div>
            <InputField
              placeholder="http(s)://example.com"
              name="featuredBannerImageURL"
              label="Featured Banner Image URL"
              value={values.featuredBannerImageURL}
              disabled={
                !!disabledMessage(
                  "featuredBannerImageURL",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "featuredImageVideoURL",
            projectDetails,
            permission,
          )}
        >
          <div>
            <InputField
              placeholder="http(s)://example.com"
              name="featuredImageVideoURL"
              label="Featured Image Video URL"
              value={values.featuredImageVideoURL}
              disabled={
                !!disabledMessage(
                  "featuredImageVideoURL",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "restrictedCountries",
            projectDetails,
            permission,
          )}
        >
          <div>
            <MultipleSelectCountries
              label="Restricted countries"
              name="restrictedCountries"
              getListFunction="countries"
              valueField="restrictedCountries"
              autocomplete="off"
              getOptionsList={() =>
                filterCountries("restrictedCountries", countries)
              }
              options={countries}
              isDisabled={
                !!disabledMessage(
                  "restrictedCountries",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip title={disabledMessage("network", projectDetails, permission)}>
          <div>
            <SelectField
              name="network"
              label="IDO Network * "
              selectOptions={SUPPORTED_NETWORKS_SELECTIONS}
              disabled={
                !!disabledMessage("network", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("currency", projectDetails, permission)}
        >
          <div>
            <SelectField
              name="currency"
              label="Currency *"
              selectOptions={currencyOptions}
              disabled={
                !!disabledMessage("currency", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("totalRaise", projectDetails, permission)}
        >
          <div>
            <InputField
              name="totalRaise"
              label="Total Raise"
              placeholder="$75,000"
              value={values.totalRaise}
              InputProps={{
                inputComponent: NumberCurrencyInputFormat,
                inputProps: {
                  prefix: "$",
                  thousandSeparator: ",",
                },
              }}
              onKeyDown={(e: {
                keyCode: number;
                target: any;
                key: string;
                preventDefault: () => void;
              }) => {
                if (
                  !validateEnteringInput(
                    e,
                    /^(?:[a-zA-Z0-9]|[\b])/.test(
                      removePrefixNumberString("$", e.key),
                    ),
                  )
                ) {
                  return e.preventDefault();
                }
              }}
              disabled={
                !!disabledMessage("totalRaise", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "totalRaiseSoftLimit",
            projectDetails,
            permission,
          )}
        >
          <div>
            <InputField
              name="totalRaiseSoftLimit"
              label="Total Raise Soft Limit"
              placeholder="$75,000"
              value={values.totalRaiseSoftLimit}
              InputProps={{
                inputComponent: NumberCurrencyInputFormat,
                inputProps: {
                  prefix: "$",
                  thousandSeparator: ",",
                },
              }}
              onKeyDown={(e: {
                keyCode: number;
                target: any;
                key: string;
                preventDefault: () => void;
              }) => {
                if (
                  !validateEnteringInput(
                    e,
                    /^(?:[a-zA-Z0-9]|[\b])/.test(
                      removePrefixNumberString("$", e.key),
                    ),
                  )
                ) {
                  return e.preventDefault();
                }
              }}
              disabled={
                !!disabledMessage(
                  "totalRaiseSoftLimit",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("tokenFee", projectDetails, permission)}
        >
          <div>
            <InputField
              name="tokenFee"
              label="Token Fee"
              value={values.tokenFee}
              disabled={
                !!disabledMessage("tokenFee", projectDetails, permission)
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
                      removePrefixNumberString("%", e.target.value),
                    ),
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
        <Tooltip
          title={disabledMessage(
            "announcementDate",
            projectDetails,
            permission,
          )}
        >
          <div>
            <DatePickerField
              name="announcementDate"
              label="Announcement Date"
              minDateTime={new Date()}
              value={values.announcementDate}
              setFieldValue={setFieldValue}
              setFieldError={setFieldError}
              setFieldTouched={setFieldTouched}
              handleOnChange={(data: Date | null) => {
                setFieldValue("announcementDate", data);
                setAnnouncementDateTouched && setAnnouncementDateTouched(true);
                setErrorAnnouncementDate("");
              }}
              errors={errors}
              customError={errorAnnouncementDate}
              touched={touched}
              disabled={
                !!disabledMessage(
                  "announcementDate",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("projectType", projectDetails, permission)}
        >
          <div>
            <SelectField
              name="projectType"
              label="Public/Private Sale *"
              selectOptions={projectTypeOptions}
              value={values.projectType || ""}
              disabled={
                !!disabledMessage("projectType", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "collaboratorWallet",
            projectDetails,
            permission,
          )}
        >
          <div>
            <MultiInputField
              name="collaboratorWallet"
              label="Project Collaborator's Wallet Address"
              value={values.collaboratorWallet}
              errors={errors}
              touched={touched}
              disabled={
                !!disabledMessage(
                  "collaboratorWallet",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("investors", projectDetails, permission)}
        >
          <div>
            <InputField
              name="investors"
              label="Investors"
              value={values.investors}
              disabled={
                !!disabledMessage("investors", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrappedInput>
        <Tooltip
          title={disabledMessage("marketMaker", projectDetails, permission)}
        >
          <div>
            <InputField
              name="marketMaker"
              label="Market Maker"
              value={values.marketMaker}
              disabled={
                !!disabledMessage("marketMaker", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <Tooltip title={disabledMessage("featured", projectDetails, permission)}>
        <div>
          <CheckboxField
            label="Featured"
            name="featured"
            disabled={!!disabledMessage("featured", projectDetails, permission)}
          />
        </div>
      </Tooltip>

      <Tooltip title={disabledMessage("internal", projectDetails, permission)}>
        <div>
          <CheckboxField
            label="Internal"
            name="internal"
            disabled={!!disabledMessage("internal", projectDetails, permission)}
          />
        </div>
      </Tooltip>

      <Tooltip title={disabledMessage("hideTGE", projectDetails, permission)}>
        <div>
          <CheckboxField
            label="Hide TGE"
            name="hideTGE"
            disabled={!!disabledMessage("hideTGE", projectDetails, permission)}
          />
        </div>
      </Tooltip>

      <Tooltip title={disabledMessage("nftSale", projectDetails, permission)}>
        <div>
          <CheckboxField
            label="NFT Sale"
            name="nftSale"
            disabled={!!disabledMessage("nftSale", projectDetails, permission)}
          />
        </div>
      </Tooltip>

      <Tooltip
        title={disabledMessage(
          "registrationEnabled",
          projectDetails,
          permission,
        )}
      >
        <div>
          <CheckboxField
            label="Registration Enabled"
            name="registrationEnabled"
            disabled={
              !!disabledMessage(
                "registrationEnabled",
                projectDetails,
                permission,
              )
            }
          />
        </div>
      </Tooltip>

      <Tooltip title={disabledMessage("feeType", projectDetails, permission)}>
        <div>
          <CheckboxField
            label="Token Participation Fee"
            name="feeType"
            disabled={!!disabledMessage("feeType", projectDetails, permission)}
          />
        </div>
      </Tooltip>
    </Box>
  );
};
