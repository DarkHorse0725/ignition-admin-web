import { mapValues, isNil } from "lodash";

type Data = { [key: string]: any };

const isObject = (item: unknown): boolean => {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
};

const isDate = (item: unknown): boolean => {
  return item instanceof Date;
};

interface Options {
  removeEmptyStrings: boolean;
}

const DEFAULT_OPTIONS: Options = {
  removeEmptyStrings: false,
};

// This is a function called cleanData that takes in two parameters: data and options.
// data is an object of type Data, and options is an object of type Options with a default value of DEFAULT_OPTIONS.
export const cleanData = (
  data: Data,
  options: Options = DEFAULT_OPTIONS
): Data =>
  mapValues(data, (value) => {
    // If the value is an object (excluding Date objects), the function recursively calls cleanData on the value.
    // If the value is null or undefined, it is replaced with undefined, otherwise the updated value is returned.
    if (isObject(value) && !isDate(value)) {
      const updatedValue = isNil(value) ? undefined : cleanData(value);
      return updatedValue;
    }
    // If the value is a string or a String object, and the removeEmptyStrings option is enabled,
    // the function trims the value and checks if it has zero length.
    // If it does, the value is replaced with undefined, otherwise the original value is returned.
    if (typeof value === "string" || value instanceof String) {
      if (options.removeEmptyStrings) {
        return value.trim().length ? value.trim() : undefined;
      }
      return value.trim();
    }
    // If the value is null or undefined, it is replaced with undefined, otherwise the original value is returned.
    return isNil(value) ? undefined : value;
  });
