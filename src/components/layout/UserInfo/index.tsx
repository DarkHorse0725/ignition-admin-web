import { SettingIcon } from "@/components/icons";
import ChangePasswordFullModal from "@/components/screens/login/ChangePasswordFullModal";
import { getRole } from "@/types";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface UserInfoProps {
  fullName: string;
  role: string;
}

const getName = (name: string) => {
  if (!name) return "U";
  const formatString = name.replace(/\s+/g, " ").trim(); // replace space
  if (formatString.split(" ").length < 2) return formatString.slice(0)[0];

  return formatString.slice(0)[0] + formatString.split(" ")[1].slice(0)[0];
};

const UserInfo = ({ fullName, role }: UserInfoProps) => {
  const avatarPlaceholder = getName(fullName);
  const router = useRouter();
  const theme = useTheme();
  const [openChangePwd, setOpenChangePwd] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    Cookies.remove("auth");
    router.push("/auth/login");
  };

  const handleChangePassword = () => {
    setOpenChangePwd(true);
    handleClose();
  };

  return (
    <Box
      sx={{
        background: theme.palette.grey[600],
        padding: "30px 15px 15px",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <Avatar
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          position: "absolute",
          top: "-20px",
          left: "15px",
        }}
      >
        {avatarPlaceholder.toUpperCase()}
      </Avatar>

      <Link href="/admin/profile">
        <Typography variant="h6" noWrap>
          {fullName}
        </Typography>
      </Link>

      <Typography color="grey.500" mt="5px">
        {role ? getRole(role) : ""}
      </Typography>
      <Box
        sx={{ display: "flex", gap: "5px", cursor: "pointer", mt: "10px" }}
        onClick={handleClick}
      >
        <SettingIcon stroke={theme.palette.warning.dark} />
        <Typography color="warning.dark">Setting</Typography>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {openChangePwd && (
        <ChangePasswordFullModal
          open={openChangePwd}
          onClose={() => setOpenChangePwd(false)}
        />
      )}
    </Box>
  );
};

export default UserInfo;
