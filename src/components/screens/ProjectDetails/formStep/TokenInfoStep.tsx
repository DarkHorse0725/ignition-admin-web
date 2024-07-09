import InputField from "@/components/atoms/InputField";
import { regexOnlyNumberAndDecimal } from "@/helpers";
import { InputAdornment, Tooltip, Typography, useTheme } from "@mui/material";
import { NumberCurrencyInputFormat, WrappedInput } from "../components";
import { ContractAddressFieldCustom } from "../components/CustomTokenInfoField";
import {
  disabledMessage,
  removePrefixNumberString,
  validateEnteringInput,
} from "../projectFunction";
import { ILayoutFormStepProps } from "./types";
import { useSelectorProjectDetail } from "@/store/hook";
import { roundUp } from "../ProjectHeader";
import { ProjectTypeEnums } from "../initData";

interface IProps extends ILayoutFormStepProps {}

const WrapTokenTitle = ({
  title,
  color,
}: {
  title: string;
  color?: string;
}) => {
  return (
    <Typography
      sx={{
        color: color,
        margin: " 0 18px",
        fontSize: "14px",
        fontWeight: 700,
        padding: "10px 0",
      }}
    >
      {title}
    </Typography>
  );
};

export const TokenInfoStep = (props: IProps) => {
  const { formValues, permission } = props;
  const theme = useTheme();
  const { values, setFieldValue } = formValues;
  const { token, totalRaise, currency, projectType } = values;
  const { current: projectDetails, proposalStatus } =
    useSelectorProjectDetail();

  const checkDisplayTokenAddressMessage =
    projectType === ProjectTypeEnums.PRIVATE_SALE;
  const messageTokenWhenPrivateSale = checkDisplayTokenAddressMessage
    ? "You can not modify this field because Project type is private sale"
    : "";

  return (
    <>
      <WrapTokenTitle title="Pre-sale" color={theme.palette.primary.main} />
      <WrappedInput>
        <Tooltip
          title={
            disabledMessage(
              "token.contractAddress",
              projectDetails,
              permission,
            ) || messageTokenWhenPrivateSale
          }
        >
          <div>
            <ContractAddressFieldCustom
              name="token.contractAddress"
              label="Token Contract Address"
              value={token?.contractAddress || ""}
              messageTokenWhenPrivateSale={messageTokenWhenPrivateSale}
              disabled={
                !!(
                  disabledMessage(
                    "token.contractAddress",
                    projectDetails,
                    permission,
                  ) || messageTokenWhenPrivateSale
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("token.symbol", projectDetails, permission)}
        >
          <div>
            <InputField
              name="token.symbol"
              label="Symbol*"
              value={token?.symbol || ""}
              disabled={
                !!disabledMessage("token.symbol", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("token.image", projectDetails, permission)}
        >
          <div>
            <InputField
              placeholder="http(s)://example.com"
              name="token.image"
              label="Token Image URL (Recommended ratio 1:1)"
              value={token?.image || ""}
              disabled={
                !!disabledMessage("token.image", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("token.price", projectDetails, permission)}
        >
          <div>
            <InputField
              name="token.price"
              label="Price *"
              value={token?.price}
              InputProps={{
                inputComponent: NumberCurrencyInputFormat,
                endAdornment: (
                  <InputAdornment position="end" style={{ outline: "none" }}>
                    {currency?.toUpperCase()}
                  </InputAdornment>
                ) as any,
                inputProps: {
                  prefix: "",
                  thousandSeparator: ",",
                },
              }}
              disabled={
                !!disabledMessage("token.price", projectDetails, permission)
              }
              onKeyDown={(e: {
                keyCode: number;
                target: any;
                key: any;
                preventDefault: () => void;
              }) => {
                if (
                  !validateEnteringInput(
                    e,
                    regexOnlyNumberAndDecimal(5).test(
                      removePrefixNumberString("", e.target.value),
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
        {totalRaise && currency && token?.price && Number(token.price) && (
          <Typography sx={{ fontSize: 11 }}>
            {roundUp(totalRaise, Number(token.price))}
            <Typography
              component="span"
              sx={{ paddingLeft: "5px", fontSize: 11 }}
            >
              tokens
            </Typography>
          </Typography>
        )}
      </WrappedInput>
      <WrappedInput>
        <Tooltip
          title={disabledMessage("token.decimal", projectDetails, permission)}
        >
          <div>
            <InputField
              name="token.decimal"
              label="Decimal*"
              value={token?.decimal}
              disabled={
                !!disabledMessage("token.decimal", projectDetails, permission)
              }
              onChange={(e: {
                target: { value: string };
                preventDefault: () => void;
              }) => {
                if (!/^(?:\d+)?$/.test(e.target.value)) {
                  e.preventDefault();
                  return;
                }
                setFieldValue("token.decimal", e.target.value);
              }}
            />
          </div>
        </Tooltip>
      </WrappedInput>

      <WrapTokenTitle title="After sale" color={theme.palette.primary.main} />
      <WrappedInput>
        <Tooltip
          title={disabledMessage("token.ath", projectDetails, permission)}
        >
          <div>
            <InputField
              name="token.ath"
              label="ATH Price"
              value={token?.ath}
              InputProps={{
                inputComponent: NumberCurrencyInputFormat,
                inputProps: {
                  prefix: "",
                },
              }}
              disabled={
                !!disabledMessage("token.ath", projectDetails, permission)
              }
              onKeyDown={(e: {
                keyCode: number;
                target: any;
                key: any;
                preventDefault: () => void;
              }) => {
                if (
                  !validateEnteringInput(
                    e,
                    regexOnlyNumberAndDecimal(1).test(
                      removePrefixNumberString("", e.target.value),
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
          title={disabledMessage("token.staking", projectDetails, permission)}
        >
          <div>
            <InputField
              name="token.staking"
              label="Staking (URL)"
              value={token?.staking}
              disabled={
                !!disabledMessage("token.staking", projectDetails, permission)
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
      <WrapTokenTitle
        title="Listing on"
        color={theme.palette.secondary.light}
      />
      <WrappedInput>
        <Tooltip
          title={disabledMessage(
            "token.listingOn.uniSwap",
            projectDetails,
            permission,
          )}
        >
          <div>
            <InputField
              name="token.listingOn.uniSwap"
              label="Uniswap (URL)"
              value={token?.listingOn?.uniSwap}
              disabled={
                !!disabledMessage(
                  "token.listingOn.uniSwap",
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
            "token.listingOn.pancakeSwap",
            projectDetails,
            permission,
          )}
        >
          <div>
            <InputField
              name="token.listingOn.pancakeSwap"
              label="PancakeSwap (URL)"
              value={token?.listingOn?.pancakeSwap}
              disabled={
                !!disabledMessage(
                  "token.listingOn.pancakeSwap",
                  projectDetails,
                  permission,
                )
              }
            />
          </div>
        </Tooltip>
      </WrappedInput>
    </>
  );
};
