import { Card } from "@/components/atoms/Card";
import {
  InformationIcon,
  PoolTabIcon,
  SnapshotTabIcon,
  TransactionTabIcon,
  WhiteListTabIcon,
  WithdrawTabIcon,
} from "@/components/icons";
import Layout from "@/components/layout";
import { CreateProject } from "@/components/screens/ProjectDetails";
import { ProjectHeader } from "@/components/screens/ProjectDetails/ProjectHeader";
import Tabs from "@/components/atoms/Tabs";
import { AppDispatch } from "@/store";
import { getProjectDetails } from "@/store/features/projectDetailsSlice";
import { BrandEnums, ProjectStatus } from "@/types";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ProjectInfoTab,
  ProjectLotteriesTab,
  ProjectPoolsTab,
  ProjectSnapshotTab,
  ProjectTransactionsTab,
  ProjectVestingInfoTab,
  ProjectWhitelistsTab,
  ProjectWithdrawTab,
} from "@/components/screens/ProjectDetails/projectTabs";
import { CreateProjectHeader } from "@/components/screens/ProjectDetails/components";
import { useSelectorProjectDetail } from "@/store/hook";
import { SUCCESS_EVENTS, useSocket } from "@/providers/SocketContext";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";

const ProjectDetails = () => {
  const { query } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { current: projectDetails, isNewVersion } = useSelectorProjectDetail();
  const { brand, status, _id } = projectDetails;
  const projectId = query.id as string;
  const { socket } = useSocket();
  const { account } = useMetaMask();
  useEffect(() => {
    (async () => {
      if (!projectId || projectId === "id") return;
      setLoading(true);
      await dispatch(getProjectDetails(projectId));
      setLoading(false);
    })();
  }, [dispatch, projectId, query.id]);

  useEffect(() => {
    if (!!socket && _id) {
      socket.emit(SUCCESS_EVENTS.JOIN_ROOM, {
        room: `Project_${_id}`,
      });
    }

    if (!!socket && account) {
      socket.emit(SUCCESS_EVENTS.JOIN_ROOM, {
        room: `User_${ethers.getAddress(account)}`,
      });
    }
  }, [socket, _id, account]);

  const items = useMemo(() => {
    const enableWithdraw = [
      ProjectStatus.FINISHED,
      ProjectStatus.CANCELLED,
    ].includes(status);

    const itemsList = [
      {
        title: "Information",
        children: <ProjectInfoTab />,
        Icon: InformationIcon,
      },
      {
        title: "Pools",
        children: <ProjectPoolsTab />,
        Icon: PoolTabIcon,
      },
      {
        title: "Vesting",
        children: <ProjectVestingInfoTab />,
        Icon: PoolTabIcon,
        isHidden: !isNewVersion,
      },
      {
        title: "Snapshot",
        children: <ProjectSnapshotTab />,
        Icon: SnapshotTabIcon,
        isHidden: !isNewVersion,
      },
      {
        title: "Withdraw Funds",
        disabled: !enableWithdraw,
        children: <ProjectWithdrawTab />,
        tooltip: "This tab is accessible after both pools are closed",
        Icon: WithdrawTabIcon,
        isHidden: !isNewVersion,
      },
      {
        title: "Transactions",
        children: <ProjectTransactionsTab />,
        Icon: TransactionTabIcon,
      },
      {
        title: "Whitelists",
        children: <ProjectWhitelistsTab />,
        Icon: WhiteListTabIcon,
        isHidden: brand !== BrandEnums.APOLLOX,
      },
      {
        title: "Lotteries",
        children: <ProjectLotteriesTab />,
        Icon: InformationIcon,
        isHidden: isNewVersion,
      },
    ];

    return itemsList;
  }, [brand, isNewVersion, status]);

  if (projectId === "id")
    return (
      <Box
        ml="15px"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Card>
          <CreateProjectHeader />
        </Card>
        <Box sx={{ overflow: "scroll", marginTop: "10px" }}>
          <CreateProject />
        </Box>
      </Box>
    );

  return (
    <>
      <Box
        ml="15px"
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <Typography>Loading ...</Typography>
        ) : (
          <>
            <Card>
              <ProjectHeader />
            </Card>
            <Card sx={{ mt: "15px", flexGrow: 1, overflow: "auto" }}>
              <Tabs items={items} />
            </Card>
          </>
        )}
      </Box>
    </>
  );
};

ProjectDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ProjectDetails;
