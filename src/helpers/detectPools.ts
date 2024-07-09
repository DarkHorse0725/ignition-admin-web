import { Pool, PoolType } from "@/types";

// Don't apply for old project that has Moon pool
export const detectPools = (
  pools: Pool[]
): {
  galaxyPool: Pool;
  crowdfundingPool: Pool;
} => {
  const galaxyPool = pools.find((pool) => pool.name === PoolType.GALAXY);
  const crowdfundingPool = pools.find(
    (pool) => pool.name === PoolType.CROWDFUNDING
  );
  return {
    galaxyPool: galaxyPool!,
    crowdfundingPool: crowdfundingPool!,
  };
};
