import { Pool } from "@/types";

export const updatePoolEndTime = (
  poolName: string,
  endTime: any,
  pools: Pool[]
): Pool[] => {
  return pools.map((pool) => {
    if (pool.name === poolName && poolName === "galaxy") {
      return {
        ...pool,
        galaxyEndTime: endTime,
      };
    } else {
      return {
        ...pool,
        crowdfundingEndTime: endTime,
      };
    }
  });
};
