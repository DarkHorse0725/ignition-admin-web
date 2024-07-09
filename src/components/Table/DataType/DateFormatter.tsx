import { formatDate } from "@/helpers";

export const DateFormatter = ({
  value,
}: {
  value: string | undefined | null;
}) => {
  return <>{value ? formatDate(value) : "--"}</>;
};
