import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { useMetaMask } from "metamask-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../atoms/Card";
import UserInfo from "./UserInfo";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { getProfile } from "@/store/features/authSlice";
import Cookies from "js-cookie";
import { ADMIN_ROLE } from "@/types";
import { useSelectorAuth } from "@/store/hook";
import ListItem from "./ListItem";

const Menu = () => {
  const theme = useTheme();
  const { status, connect, account } = useMetaMask();
  const [buttonLabel, setButtonLabel] = useState("Connect Wallet");
  const { fullName, role } = useSelectorAuth();

  useEffect(() => {
    switch (status) {
      case "unavailable":
        setButtonLabel("Install Metamask");
        break;
      case "notConnected":
        setButtonLabel("Connect Wallet");
        break;
      case "connecting":
        setButtonLabel("Connecting...");
        break;
      case "connected":
        setButtonLabel(`${account}`);
        break;
    }
  }, [account, status]);

  const handleConnect = () => {
    if (status === "unavailable") window.open("https://metamask.io/");
    if (status === "notConnected") connect();
  };

  const walletEllipsis = useMemo(
    () =>
      `${account?.substring(0, 5)}...${account?.substring(
        account?.length - 4,
        account?.length,
      )}`,
    [account],
  );

  return (
    <Card
      sx={{
        minWidth: "196px",
        maxWidth: "196px",
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <Image
        width={130}
        height={38}
        src="/images/logo.png"
        alt="master ventures logo"
        priority
      />
      <Box
        sx={{
          minHeight: "100px",
          overflowY: "auto",
          overflowX: "hidden",
          mt: "53px",
        }}
      >
        <ListItem />
      </Box>
      <Divider sx={{ borderColor: theme.palette.border.light, mb: "30px" }} />
      <Box sx={{ mb: "64px" }}>
        <Typography fontSize="14px" color="grey.500" sx={{ mb: "20px" }}>
          Wallet
        </Typography>

        {status !== "connected" ? (
          <Button color="primary" onClick={handleConnect} fullWidth>
            {buttonLabel}
          </Button>
        ) : (
          <Box sx={{ width: 1, display: "flex", alignItems: "center" }}>
            <Image
              width={24}
              height={24}
              src={`/icons/ethereum.svg`}
              alt="ethereum"
            />
            <Typography>{walletEllipsis}</Typography>
          </Box>
        )}
      </Box>

      <UserInfo fullName={fullName} role={role || ADMIN_ROLE.VIEWER} />
    </Card>
  );
};

const Layout = ({ children }: any) => {
  const theme = useTheme();
  const route = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    (async () => {
      const data = await dispatch(getProfile());
      if (data.type === "auth/getProfile/rejected") {
        route.push("/auth/login");
        Cookies.remove("auth");
      }
    })();
  });

  return (
    <Box
      sx={{
        display: "flex",
        background: theme.palette.background.paper,
        padding: "20px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <Menu />

      <Box
        sx={{
          height: "100%",
          "& div": { boxSizing: "border-box" },
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
