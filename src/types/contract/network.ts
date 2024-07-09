export enum AllowedNetwork {
  MAINNET = 1,
  ARBITRUM = 42161,
  ARBITRUM_SEPOLIA = 421614,
  AVALANCHE = 43114,
  AVALANCHE_FUJI = 43113,
  BASE = 8453,
  BASE_SEPOLIA = 84532,
  BLAST = 81457,
  BLAST_SEPOLIA = 168587773,
  BSC = 56,
  BSC_TESTNET = 97,
  GANACHE = 1337,
  MANTA = 169,
  MANTA_TESTNET = 3441005,
  OPTIMISM = 10,
  OPTIMISM_SEPOLIA = 11155420,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  SCROLL = 534352,
  SCROLL_SEPOLIA = 534351,
  SEPOLIA = 11155111,
  ZKSYNC_ERA = 324,
  ZKSYNC_ERA_SEPOLIA = 300,
}

export type NetworkType = {
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  chainId: string;
  blockExplorerUrls: string[];
};

type NetworkLabels = {
  [value in AllowedNetwork]: string;
};

export const NETWORK_LABELS: NetworkLabels = {
  [AllowedNetwork.ARBITRUM]: "ARBITRUM",
  [AllowedNetwork.ARBITRUM_SEPOLIA]: "ARBITRUM_SEPOLIA",
  [AllowedNetwork.AVALANCHE]: "AVALANCHE",
  [AllowedNetwork.AVALANCHE_FUJI]: "AVALANCHE_FUJI",
  [AllowedNetwork.BASE]: "BASE",
  [AllowedNetwork.BASE_SEPOLIA]: "BASE_SEPOLIA",
  [AllowedNetwork.BLAST]: "BLAST",
  [AllowedNetwork.BLAST_SEPOLIA]: "BLAST_SEPOLIA",
  [AllowedNetwork.BSC]: "BSC",
  [AllowedNetwork.BSC_TESTNET]: "BSC_TESTNET",
  [AllowedNetwork.GANACHE]: "GANACHE",
  [AllowedNetwork.MAINNET]: "ETH",
  [AllowedNetwork.MANTA]: "MANTA",
  [AllowedNetwork.MANTA_TESTNET]: "MANTA_TESTNET",
  [AllowedNetwork.OPTIMISM]: "OPTIMISM",
  [AllowedNetwork.OPTIMISM_SEPOLIA]: "OPTIMISM_SEPOLIA",
  [AllowedNetwork.POLYGON]: "POLYGON",
  [AllowedNetwork.POLYGON_MUMBAI]: "POLYGON_MUMBAI",
  [AllowedNetwork.SCROLL]: "SCROLL",
  [AllowedNetwork.SCROLL_SEPOLIA]: "SCROLL_SEPOLIA",
  [AllowedNetwork.SEPOLIA]: "SEPOLIA",
  [AllowedNetwork.ZKSYNC_ERA]: "ZKSYNC_ERA",
  [AllowedNetwork.ZKSYNC_ERA_SEPOLIA]: "ZKSYNC_ERA_SEPOLIA",
};

export const NETWORK_NAMES: NetworkLabels = {
  [AllowedNetwork.ARBITRUM]: "Arbitrum",
  [AllowedNetwork.ARBITRUM_SEPOLIA]: "Arbitrum Sepolia",
  [AllowedNetwork.AVALANCHE]: "Avalanche",
  [AllowedNetwork.AVALANCHE_FUJI]: "Avalanche Fuji",
  [AllowedNetwork.BASE]: "Base",
  [AllowedNetwork.BASE_SEPOLIA]: "Base Sepolia",
  [AllowedNetwork.BLAST]: "Blast",
  [AllowedNetwork.BLAST_SEPOLIA]: "Blast Sepolia",
  [AllowedNetwork.BSC]: "Binance Smart Chain",
  [AllowedNetwork.BSC_TESTNET]: "Binance Smart Chain Testnet",
  [AllowedNetwork.GANACHE]: "Ganache",
  [AllowedNetwork.MANTA]: "Manta",
  [AllowedNetwork.MANTA_TESTNET]: "Manta Testnet",
  [AllowedNetwork.OPTIMISM]: "Optimism",
  [AllowedNetwork.OPTIMISM_SEPOLIA]: "Optimism Sepolia",
  [AllowedNetwork.MAINNET]: "Ethereum",
  [AllowedNetwork.POLYGON]: "Polygon POS",
  [AllowedNetwork.POLYGON_MUMBAI]: "Polygon Mumbai",
  [AllowedNetwork.SCROLL]: "Scroll",
  [AllowedNetwork.SCROLL_SEPOLIA]: "Scroll Sepolia",
  [AllowedNetwork.SEPOLIA]: "Sepolia",
  [AllowedNetwork.ZKSYNC_ERA]: "zkSync Era",
  [AllowedNetwork.ZKSYNC_ERA_SEPOLIA]: "zkSync Era Sepolia",
};

export const getDefaultNetworks = (): number[] => {
  const environment = process.env.NEXT_PUBLIC_ENV || "";
  switch (environment) {
    case "production":
      return [
        AllowedNetwork.ARBITRUM,
        AllowedNetwork.AVALANCHE,
        AllowedNetwork.BASE,
        AllowedNetwork.BLAST,
        AllowedNetwork.BSC,
        AllowedNetwork.MAINNET,
        AllowedNetwork.MANTA,
        AllowedNetwork.OPTIMISM,
        AllowedNetwork.POLYGON,
        AllowedNetwork.SCROLL,
        AllowedNetwork.ZKSYNC_ERA,
      ];
    case "development":
      return [
        AllowedNetwork.ARBITRUM_SEPOLIA,
        AllowedNetwork.AVALANCHE_FUJI,
        AllowedNetwork.BASE_SEPOLIA,
        AllowedNetwork.BLAST_SEPOLIA,
        AllowedNetwork.BSC_TESTNET,
        AllowedNetwork.MANTA_TESTNET,
        AllowedNetwork.OPTIMISM_SEPOLIA,
        AllowedNetwork.POLYGON_MUMBAI,
        AllowedNetwork.SCROLL_SEPOLIA,
        AllowedNetwork.SEPOLIA,
        AllowedNetwork.ZKSYNC_ERA_SEPOLIA,
      ];
    default:
      return [AllowedNetwork.GANACHE];
  }
};

export const SUPPORTED_NETWORKS = getDefaultNetworks();

export const getDefaultNetworkSelections = () => {
  return SUPPORTED_NETWORKS.map((item: number) => {
    const label: string = NETWORK_LABELS[item as AllowedNetwork];
    return {
      value: item,
      label,
    };
  });
};

export const SUPPORTED_NETWORKS_SELECTIONS = getDefaultNetworkSelections();
