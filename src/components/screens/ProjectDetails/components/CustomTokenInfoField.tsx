import InputField from "@/components/atoms/InputField";
import { Typography, useTheme } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { getTokenInfo } from "@/helpers/getTokenInfo";
import { NETWORK_LABELS, ProposalStatus } from "@/types";
import { ProjectTypeEnums } from "../initData";
import { useSelectorProjectDetail } from "@/store/hook";

type EventOnChange = {
  target: { value: string };
  preventDefault: () => void;
};
interface IProps {
  name: string;
  label: string;
  value: string;
  disabled: boolean;
  messageTokenWhenPrivateSale?: string;
}

const updatedNetworkLabels: any = {
  ...NETWORK_LABELS,
};
export const ContractAddressFieldCustom = (props: IProps) => {
  const theme = useTheme();
  const { values, setFieldValue, errors } = useFormikContext() as any;
  const { projectType, network } = values;
  const { name, value, messageTokenWhenPrivateSale, ...otherProps } = props;
  const { current: ProjectDetails, proposalStatus } =
    useSelectorProjectDetail();
  const { token } = ProjectDetails;
  const [field] = useField(props);

  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [warningTokenAddressMessage, setWarningTokenAddressMessage] =
    useState<string>("");
  const [currentContractAddressInput, setCurrentContractAddressInput] =
    useState<string>("");

  const handleOnChange = (e: EventOnChange) => {
    setCurrentContractAddressInput(e.target.value);
    setFieldValue(name, e.target.value);
  };
  useEffect(() => {
    if (!!messageTokenWhenPrivateSale) {
      setFieldValue("token.contractAddress", "");
    }
    if (proposalStatus === ProposalStatus.Approved) {
      setFieldValue("token.contractAddress", token.contractAddress);
    }
  }, [
    messageTokenWhenPrivateSale,
    projectType,
    proposalStatus,
    setFieldValue,
    token.contractAddress,
  ]);

  useEffect(() => {
    const networkLabel = updatedNetworkLabels[network].toLowerCase();

    // Check if the token contract address is valid and has no errors
    if (
      errors.token?.contractAddress === undefined &&
      value &&
      currentContractAddressInput
    ) {
      // Set loading message while fetching token information
      setLoadingMessage(`Finding token information on ${networkLabel}....`);
      // Fetch token information using the given contract address and project chain
      getTokenInfo(value, networkLabel)
        .then((res: any) => {
          // Reset warning message and set symbol and decimal values based on fetched data
          setWarningTokenAddressMessage("");
          setFieldValue("token.symbol", res.symbol || "");
          setFieldValue(
            "token.decimal",
            res.decimals ? Number(BigInt(res.decimals)) : ""
          );
          setLoadingMessage("");
        })
        .catch(() => {
          // Set warning message if token address cannot be found on the given network
          setWarningTokenAddressMessage(
            `Cannot find the Token address on ${
              // networkLabel?.length ? networkLabel[0].label : ""
              networkLabel
            }`
          );
          // Reset symbol and decimal values
          setLoadingMessage("");
        });
    } else {
      // Reset warning message if token contract address is not valid or has errors
      setWarningTokenAddressMessage("");
    }
  }, [
    setLoadingMessage,
    projectType,
    errors.token?.contractAddress,
    currentContractAddressInput,
    setFieldValue,
    value,
    network,
  ]);
  return (
    <div>
      <InputField
        {...otherProps}
        {...field}
        name={field.name}
        value={value}
        onChange={handleOnChange}
      />
      {warningTokenAddressMessage &&
        !loadingMessage &&
        !errors.token?.contractAddress && (
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.palette.warning.light,
            }}
          >
            {warningTokenAddressMessage}
          </Typography>
        )}
      {loadingMessage && (
        <Typography
          sx={{
            fontSize: "12px",
            color: theme.palette.warning.light,
          }}
        >
          {loadingMessage}
        </Typography>
      )}
    </div>
  );
};
