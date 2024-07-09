import { APIClient } from "@/core/api";
import { useSelectorProjectDetail } from "@/store/hook";
import { ADMIN_EXIST_ACTIVE } from "@/types";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";

export const useCheckAdminContract = () => {
  const client = APIClient.getInstance();
  const [admin, setAdmin] = useState<boolean>(false);
  const { current: projectDetails } = useSelectorProjectDetail();
  const { network } = projectDetails;
  const { account } = useMetaMask();

  useEffect(() => {
    const fetch = async () => {
      if (account && network) {
        const { data } = await client.setAdmins.isExisted(ADMIN_EXIST_ACTIVE, {
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
