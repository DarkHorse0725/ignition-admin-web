import {
  DateFormatter,
  SpreadSheet,
  TableHeader,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
  ToolBarRoot,
} from "@/components/Table";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { useSelectorProjectDetail } from "@/store/hook";
import { Whitelist } from "@/types";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  ColumnChooser,
  Grid,
  Table,
  TableColumnVisibility,
  TableHeaderRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import { Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const client = APIClient.getInstance();

export const WhitelistTabTable = () => {
  const theme = useTheme();
  const router = useRouter();
  const { current: projectDetails } = useSelectorProjectDetail();
  const { _id } = projectDetails;
  const { errorAlertHandler } = useAlertContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Whitelist[]>([]);
  const tableColumnExtensions = [{ columnName: "_id", width: 250 }];
  const columns = [
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
          onClick={() => router.push(`/admin/whitelists/${row._id}`)}
        >
          {row._id}
        </Typography>
      ),
    },
    {
      name: "project",
      title: "Project",
      getCellValue: (row: any) => row.project,
    },
    {
      name: "openDate",
      title: "OpenDate",
      getCellValue: (row: any) =>
        new Date(parseInt(row.openDate as string) * 1000).toISOString(),
    },
    {
      name: "closeDate",
      title: "CloseDate",
      getCellValue: (row: any) =>
        new Date(parseInt(row.closeDate as string) * 1000).toISOString(),
    },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await client.whitelists.list(_id);

      const { data } = result;
      setRows(data);
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  return (
    <Grid rows={rows} columns={columns} getRowId={(row: any) => row._id}>
      <DataTypeProvider
        formatterComponent={DateFormatter}
        for={["openDate", "closeDate"]}
      />

      <Table
        tableComponent={SpreadSheet}
        columnExtensions={tableColumnExtensions}
        messages={{ noData: loading ? "Loading" : "No data" }}
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
