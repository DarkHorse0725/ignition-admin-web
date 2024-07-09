import * as yup from "yup";
import { ethers } from "ethers";
import WalletValidator from "wallet-address-validator";
import { formatNumberToCurrencyString } from "@/helpers";
import { AnyObject, Maybe } from "yup";

const supportedCurrencies: string[] = [
  "bitcoin",
  "bitcoincash",
  "bitcoingold",
  "ethereum",
  "etherzero",
  "ethereumclassic",
];
const networkType: string =
  process.env.NEXT_PUBLIC_WALLET_ADDRESS_VALIDATOR_NETWORK_TYPE || "both";
yup.addMethod<yup.StringSchema>(
  yup.string,
  "customUrl",
  function (message?: string) {
    return this.test({
      name: "customUrl",
      message: message || "Valid URL required",
      test: (value) => {
        if (value !== undefined) {
          const urlRegex = new RegExp(
            "(https?|ftp|file)://[a-zA-Z0-9.-]+(/[a-zA-Z0-9?&=;+!'()*-._~%]*)*"
          );

          const fieldValue: string = value || "";
          return urlRegex.test(fieldValue);
        }
        return true;
      },
    });
  }
);

yup.addMethod<yup.StringSchema>(yup.string, "emptyAsUndefined", function () {
  return this.transform((value) => (value ? value : undefined));
});

yup.addMethod<yup.NumberSchema>(yup.number, "emptyAsUndefined", function () {
  return this.transform((value, originalValue) =>
    String(originalValue)?.trim() ? value : undefined
  );
});

yup.addMethod<yup.NumberSchema>(
  yup.number,
  "totalRaiseRange",
  function (min: number, max: number, allowZero = false, message?: string) {
    return this.test({
      name: "totalRaiseRange",
      message:
        message ||
        (allowZero
          ? `Field must be between ${formatNumberToCurrencyString(
              min
            )} and ${formatNumberToCurrencyString(max)}`
          : ""),
      test: (value) => {
        if (value !== undefined) {
          const fieldValue: number = value || 0;
          if (fieldValue === 0 && allowZero) {
            return true;
          }
          return fieldValue >= min && fieldValue <= max;
        }

        return true;
      },
    });
  }
);

yup.addMethod<yup.NumberSchema>(
  yup.number,
  "maxDecimals",
  function (max: number, message?: string) {
    return this.test({
      name: "maxDecimalsTest",
      message: message || `Field must be ${max + 1} decimals or less`,
      test: (value) => {
        const numberString = String(value).trim();
        if (numberString && numberString.includes(".")) {
          const [, decimals] = numberString.split(".");
          return decimals.length <= max;
        }
        return true;
      },
    });
  }
);

yup.addMethod<yup.NumberSchema>(
  yup.number,
  "maxDigits",
  function (max: number, message?: string) {
    return this.test({
      name: "maxDigitsTest",
      message: message || `Field must be ${max} digits or less`,
      test: (value) => {
        const numberString = String(value).trim();
        if (numberString) {
          return numberString.length <= max;
        }
        return true;
      },
    });
  }
);
yup.addMethod<yup.StringSchema>(
  yup.string,
  "mongoID",
  function (message?: string) {
    return this.matches(
      /^[0-9a-fA-F]{24}$/,
      message || "Field must be a valid Object ID"
    );
  }
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "sendGridTemplateID",
  function (message?: string) {
    return this.matches(
      /d-[0-9a-zA-Z]{32}$/,
      message || "Field must be a valid Object ID"
    );
  }
);

const isSupportedCurrency = (
  value: string | undefined,
  isOptional: boolean
): boolean => {
  const validateCurrency = (value: string, currency: string): boolean =>
    value && currency
      ? WalletValidator.validate(value, currency, networkType)
      : false;
  if (value === undefined) {
    return isOptional;
  }

  const supportedCurrency = supportedCurrencies.find((currency) => {
    return validateCurrency(value, currency);
  });

  return supportedCurrency !== undefined;
};
yup.addMethod<yup.StringSchema>(
  yup.string,
  "walletAddress",
  function (message?: string, isOptional = true) {
    return this.test({
      name: "walletAddress",
      message: message || "Field must be a valid Wallet Address",
      test: (value) => isSupportedCurrency(value, isOptional),
    });
  }
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "walletAddressOptional",
  function (message?: string, isOptional = true) {
    // See Currencies for validation: https://github.com/ognus/wallet-address-validator/blob/master/src/currencies.js
    return this.test({
      name: "walletAddress",
      message: message || "Field must be a valid Wallet Address",
      test: (value) => {
        if (value === ethers.ZeroAddress) {
          return true;
        }
        return isSupportedCurrency(value, isOptional);
      },
    });
  }
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "notAddressZero",
  function (message?: string) {
    return this.test({
      name: "notAddressZeroTest",
      message: message || `Field must be a valid Wallet Address`,
      test: (value) => {
        return value !== ethers.ZeroAddress;
      },
    });
  }
);
yup.addMethod<yup.StringSchema>(
  yup.string,
  "isEtherWallet",
  function (message?: string) {
    return this.test({
      name: "isEtherWallet",
      message: message || `Field must be a valid Ethereum Wallet Address`,
      test: (value: any) => {
        return ethers.isAddress(value);
      },
    });
  }
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  "slugTrim",
  function (message?: string) {
    return this.test({
      name: "slugTrim",
      message: message || `Field must be a valid Ethereum Wallet Address`,
      test: (value: any) => {
        return value.matches("^\\s*$");
      },
    });
  }
);

yup.addMethod(yup.object, "uniqueProperty", function (propertyName, message) {
  return this.test("unique", message, function (value) {
    if (!value || !value[propertyName]) {
      return true;
    }

    if (
      this.parent
        .filter((v: any) => v !== value)
        .some((v: any) => v[propertyName] === value[propertyName])
    ) {
      throw this.createError({
        path: `${this.path}.${propertyName}`,
      });
    }

    return true;
  });
});
declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends yup.Flags = ""
  > extends yup.Schema<TType, TContext, TDefault, TFlags> {
    emptyAsUndefined(): StringSchema<TType, TContext>;
    mongoID(message?: string): StringSchema<TType, TContext>;
    sendGridTemplateID(message?: string): StringSchema<TType, TContext>;
    walletAddress(message?: string): StringSchema<TType, TContext>;
    walletAddressOptional(message?: string): StringSchema<TType, TContext>;
    notAddressZero(message?: string): StringSchema<TType, TContext>;
    customUrl(message?: string): StringSchema<TType, TContext>;
    uniqueProperty(
      propertyName: any,
      message?: string
    ): StringSchema<TType, TContext>;
    isEtherWallet(message?: string): StringSchema<TType, TContext>;
  }

  interface NumberSchema<
    TType extends Maybe<number> = number | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends yup.Flags = ""
  > extends yup.Schema<TType, TContext, TDefault, TFlags> {
    emptyAsUndefined(): yup.NumberSchema<TType, TContext>;
    maxDecimals(
      max: number,
      message?: string
    ): yup.NumberSchema<TType, TContext>;
    maxDigits(max: number, message?: string): yup.NumberSchema<TType, TContext>;
    totalRaiseRange(
      min: number,
      max: number,
      message?: string
    ): NumberSchema<TType, TContext>;
  }
}

export default yup;
