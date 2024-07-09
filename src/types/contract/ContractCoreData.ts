import { ethers } from "ethers";

export interface ContractCoreData {
  poolFactoryContract: ethers.Contract;
  PAIDTokenContract: ethers.Contract;
  contractAddresses: {
    poolFactoryAddress: string;
    PAIDTokenAddress: string;
  };
  provider: ethers.BrowserProvider;
}
