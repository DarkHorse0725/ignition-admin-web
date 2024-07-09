import { AllowedCurrency, CurrencyForTestMode } from "../project";

const getDefaultCurrency = (): string[] => {
  const environment = process.env.NEXT_PUBLIC_ENV || "";
  if (environment === "production") {
    return Object.values(AllowedCurrency);
  }
  return Object.values(CurrencyForTestMode);
};

export const AllAllowedCurrencies = getDefaultCurrency();
