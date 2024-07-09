import InputField from "@/components/atoms/InputField";
import { Tooltip } from "@mui/material";
import { WrappedInput } from "../components";
import { disabledMessage } from "../projectFunction";
import { ILayoutFormStepProps } from "./types";
import { useSelectorProjectDetail } from "@/store/hook";

interface IProps extends ILayoutFormStepProps {}
export const SocialNetworksStep = (props: IProps) => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const { formValues, permission } = props;
  const { values } = formValues;
  return (
    <>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("social.facebook", projectDetails, permission)}
        >
          <div>
            <InputField
              name="social.facebook"
              label="Facebook (URL)"
              value={values.social?.facebook}
              disabled={
                !!disabledMessage("social.facebook", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("social.twitter", projectDetails, permission)}
        >
          <div>
            <InputField
              name="social.twitter"
              label="Twitter (URL)"
              value={values.social?.twitter}
              disabled={
                !!disabledMessage("social.twitter", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("social.discord", projectDetails, permission)}
        >
          <div>
            <InputField
              name="social.discord"
              label="Discord (URL)"
              value={values.social?.discord}
              disabled={
                !!disabledMessage("social.discord", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "social.instagram",
            projectDetails,
            permission,
          )}
        >
          <div>
            <InputField
              name="social.instagram"
              label="Instagram (URL)"
              value={values.social?.instagram}
              disabled={
                !!disabledMessage(
                  "social.instagram",
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
          title={disabledMessage("social.telegram", projectDetails, permission)}
        >
          <div>
            <InputField
              name="social.telegram"
              label="Telegram (URL)"
              value={values.social?.telegram}
              disabled={
                !!disabledMessage("social.telegram", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("social.website", projectDetails, permission)}
        >
          <div>
            <InputField
              name="social.website"
              label="Website (URL)"
              value={values.social?.website}
              disabled={
                !!disabledMessage("social.website", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("social.medium", projectDetails, permission)}
        >
          <div>
            <InputField
              name="social.medium"
              label="Medium (URL)"
              value={values.social?.medium}
              disabled={
                !!disabledMessage("social.medium", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
    </>
  );
};
