// 999999999 => 999,999,999
export const formatNumberToCurrencyString = (currencyNumber: number) => {
  return currencyNumber.toLocaleString("en-US");
};
