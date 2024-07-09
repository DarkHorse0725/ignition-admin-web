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
import { Currency, Transaction } from "@/types";
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

export const TransactionTable = () => {
  const theme = useTheme();
  const router = useRouter();
  const { current: projectDetails } = useSelectorProjectDetail();
  const { _id, currency } = projectDetails;
  const { errorAlertHandler } = useAlertContext();
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const environment = process.env.NEXT_PUBLIC_ENV || "";
  const tableColumnExtensions = [
    { columnName: "_id", width: 250 },
    { columnName: "hash", width: 650 },
    { columnName: "transactionStatus", width: 180 },
    { columnName: "transactionKind", width: 180 },
    { columnName: "transactionType", width: 180 },
    { columnName: "transactionFee", width: 250 },
    { columnName: "createdBy", width: 250 },
    { columnName: "createdAt", width: 180 },
    { columnName: "from", width: 400 },
    { columnName: "to", width: 400 },
  ];
  const columns = [
    {
      name: "_id",
      title: "ID",
      getCellValue: (row: any) => row._id,
    },
    {
      name: "hash",
      title: "Hash",
      getCellValue: (row: any) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            cursor: "pointer",
          }}
          onClick={() => openHash(row.hash)}
        >
          {row.hash}
        </Typography>
      ),
    },
    {
      name: "transactionKind",
      title: "Kind",
      getCellValue: (row: any) =>
        row.transactionKind?.replace("Transaction", "").toUpperCase() || "--",
    },
    {
      name: "transactionType",
      title: "Type",
      getCellValue: (row: any) => row.transactionType.toUpperCase(),
    },
    {
      name: "transactionStatus",
      title: "Status",
      getCellValue: (row: any) => row.transactionStatus.toUpperCase(),
    },
    {
      name: "transactionFee",
      title: "Fee",
      getCellValue: (row: any) =>
        row.transactionFee !== undefined ? `${row.transactionFee}` : "--",
    },
    {
      name: "from",
      title: "From",
      getCellValue: (row: any) => row.from,
    },
    {
      name: "to",
      title: "To",
      getCellValue: (row: any) => row.to,
    },
    {
      name: "createdAt",
      title: "Created At",
      getCellValue: (row: any) => row.createdAt,
    },
    {
      name: "createdBy",
      title: "CreatedBy",
      getCellValue: (row: any) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            cursor: "pointer",
          }}
          onClick={() => router.push(`/admin/users/${row.createdBy._id}`)}
        >
          {row.createdBy?.email}
        </Typography>
      ),
    },
  ];

  const openHash = (value: string) => {
    const isProd = environment === "production" ? true : false;
    let url = isProd
      ? `https://etherscan.io/address/${value}`
      : `https://rinkeby.etherscan.io/tx/${value}`;
    if (currency === Currency.BNB) {
      url = isProd
        ? `https://bscscan.com/address/${value}`
        : `https://testnet.bscscan.com/tx/${value}`;
    }
    window.open(url, "_blink");
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await client.projects.getTransactions(_id);
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
    <Grid rows={rows} columns={columns}>
      <DataTypeProvider
        formatterComponent={DateFormatter}
        for={["createdAt"]}
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
