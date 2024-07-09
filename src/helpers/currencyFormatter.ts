import Dinero from "dinero.js";
import BigNumber from "bignumber.js";

// 1000 => $1,000
export const formatCurrency = (
  amount: string | number | undefined | null,
  currencyFormat = "$0,0", // '$0,0.00'
  precision = 0,
  locale = "en-us"
): string => {
  if (!amount) {
    return "";
  }

  const format = (numericalValue: number): string => {
    const value = Dinero({
      amount: numericalValue,
      precision,
    })
      .setLocale(locale)
      .toFormat(currencyFormat);
    return value;
  };

  if (typeof amount === "string") {
    const numericalValue = Number(amount);
    if (!Number.isNaN(numericalValue)) {
      return format(numericalValue);
    }
  }

  if (typeof amount === "number") {
    return format(amount);
  }

  return "";
};

export const formatBigNumberToDecimal = (
  value: BigNumber,
  decimal: number | undefined
) => {
  if (!value) return "0";
  if (!decimal) decimal = 0;
  const _value = BigNumber(value.toString());
  return _value.dividedBy(BigNumber(10).pow(decimal)).toString();
};
