import { isValid as isValidDate, parseISO, format } from "date-fns";

//format to IOS type "MM/dd/yyyy hh:mm a"
export const formatDate = (date: Date | string | undefined | null) => {
  if (!date) {
    return "";
  }

  const value: string = new Date(date).toISOString();

  if (isValidDate(parseISO(value))) {
    const formattedDate = format(new Date(value), "MM/dd/yyyy hh:mm a");
    return formattedDate;
  }
  return value;
};
