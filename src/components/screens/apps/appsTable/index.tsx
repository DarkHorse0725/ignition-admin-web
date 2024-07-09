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
import { App } from "@/types";
import {
  SpreadSheet,
  TableHeader,
  ToolBarRoot,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
} from "@/components/Table";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

const client = APIClient.getInstance();

const AppsTable = () => {
  const route = useRouter();
  const { errorAlertHandler } = useAlertContext();
  const [rows, setRows] = useState<App[]>([]);
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [columns] = useState([
    {
      name: "_id",
      title: "ID",
      getCellValue: (row: any) => (
        <Typography
          sx={{ cursor: "pointer" }}
          color="primary.main"
          onClick={() => route.push(`/admin/apps/${row._id}`)}
          noWrap
        >
          {row._id}
        </Typography>
      ),
    },
    { name: "name", title: "Name", getCellValue: (row) => row.name },
    { name: "brand", title: "Brand", getCellValue: (row) => row.brand },
    {
      name: "environment",
      title: "Environment",
      getCellValue: (row) => row.environment,
    },
    {
      name: "platform",
      title: "Platform",
      getCellValue: (row) => row.platform,
    },
  ]);

  const loadData = async () => {
    try {
      const result = await client.apps.list();
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
        height={userScreenHeight - 157}
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

export default AppsTable;
