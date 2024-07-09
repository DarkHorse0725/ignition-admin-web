import { CheckboxField } from "@/components/atoms/CheckBoxField";
import { DatePickerField } from "@/components/atoms/DatePickerField";
import InputField from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import { Country, SUPPORTED_NETWORKS_SELECTIONS } from "@/types";
import { Box } from "@mui/system";
import { WrappedInput } from "../components";
import { MultiInputField } from "../components/MultipleInputField";
import { MultipleSelectCountries } from "../components/MultipleSelectCountries";
import {
  brandOptions,
  chainOptions,
  chainOptionsDevEnvironment,
  currencyOptions,
  projectTypeOptions,
} from "../initData";
import { ILayoutFormStepProps } from "./types";

interface IProjectInfoStepProps extends ILayoutFormStepProps {
  countries: Country[];
}

export const ProjectInfoStepOld = (props: IProjectInfoStepProps) => {
  const { formValues, countries } = props;
  const { values } = formValues;
  const environment = process.env.NEXT_PUBLIC_ENV || "";

  return (
    <Box>
      <WrappedInput>
        <SelectField
          name="brand"
          label="Brand *"
          selectOptions={brandOptions}
          value={values.brand}
          disabled
        />
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
            <InputField
              name="name"
              label="Name *"
              value={values.name}
              disabled
            />
          </Box>
          <Box sx={{ width: "50%" }}>
            <InputField
              name="slug"
              label="Slug *"
              value={values.slug}
              disabled
            />
          </Box>
        </Box>
      </WrappedInput>

      <WrappedInput>
        <InputField
          name="description"
          label="Description *"
          value={values.description}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <InputField
          placeholder="http(s)://example.com"
          name="logo"
          label="Logo URL (Recommended ratio 1:1)*"
          value={values.logo}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <InputField
          placeholder="http(s)://example.com"
          name="mainImage"
          label="Main Image URL (Recommended ratio 16:9)*"
          value={values.mainImage}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <InputField
          name="whitelistForm"
          label="Whitelist Form (URL)"
          value={values.whitelistForm}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <InputField
          name="winnersList"
          label="Winner List (URL)"
          value={values.winnersList}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <InputField
          name="youtubeLiveVideo"
          label="Youtube Live Video (URL)"
          value={values.youtubeLiveVideo}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <MultipleSelectCountries
          label="Restricted countries"
          name="restrictedCountries"
          getListFunction="countries"
          valueField="restrictedCountries"
          autocomplete="off"
          options={countries}
          isDisabled={true}
        />
      </WrappedInput>

      <WrappedInput>
        <SelectField
          name="network"
          label="IDO Network * "
          selectOptions={SUPPORTED_NETWORKS_SELECTIONS}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <SelectField
          name="currency"
          label="Currency *"
          selectOptions={currencyOptions}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <SelectField
          name="projectChain"
          label="Project Network*"
          selectOptions={
            environment === "production"
              ? chainOptions
              : chainOptionsDevEnvironment
          }
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <InputField
          name="totalRaise"
          label="Total Raise *"
          placeholder="$75,000"
          value={values.totalRaise}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <DatePickerField
          name="announcementDate"
          label="Announcement Date"
          value={values.announcementDate}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <SelectField
          name="projectType"
          label="Public/Private Sale *"
          selectOptions={projectTypeOptions}
          value={values.projectType || ""}
          disabled
        />
      </WrappedInput>

      <WrappedInput>
        <MultiInputField
          name="collaboratorWallet"
          label="Project Collaborator's Wallet Address* "
          value={values.collaboratorWallet}
          disabled
        />
      </WrappedInput>
      <CheckboxField label="Can Join?" name="canJoin" disabled />
      <CheckboxField label="Featured?" name="featured" disabled />
      <CheckboxField label="Internal?" name="internal" disabled />
    </Box>
  );
};
