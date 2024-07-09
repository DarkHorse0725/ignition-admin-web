import { formatCurrency } from "@/helpers";

export const CurrencyFormatter = ({ value }: { value: string | number }) => {
  if (typeof value === "number" || typeof value === "string") {
    return <>{formatCurrency(value)}</>;
  }

  return <>{value || ""}</>;
};
