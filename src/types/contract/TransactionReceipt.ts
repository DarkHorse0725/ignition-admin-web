type MetaData = { [key: string]: unknown };

export interface TransactionReceipt {
  hash: string;
  type: number;
  accessList?: any | null;
  // Only if a transaction has been mined
  blockNumber: number | null;
  blockHash: string | null;
  transactionIndex: number | null;
  confirmations: number;
  from: string;
  to: string;
  gasPrice: MetaData;
  gasLimit: MetaData;
  maxFeePerGas: MetaData;
  maxPriorityFeePerGas: MetaData;
  value: MetaData;
  nonce: number;
  data: string;
  r: string;
  s: string;
  v: number;
  creates: any | null;
  chainId: number;
  message?: string;
  wait: (agrs: any) => any;
}
