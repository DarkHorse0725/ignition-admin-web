export const regexOnlyNumberAndDecimal = (numberOfDecimal: number) => {
  const regex = new RegExp(`^[0-9]*\\.{0,1}[0-9]{0,${numberOfDecimal}}$`);
  return regex;
};

export const regexOnlyPositiveNumber = /^(0|[0-9]\d*)$/;

export const regexValidateURLImage =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
