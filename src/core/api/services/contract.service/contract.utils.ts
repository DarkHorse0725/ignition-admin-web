import {
  AllowedNetwork,
  getDefaultNetworks,
  NetworkType,
  ProjectChain,
  ProjectChainTestNet,
  ProjectChainLocal,
} from "@/types";

import { ethers } from "ethers";

const getDefaultChains = (): { [key: number]: NetworkType } => {
  const environment = process.env.NEXT_PUBLIC_ENV || "";
  if (environment === "production")
    return {
      [AllowedNetwork.MAINNET]: {
        chainId: ethers.toQuantity(AllowedNetwork.MAINNET),
        chainName: "Ethereum Mainnet",
        rpcUrls: [
          "https://1rpc.io/eth",
          "https://api.securerpc.com/v1",
          "https://beta-be.gashawk.io:3001/proxy/rpc",
        ],
        nativeCurrency: {
          name: "Ethereum Chain Native Token",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["	https://etherscan.io"],
      },
      [AllowedNetwork.BSC]: {
        chainId: ethers.toQuantity(AllowedNetwork.BSC),
        chainName: "Binance Smart Chain Mainnet",
        rpcUrls: [
          "https://bsc-dataseed1.binance.org",
          "https://bsc-dataseed2.binance.org",
          "https://bsc-dataseed3.binance.org",
        ],
        nativeCurrency: {
          name: "Binance Chain Native Token",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com"],
      },
      [AllowedNetwork.POLYGON]: {
        chainId: ethers.toQuantity(AllowedNetwork.POLYGON),
        chainName: "Polygon POS",
        rpcUrls: ["https://polygon-rpc.com/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com"],
      },
    };

  return {
    [AllowedNetwork.SEPOLIA]: {
      chainId: ethers.toQuantity(AllowedNetwork.SEPOLIA),
      chainName: "Ethereum Testnet Sepolia",
      rpcUrls: [
        "https://goerli.infura.io/v3",
        "wss://goerli.infura.io/v3",
        "https://rpc.goerli.mudit.blog/",
      ],
      nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },

      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    },
    [AllowedNetwork.BSC_TESTNET]: {
      chainId: ethers.toQuantity(AllowedNetwork.BSC_TESTNET),
      chainName: "Smart Chain - Testnet",
      nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "tBNB",
        decimals: 18,
      },
      rpcUrls: [
        "https://data-seed-prebsc-1-s1.binance.org:8545",
        "https://data-seed-prebsc-2-s1.binance.org:8545",
        "https://data-seed-prebsc-1-s2.binance.org:8545",
        "https://data-seed-prebsc-2-s2.binance.org:8545",
        "https://data-seed-prebsc-1-s3.binance.org:8545",
        "https://data-seed-prebsc-2-s3.binance.org:8545",
      ],
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
  };
};

export const METAMASK_ERRORS: {
  [key: string]: { standard: string; message: string };
} = {
  "4001": {
    standard: "EIP-1193",
    message: "You have rejected the transaction.",
  },
  "4100": {
    standard: "EIP-1193",
    message:
      "The requested account and/or method has not been authorized by the user.",
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider.",
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains.",
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain.",
  },
  ACTION_REJECTED: {
    standard: "EIP-1193",
    message: "You have rejected the transaction.",
  },
  TRANSACTION_FAILED: {
    standard: "EIP-1193",
    message: "Transaction failed",
  },
};

export const CONTRACT_ERRORS: { [key: string]: string } = {
  "1f2a2005": "ZeroAmount()",
  d92e233d: "ZeroAddress()",
  "386d034a": "AlreadyAdmin()",
  "0912651e": "ZeroOfferedRate()",
  e901e0f5: "AlreadyNotAdmin()",
  f8967ebd: "NotValidGalaxyPoolProportion()",
  "87dbd576": "NotValidEarlyAccessProportion()",
  "7bfa4b9f": "NotAdmin()",
  e282c0ba: "NotValidSignature()",
  "0a919d33": "NotYetTimeToRedeemTGE()",
  "002ff3b2": "TimeOutToSetPoolStatus()",
  "370df5d4": "RedeemExceedMaxTGEAmount()",
  "2e4f414f": "NotInWhaleList(address)",
  "1b8b49f9": "NotAllowedToRedeemTGEIDOAmount()",
  "566f8006": "ExceedMaxPurchaseAmountForUser()",
  b5d02297: "NotEnoughConditionToWithdrawIDOToken()",
  acc436f6: "NotEnoughConditionToWithdrawPurchaseToken()",
  "74b927f2": "AlreadySetRedeemableTGE(bool)",
  b17009d3: "ExceedTotalRaiseAmount(address,uint256)",
  "1087b521": "ExceedMaxPurchaseAmountForKYCUser(address,uint256)",
  "53adc859": "ExceedMaxPurchaseAmountForGalaxyPool(address,uint256)",
  "84e66cd1": "ExceedMaxPurchaseAmountForNotKYCUser(address,uint256)",
  "30b052c3": "ExceedMaxPurchaseAmountForEarlyAccess(address,uint256)",
  "27f700a8": "NotEnoughAllowance(address,address,uint256,uint256)",
  "7b30ef5a": "NotUpdateValidTime(uint256,uint256,uint256,uint256)",
  "6e068e0d": "NotUpdateValidTime(uint64,uint64,uint64,uint64)",
  c9b550a6:
    "TimeOutToBuyToken(uint256,uint256,uint256,uint256,uint256,address)",
  "06a36aee": "getUserRoles(address)",
};

export const CONTRACT_ERROR_CODES: string[] = Object.keys(CONTRACT_ERRORS);
// config for switch network
export const SUPPORTED_CHAINS = getDefaultChains();
export const SUPPORTED_NETWORKS = getDefaultNetworks();

export const JSON_RPC_API = [
  {
    name: ProjectChain.ARBITRUM,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_ARBITRUM,
  },
  {
    name: ProjectChain.AVALANCHE,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_AVALANCHE,
  },
  {
    name: ProjectChain.BASE,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_BASE,
  },
  {
    name: ProjectChain.BLAST,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_BLAST,
  },
  {
    name: ProjectChain.BSC,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_BSC,
  },
  {
    name: ProjectChain.ETH,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_ETH,
  },
  {
    name: ProjectChain.MANTA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_POLYGON,
  },
  {
    name: ProjectChain.OPTIMISM,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_OPTIMISM,
  },
  {
    name: ProjectChain.POLYGON,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_POLYGON,
  },
  {
    name: ProjectChain.SCROLL,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_SCROLL,
  },
  {
    name: ProjectChain.ZKSYNC_ERA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_ZKSYNC_ERA,
  },
  //  Testnets
  {
    name: ProjectChainTestNet.ARBITRUM_SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_ARBITRUM_SEPOLIA,
  },
  {
    name: ProjectChainTestNet.AVALANCHE_FUJI,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_AVALANCHE_FUJI,
  },
  {
    name: ProjectChainTestNet.BASE_SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_BASE_SEPOLIA,
  },
  {
    name: ProjectChainTestNet.BLAST_SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_BLAST_SEPOLIA,
  },
  {
    name: ProjectChainTestNet.BSC_TESTNET,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_BSC_TESTNET,
  },
  {
    name: ProjectChainTestNet.MANTA_TESTNET,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_MANTA_TESTNET,
  },
  {
    name: ProjectChainTestNet.OPTIMISM_SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_OPTIMISM_SEPOLIA,
  },
  {
    name: ProjectChainTestNet.POLYGON_MUMBAI,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_POLYGON_MUMBAI,
  },
  {
    name: ProjectChainTestNet.SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_SEPOLIA,
  },
  {
    name: ProjectChainTestNet.SCROLL_SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_SCROLL_SEPOLIA,
  },
  {
    name: ProjectChainTestNet.ZKSYNC_ERA_SEPOLIA,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_ZKSYNC_ERA_SEPOLIA,
  },
  //  Local
  {
    name: ProjectChainLocal.GANACHE,
    api: process.env.NEXT_PUBLIC_CHAIN_ADDRESS_GANACHE,
  },
];

export const getJsonApi = (network: string): string | undefined => {
  const item = JSON_RPC_API.find(
    (e) => e.name.toLowerCase() === network.toLowerCase(),
  );
  return item?.api;
};
