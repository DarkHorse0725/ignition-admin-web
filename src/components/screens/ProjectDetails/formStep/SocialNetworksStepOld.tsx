import InputField from "@/components/atoms/InputField";
import { WrappedInput } from "../components";
import { ILayoutFormStepProps } from "./types";

interface IProps extends ILayoutFormStepProps {}

export const SocialNetworksStepOld = (props: IProps) => {
  const { formValues } = props;
  const { values } = formValues;
  return (
    <>
      <WrappedInput>
        <InputField
          name="social.facebook"
          label="Facebook (URL)"
          value={values.social?.facebook}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="social.twitter"
          label="Twitter (URL)"
          value={values.social?.twitter}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="social.discord"
          label="Discord (URL)"
          value={values.social?.discord}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="social.instagram"
          label="Instagram (URL)"
          value={values.social?.instagram}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="social.telegram"
          label="Telegram (URL)"
          value={values.social?.telegram}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="social.website"
          label="Website (URL)"
          value={values.social?.website}
          disabled
        />
      </WrappedInput>
    </>
  );
};
