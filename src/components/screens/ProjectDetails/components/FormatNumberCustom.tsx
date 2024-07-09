import { InputAdornment, Typography, useTheme } from "@mui/material";
import React from "react";
import { NumberFormatValues, NumericFormat } from "react-number-format";
interface CustomNumberProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  prefix: string;
  suffix: string;
  thousandSeparator: string;
}
interface InputAdornmentCustomProps {
  extension?: string;
}

export const InputAdornmentCustom: React.FC<InputAdornmentCustomProps> = ({
  extension = "%",
}) => {
  const theme = useTheme();
  return (
    <InputAdornment position="end" style={{ outline: "none" }}>
      <Typography sx={{ color: theme.palette.common.white }}>
        {extension}
      </Typography>
    </InputAdornment>
  );
};

export const NumberCurrencyInputFormat = React.forwardRef<
  typeof NumericFormat,
  CustomNumberProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, prefix, suffix, thousandSeparator, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values: NumberFormatValues) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={thousandSeparator}
      valueIsNumericString
      prefix={prefix}
      suffix={suffix}
    />
  );
});
