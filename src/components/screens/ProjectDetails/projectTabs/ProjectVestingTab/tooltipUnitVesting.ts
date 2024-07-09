export const toolTipUnitVestingMessages = (unit: string): string => {
  let message = "";
  switch (unit) {
    case "cliffLength":
      message =
        "A cliff is a period when no tokens are released. You can set cliff length to 0 if needed. In this case, TGE will also paid together with the first release of below frequency";
      break;
    case "frequency":
      message =
        "Vesting Frequency is the period between each token release after the cliff end. This field only allows integer input.";
      break;
    case "numberOfRelease":
      message =
        "Number of Release multiple with Vesting Frequency will generate the Vesting period (cliff not included). This field only allows integer input.";
      break;
    default:
      break;
  }
  return message;
};
