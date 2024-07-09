import { PUBLIC_TOKEN_CONTRACT_ABI } from "@/abi";
import { Contract, ethers } from "ethers";

export const contracts = async (
    tokenAddress: string,
    addressRPC: string | undefined
): Promise<any> => {
    const provider = new ethers.JsonRpcProvider(addressRPC);
    const ignitionContract = new Contract(
        tokenAddress,
        PUBLIC_TOKEN_CONTRACT_ABI,
        provider
    );
    return ignitionContract;
};