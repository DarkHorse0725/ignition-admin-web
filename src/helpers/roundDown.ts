export function roundDown(number: number, decimals: number) {
  const numberFormat = number.toString().split(".");
  if (numberFormat[1]) {
    return parseFloat(
      numberFormat[0] + "." + numberFormat[1].slice(0, decimals)
    );
  }
  return parseInt(numberFormat[0]);
}
