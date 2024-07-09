export const transformPoolName = (poolName: string): string => {
  let poolTransformed = "";
  switch (poolName) {
    case "crowdfunding":
      poolTransformed = "OpenPool";
      break;
    case "galaxy":
      poolTransformed = "EarlyPool";
      break;
    default:
      poolTransformed = poolName;
  }
  return poolTransformed;
};
