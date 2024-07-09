import { APIClient } from "@/core/api";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const useCheckAdmin = (account: string | null, network: number) => {
  const client = APIClient.getInstance();
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      if (account && network) {
        const { data } = await client.setAdmins.isExisted("active", {
          adminAddress: ethers.getAddress(account),
          network,
        });
        setAdmin(data);
      }
    };

    fetch();
  }, [account, network]);

  return admin;
};
