import { APIClient } from "@/core/api";
import React, { useEffect, useState } from "react";
import {
  ColumnChooser,
  Grid,
  TableColumnVisibility,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { useAlertContext } from "@/providers/AlertContext";
import { Typography, useTheme } from "@mui/material";
import {
  SpreadSheet,
  TableHeader,
  ToolBarRoot,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
} from "@/components/Table";
import { useRouter } from "next/router";
import { Whitelist } from "@/types";

const client = APIClient.getInstance();

export const WhitelistsTable = () => {
  const theme = useTheme();
  const router = useRouter();
  const { errorAlertHandler } = useAlertContext();
  const [rows, setRows] = useState<Whitelist[]>([]);
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [columns] = useState([
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
          onClick={() => router.push(`whitelists/${row._id}`)}
        >
          {row._id}
        </Typography>
      ),
    },
    { name: "project", title: "Project", getCellValue: (row) => row.project },
    {
      name: "openDate",
      title: "Open Date",
      getCellValue: (row) =>
        new Date(parseInt(row.openDate as string) * 1000).toISOString(),
    },
    {
      name: "closeDate",
      title: "Close Date",
      getCellValue: (row) =>
        new Date(parseInt(row.closeDate as string) * 1000).toISOString(),
    },
  ]);

  const loadData = async () => {
    try {
      const result = await client.whitelists.list();
      const { total, data } = result;
      setRows(data);
    } catch (error) {
      errorAlertHandler(error);
    }
  };

  useEffect(() => {
    loadData();

    // Adjust table height based on screen height
    setUserScreenHeight(window.innerHeight);
    const handleResize = () => {
      setUserScreenHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  return (
    <Grid rows={rows} columns={columns}>
      <VirtualTable
        tableComponent={SpreadSheet}
        height={userScreenHeight - 155}
      />
      <TableHeaderRow rowComponent={TableHeader} />
      <TableColumnVisibility />

      <Toolbar rootComponent={ToolBarRoot} />
      <ColumnChooser toggleButtonComponent={ToggleButton} />

      <TableRefreshState action={handleRefresh} />
      <TableRefresh />
    </Grid>
  );
};
