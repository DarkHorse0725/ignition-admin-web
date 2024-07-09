import InputField from "@/components/atoms/InputField";
import { Typography } from "@mui/material";
import { WrappedInput } from "../components";
import { ContractAddressFieldCustom } from "../components/CustomTokenInfoField";
import {
  calculateTokenAmount,
  getNumberOfDecimalsAfterDot,
} from "../projectFunction";
import { ILayoutFormStepProps } from "./types";
import { CheckboxField } from "@/components/atoms/CheckBoxField";

interface IProps extends ILayoutFormStepProps {}

export const TokenInfoStepOld = (props: IProps) => {
  const { formValues } = props;
  const { values } = formValues;
  const { token, totalRaise, currency } = values;
  return (
    <>
      <WrappedInput>
        <ContractAddressFieldCustom
          name="token.contractAddress"
          label="Token Contract Address"
          value={token?.contractAddress || ""}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="token.symbol"
          label="Symbol"
          value={token?.symbol || ""}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          placeholder="http(s)://example.com"
          name="token.image"
          label="Token Image URL (Recommended ratio 1:1)"
          value={token?.image || ""}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="token.price"
          label="Price *"
          value={token?.price}
          disabled
        />
        {totalRaise && currency && token?.price && Number(token.price) && (
          <Typography sx={{ fontSize: 14 }}>
            {getNumberOfDecimalsAfterDot(
              calculateTokenAmount(totalRaise, Number(token.price)),
              2
            )}
            <Typography component="span" sx={{ paddingLeft: "5px" }}>
              tokens
            </Typography>
          </Typography>
        )}
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="token.decimal"
          label="Decimal"
          value={token?.decimal || ""}
          disabled
        />
      </WrappedInput>
      <WrappedInput>
        <InputField
          name="token.tooltip"
          label="Tooltip (Tokens Received Details)"
          value={token?.tooltip}
          disabled
        />
      </WrappedInput>
      <CheckboxField label="Airdrop" name="airdrop" disabled />
    </>
  );
};
