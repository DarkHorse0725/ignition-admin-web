import { PAID_TOKEN_ABI, POOL_FACTORY_ABI, POOL_ABI, VESTING_ABI } from "@/abi";
import {
  AllowedNetwork,
  ContractCoreData,
  TransactionReceipt,
  SUPPORTED_NETWORKS,
  UpdateTimePoolDto,
  EthersRPCError,
  UpdateTGEDateVesting,
} from "@/types";
import { Contract, ethers } from "ethers";
import { BaseService } from "../base";
import {
  SUPPORTED_CHAINS,
  getJsonApi,
  METAMASK_ERRORS,
} from "./contract.utils";
import BigNumber from "bignumber.js";

export class ContractService extends BaseService {
  protected readonly basePath: string = "/contract";

  contractAddresses(chainId: number): {
    PAIDTokenAddress: string;
    poolFactoryAddress: string;
  } {
    const environment = process.env.NEXT_PUBLIC_ENV || "";

    if (!SUPPORTED_NETWORKS.includes(chainId)) {
      throw new Error(
        `${chainId} is not supported with environment = ${environment}`,
      );
    }

    let PAIDTokenAddress: string | undefined;
    let poolFactoryAddress: string | undefined;

    // TODO: Gary and I checked and the PAIDTokenAddress is not being used.
    // We should remove and test...

    switch (chainId) {
      case AllowedNetwork.ARBITRUM:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_BSC;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_ARBITRUM;
        break;
      case AllowedNetwork.BASE:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_BSC;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_BASE;
        break;
      case AllowedNetwork.BSC:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_BSC;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_BSC;
        break;
      case AllowedNetwork.MAINNET:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_ETH;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_ETH;
        break;
      case AllowedNetwork.SEPOLIA:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_SEPOLIA;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_SEPOLIA;
        break;
      case AllowedNetwork.BSC_TESTNET:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_BSC_TESTNET;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_BSC_TESTNET;
        break;
      case AllowedNetwork.POLYGON:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_BSC;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_POLYGON;
        break;
      default:
        PAIDTokenAddress = process.env.NEXT_PUBLIC_PAID_CONTRACT_GANACHE;
        poolFactoryAddress = process.env.NEXT_PUBLIC_POOL_FACTORY_GANACHE;
        break;
    }

    if (!(PAIDTokenAddress && poolFactoryAddress)) {
      const errMessage = `env variables for ${chainId} not set`;
      throw new Error(errMessage);
    }

    return {
      PAIDTokenAddress,
      poolFactoryAddress,
    };
  }

  async contracts(network: number): Promise<ContractCoreData> {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      throw {
        status: 500,
        message: "Metamask not detected",
      };
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contractAddresses = this.contractAddresses(network);

    const poolFactoryAddress = contractAddresses.poolFactoryAddress;
    const PAIDTokenAddress = contractAddresses.PAIDTokenAddress;

    // Throw error if contract addresses are not set in env variables
    if (!(poolFactoryAddress || PAIDTokenAddress)) {
      throw {
        status: 500,
        message: "Contract addresses not set",
      };
    }

    const poolFactoryContract = new ethers.Contract(
      poolFactoryAddress,
      POOL_FACTORY_ABI,
      signer,
    );

    const PAIDTokenContract = new ethers.Contract(
      PAIDTokenAddress,
      PAID_TOKEN_ABI,
      provider,
    );

    return {
      poolFactoryContract,
      PAIDTokenContract,
      contractAddresses,
      provider,
    };
  }

  async poolContracts(poolAddress: string): Promise<Contract> {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      throw {
        status: 500,
        message: "Metamask not detected",
      };
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);

    return poolContract;
  }

  handleContractError = (error: unknown): any => {
    const rpcError = error as EthersRPCError;
    let code = `${rpcError.code}`;
    let message = rpcError?.data?.message || rpcError.message;
    const isDefinedCode = METAMASK_ERRORS.hasOwnProperty(code);
    if (isDefinedCode) throw error;
    throw {
      code: "TRANSACTION_FAILED",
      message: message,
    };
  };

  async switchToSameEthereumNetwork(chainId: number): Promise<void> {
    const { ethereum }: any = window;
    const provider = new ethers.BrowserProvider(ethereum, "any");
    const currentNetwork = await provider.getNetwork();

    try {
      if (currentNetwork.chainId !== BigInt(chainId)) {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
        });
      }
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (
        switchError.code === 4902 &&
        SUPPORTED_CHAINS.hasOwnProperty(chainId)
      ) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                ...SUPPORTED_CHAINS[chainId],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      }
      throw switchError;
    }
  }

  async addAdminContract(
    address: string,
    chainId: number,
  ): Promise<TransactionReceipt> {
    try {
      const bytes = ethers.solidityPackedKeccak256(["string"], ["OWNER_ROLE"]);
      const contracts = await this.contracts(chainId);
      await this.switchToSameEthereumNetwork(chainId);
      const trxReceipt = await contracts.poolFactoryContract.grantRole(
        bytes,
        address,
      );
      return trxReceipt;
    } catch (error) {
      console.log(error, "em LOIOIOIOIOIIOI");
      return this.handleContractError(error);
    }
  }

  async deleteAdminContract(
    address: string,
    chainId: number,
  ): Promise<TransactionReceipt> {
    try {
      const bytes = ethers.solidityPackedKeccak256(["string"], ["OWNER_ROLE"]);
      const contracts = await this.contracts(chainId);
      await this.switchToSameEthereumNetwork(chainId);
      const trxReceipt = await contracts.poolFactoryContract.revokeRole(
        bytes,
        address,
      );
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async toggleClaimable(
    address: string,
    network: number,
    status: boolean,
  ): Promise<TransactionReceipt> {
    try {
      const contract = await this.poolContracts(address);
      await this.switchToSameEthereumNetwork(network);
      const trxReceipt = await contract.setClaimableStatus(status);
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async cancelPool(
    address: string,
    network: number,
    typeClosePool: "cancel" | "delete",
  ): Promise<TransactionReceipt> {
    try {
      const contract = await this.poolContracts(address);
      await this.switchToSameEthereumNetwork(network);
      const trxReceipt = await contract.cancelPool(typeClosePool === "delete");
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async updateTimeOfPool(
    poolAddress: string,
    data: UpdateTimePoolDto,
  ): Promise<TransactionReceipt> {
    try {
      const poolContract = await this.poolContracts(poolAddress);

      await this.switchToSameEthereumNetwork(data.projectNetwork);
      const trxReceipt = await poolContract.updateTime(
        data.galaxyEndTime.getTime() / 1000,
        data.crowdfundingEndTime.getTime() / 1000,
      );
      await trxReceipt;
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async updateTGEDate(
    poolAddress: string,
    data: UpdateTGEDateVesting,
  ): Promise<any> {
    const { TGEDate } = data;

    try {
      const contracts = await this.poolContracts(poolAddress);
      await this.switchToSameEthereumNetwork(data.projectNetwork);
      const trxReceipt = await contracts.updateTGEDate(
        TGEDate.getTime() / 1000,
      );
      await trxReceipt;
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async getPurchasedAmount(
    poolAddress: string,
    projectChain: string,
  ): Promise<BigNumber> {
    const jsonRpc = getJsonApi(projectChain);
    const provider = new ethers.JsonRpcProvider(jsonRpc);
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    try {
      const trxReceipt = await poolContract.purchasedAmount();
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async getParticipationFeeAmount(
    poolAddress: string,
    projectChain: string,
  ): Promise<BigNumber> {
    const jsonRpc = getJsonApi(projectChain);
    const provider = new ethers.JsonRpcProvider(jsonRpc);
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    try {
      const trxReceipt = await poolContract.participationFeeAmount();
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async getParticipationFeeClaimedStatus(
    poolAddress: string,
    projectChain: string,
  ): Promise<boolean> {
    const jsonRpc = getJsonApi(projectChain);
    const provider = new ethers.JsonRpcProvider(jsonRpc);
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    try {
      const trxReceipt = await poolContract.participationFeeClaimedStatus();
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async getTokenFeeClaimedStatus(
    poolAddress: string,
    projectChain: string,
  ): Promise<boolean> {
    const jsonRpc = getJsonApi(projectChain);
    const provider = new ethers.JsonRpcProvider(jsonRpc);
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    try {
      const trxReceipt = await poolContract.tokenFeeClaimedStatus();
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async getPurchasedAmountInGalaxyPool(
    poolAddress: string,
    projectChain: string,
  ): Promise<BigNumber> {
    const jsonRpc = getJsonApi(projectChain);
    const provider = new ethers.JsonRpcProvider(jsonRpc);
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    try {
      const trxReceipt = await poolContract.purchasedAmountInGalaxyPool();
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async claimTokenFee(
    poolAddress: string,
    network: number,
    addressWallet: string,
  ): Promise<TransactionReceipt> {
    const contract = await this.poolContracts(poolAddress);
    console.log(contract);

    // check if same network
    await this.switchToSameEthereumNetwork(network);
    try {
      const trxReceipt = await contract.claimTokenFee(addressWallet);
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async claimParticipationFee(
    poolAddress: string,
    projectNetwork: number,
    addressWallet: string,
  ): Promise<TransactionReceipt> {
    const contract = await this.poolContracts(poolAddress);

    // check if same network
    await this.switchToSameEthereumNetwork(projectNetwork);
    try {
      const trxReceipt = await contract.claimParticipationFee(addressWallet);
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }

  async setRoot(
    poolAddress: string,
    chainId: number,
    root: string,
  ): Promise<TransactionReceipt> {
    const contract = await this.poolContracts(poolAddress);

    try {
      // check if same network
      await this.switchToSameEthereumNetwork(chainId);
      const trxReceipt = await contract.setRoot(root);
      return trxReceipt;
    } catch (error) {
      return this.handleContractError(error);
    }
  }
}
