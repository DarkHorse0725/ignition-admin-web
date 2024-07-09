import React, { useEffect, useMemo, useState } from "react";
import { TabPanel } from "@mui/lab";
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  ColumnChooser,
  TableColumnVisibility,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  PagingState,
  PagingPanel,
  Column,
} from "@devexpress/dx-react-grid";

import { APIClient } from "@/core/api";
import { Transaction } from "@/types";
import {
  SpreadSheet,
  TableHeader,
  TablePagination,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
  ToolBarRoot,
} from "@/components/Table";
import { useSelectorLotteryDetails } from "@/store/hook";

const apiClient = APIClient.getInstance();

function TransactionsTab() {
  const { current: lotteryDetails } = useSelectorLotteryDetails();
  const { _id } = lotteryDetails;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userScreenHeight, setUserScreenHeight] = useState(0);

  // Table refresh
  const [isLoading, setIsLoading] = useState(false);

  // Table pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (_id) loadData();
  }, [_id]);

  useEffect(() => {
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

  const loadData = async () => {
    setIsLoading(true);
    const response = await apiClient.lotteries.getTransactions(_id);
    const { data } = response;
    setTransactions(data);
    setIsLoading(false);
  };

  const columns: Column[] = useMemo(
    () => [
      {
        name: "_id",
        title: "ID",
        getCellValue: (row: any) => row._id,
      },
      {
        name: "hash",
        title: "Hash",
        getCellValue: (row: any) => row.hash,
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
        getCellValue: (row) =>
          row.transactionFee !== undefined ? `${row.transactionFee}` : "--",
      },
      {
        name: "from",
        title: "From",
        getCellValue: (row) => row.from,
      },
      {
        name: "to",
        title: "To",
        getCellValue: (row) => row.to,
      },
      {
        name: "createdAt",
        title: "Created At",
        getCellValue: (row: any) => row.createdAt,
      },
      {
        name: "createdBy",
        title: "CreatedBy",
        getCellValue: (row) => row.createdBy?.email,
      },
    ],
    []
  );

  return (
    <TabPanel value="transactions">
      <Grid
        rows={transactions}
        columns={columns}
        getRowId={(row: any) => row._id}
      >
        <PagingState
          pageSize={pageSize}
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />

        <IntegratedPaging />

        <VirtualTable
          tableComponent={SpreadSheet}
          height={userScreenHeight - 453}
          messages={{
            noData: isLoading ? "Loading..." : "No data",
          }}
        />

        <TableHeaderRow rowComponent={TableHeader} />

        <PagingPanel containerComponent={TablePagination} />

        <Toolbar rootComponent={ToolBarRoot} />

        <TableColumnVisibility />

        <ColumnChooser toggleButtonComponent={ToggleButton} />

        {/* Refresh table button */}
        <TableRefreshState action={loadData} />
        <TableRefresh />
      </Grid>
    </TabPanel>
  );
}

export default TransactionsTab;
