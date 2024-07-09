import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { APIClient } from "@/core/api";
import {
  AppIcon,
  CalenderIcon,
  GridIcon,
  MapIcon,
  PartnerIcon,
  PeopleIcon,
  ProjectIcon,
  SetAdminIcon,
  ShieldIcon,
  BellIcon,
} from "../../icons";
import { useSelectorAuth, useSelectorNotification } from "@/store/hook";
import { ADMIN_ROLE } from "@/types";
import MenuItem from "../MenuItem";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUnreadCount } from "@/store/features/notificationSlice";

export interface MenuItemType {
  title: string;
  icon: Function;
  link: string;
  isSuperAdminOnly?: boolean;
  isNewNotification?: boolean;
}

const apiClient = APIClient.getInstance();

const ListItem = () => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const { role } = useSelectorAuth();
  const isSuperAdmin = role === ADMIN_ROLE.SUPER_ADMIN;
  const { unreadCount } = useSelectorNotification();

  useEffect(() => {
    const getNotificationCount = async () => {
      const unreadCount = await apiClient.notification.getNumberOfUnread();
      dispatch(updateUnreadCount(unreadCount));
    };
    getNotificationCount();
  }, [dispatch]);

  const localItems: MenuItemType[] = [
    {
      title: "Access Control List",
      icon: ShieldIcon,
      link: "/admin/users",
      isSuperAdminOnly: true,
    },
    {
      title: "Apps",
      icon: AppIcon,
      link: "/admin/apps",
    },
    {
      title: "Contract Admin",
      icon: SetAdminIcon,
      link: "/admin/contract-admin",
    },
    {
      title: "Countries",
      icon: MapIcon,
      link: "/admin/countries",
    },
    {
      title: "Cron Jobs",
      icon: CalenderIcon,
      link: "/admin/jobs",
    },
    {
      title: "Customers",
      icon: PeopleIcon,
      link: "/admin/customers",
    },
    {
      title: "Dashboard",
      icon: GridIcon,
      link: "/admin/dashboard",
    },
    {
      title: "Partners",
      icon: PartnerIcon,
      link: "/admin/partners",
    },
    {
      title: "Projects",
      icon: ProjectIcon,
      link: "/admin/projects",
    },
    {
      title: "Notification",
      icon: BellIcon,
      link: "/admin/notification",
      isNewNotification: unreadCount > 0,
    },
  ];

  const developmentItems: MenuItemType[] = [
    {
      title: "Access Control List",
      icon: ShieldIcon,
      link: "/admin/users",
      isSuperAdminOnly: true,
    },
    {
      title: "Apps",
      icon: AppIcon,
      link: "/admin/apps",
    },
    {
      title: "Contract Admin",
      icon: SetAdminIcon,
      link: "/admin/contract-admin",
    },
    {
      title: "Partners",
      icon: PartnerIcon,
      link: "/admin/partners",
    },
    {
      title: "Projects",
      icon: ProjectIcon,
      link: "/admin/projects",
    },
    {
      title: "Notification",
      icon: BellIcon,
      link: "/admin/notification",
      isNewNotification: unreadCount > 0,
    },
  ];

  const productionItems: MenuItemType[] = [
    {
      title: "Access Control List",
      icon: ShieldIcon,
      link: "/admin/users",
      isSuperAdminOnly: true,
    },
    {
      title: "Contract Admin",
      icon: SetAdminIcon,
      link: "/admin/contract-admin",
    },
    {
      title: "Partners",
      icon: PartnerIcon,
      link: "/admin/partners",
    },
    {
      title: "Projects",
      icon: ProjectIcon,
      link: "/admin/projects",
    },
    {
      title: "Notification",
      icon: BellIcon,
      link: "/admin/notification",
      isNewNotification: unreadCount > 0,
    },
  ];

  const generateItems = (): MenuItemType[] => {
    const environment = process.env.NEXT_PUBLIC_ENV;
    switch (environment) {
      case "local":
        return localItems;
      case "development":
        return developmentItems;
      default:
        return productionItems;
    }
  };

  const listItems = generateItems();

  return (
    <>
      {listItems.map((item) => {
        if (!isSuperAdmin && item.isSuperAdminOnly) return null;
        return (
          <Box key={item.title} sx={{ mb: "20px" }}>
            <MenuItem isActive={pathname.includes(item.link)} item={item} />
          </Box>
        );
      })}
    </>
  );
};

export default ListItem;
