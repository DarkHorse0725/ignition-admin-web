import { useState, useReducer, useEffect, useMemo } from "react";
import { APIClient } from "@/core/api";
import { useRouter } from "next/router";
import { Typography, useTheme } from "@mui/material";
import { EditIcon } from "@/components/icons";
import { checkMatchChainId } from "../../ProjectDetails/projectFunction";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useAlertContext } from "@/providers/AlertContext";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
import { ProjectStatus } from "@/types";
import { convertStringHTML } from "@/helpers";

export const useProjectsSpreadSheet = () => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const { role } = useSelectorAuth();
  const { projectChain, network, projectType } = projectDetails;
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_INFO,
  );
  const { errorAlertHandler } = useAlertContext();

  const tableColumnExtensions = [
    { columnName: "_id", width: 275 },
    { columnName: "brand", width: 100 },
    { columnName: "name", width: 180 },
    { columnName: "status", width: 120 },
    { columnName: "currency", width: 100 },
    { columnName: "totalRaise", width: 150 },
    { columnName: "transactionState", width: 180 },
    { columnName: "poolOpenDate", width: 200 },
    { columnName: "announcementDate", width: 200 },
    { columnName: "description", width: 200 },
    { columnName: "address", width: 475 },
    { columnName: "ended", width: 110 },
    { columnName: "canJoin", width: 110 },
    { columnName: "featured", width: 110 },
    { columnName: "internal", width: 110 },
    { columnName: "hideTGE", width: 110 },
    { columnName: "nftSale", width: 110 },
    { columnName: "action", width: 70 },
    { columnName: "slug", width: 110 },
  ];

  const columns = useMemo(() => {
    const columnTable = [
      {
        name: "_id",
        title: "ID",
        getCellValue: (row: any) => (
          <Typography
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              cursor: "pointer",
            }}
            onClick={() => router.push(`projects/${row._id}`)}
          >
            {row._id}
          </Typography>
        ),
      },
      {
        name: "brand",
        title: "Brand",
        getCellValue: (row: any) => row.brand.toUpperCase(),
      },
      {
        name: "name",
        title: "Name",
        getCellValue: (row: any) => row.name,
      },
      {
        name: "status",
        title: "Status",
        getCellValue: (row: any) =>
          row.status === ProjectStatus.CANCELLED ||
          row.status === ProjectStatus.EMERGENCY_CANCELLED
            ? "CANCELED"
            : row.status.toUpperCase(),
      },
      {
        name: "currency",
        title: "Currency",
        getCellValue: (row: any) => row.currency.toUpperCase(),
      },
      {
        name: "totalRaise",
        title: "Total Raise",
        getCellValue: (row: any) => row.totalRaise,
      },
      {
        name: "poolOpenDate",
        title: "EarlyPool Open Date",
        getCellValue: (row: any) => {
          return row.pools?.length && row.pools[1]?.label === "CROWDFUNDING"
            ? row.pools[0]?.galaxyOpenTime
            : row.poolOpenDate;
        },
      },
      {
        name: "announcementDate",
        title: "Announcement Date",
        getCellValue: (row: any) => row.announcementDate,
      },
      {
        name: "slug",
        title: "Slug",
        getCellValue: (row: any) => row.slug,
      },
      {
        name: "featured",
        title: "Featured",
        getCellValue: (row: any) => (row.featured ? "YES" : "NO"),
      },
      {
        name: "internal",
        title: "Internal",
        getCellValue: (row: any) => (row.internal ? "YES" : "NO"),
      },
      {
        name: "hideTGE",
        title: "Hide TGE",
        getCellValue: (row: any) => (row.hideTGE ? "YES" : "NO"),
      },
      {
        name: "nftSale",
        title: "NFT Sale",
        getCellValue: (row: any) => (row.nftSale ? "YES" : "NO"),
      },
      {
        name: "address",
        title: "Token Address",
        getCellValue: (row: any) => row.token?.contractAddress || "--",
      },
    ];
    if (!permissionOfResource.includes(PERMISSION.WRITE)) return columnTable;

    columnTable.push({
      name: "action",
      title: "Action",
      getCellValue: (row: any) => (
        <Typography
          sx={{
            cursor: "pointer",
          }}
          onClick={() => router.push(`projects/${row._id}`)}
        >
          <EditIcon fill={theme.palette.primary.main} />
        </Typography>
      ),
    });
    return columnTable;
  }, [permissionOfResource]);

  const loadData = async (page: number, limit: number, searchValue: string) => {
    const client = APIClient.getInstance();

    try {
      setLoading(true);
      const result = await client.projects.list(page, limit, searchValue);
      const { total, data } = result;
      setRows(data);
      setTotalPages(total);
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    columns,
    tableColumnExtensions,
    loadData,
    rows,
    totalPages,
    loading,
  };
};
