import {
  getJsonApi,
  JSON_RPC_API,
} from "@/core/api/services/contract.service/contract.utils";
import { contracts } from "./setupContract";

export const getTokenInfo = async (
  tokenContractAddress: string,
  projectNetworkLabel: string,
) => {
  const jsonRpc = getJsonApi(projectNetworkLabel);
  if (!jsonRpc) return;
  const rs = await contracts(tokenContractAddress, jsonRpc);
  const decimals = await rs.decimals();
  const name = await rs.name();
  const symbol = await rs.symbol();
  return { decimals, name, symbol };
};
