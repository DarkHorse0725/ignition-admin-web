import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "@mui/material";
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
import { LotteryEntryResult } from "@/types";
import {
  SpreadSheet,
  TableHeader,
  TablePagination,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
  ToolBarRoot,
} from "@/components/Table";
import EntriesDialog from "../dialogComponent/LotteryDetailsDialog";
import { EntryResultWalletsDialogContentComponent } from "../dialogComponent/EntryResultWalletsDialogContentComponent";
import { useSelectorLotteryDetails } from "@/store/hook";

const apiClient = APIClient.getInstance();

function EntryResultsTab() {
  const { current: lotteryDetails } = useSelectorLotteryDetails();
  const { _id } = lotteryDetails;
  const [entryResults, setEntryResults] = useState<LotteryEntryResult[]>([]);
  const [userScreenHeight, setUserScreenHeight] = useState(0);

  // Table refresh
  const [isLoading, setIsLoading] = useState(false);

  // Table pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LotteryEntryResult>();

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
    const response = await apiClient.lotteries.getEntryResults(_id);
    const { data } = response;
    setEntryResults(data);
    setIsLoading(false);
  };

  const handleOpenDialog = (row: LotteryEntryResult) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const columns: Column[] = useMemo(
    () => [
      { name: "_id", title: "ID", getCellValue: (row: any) => row._id },
      {
        name: "wallets",
        title: "Wallets",
        getCellValue: (row) => (
          <Typography
            color="primary.main"
            sx={{ cursor: "pointer" }}
            onClick={() => handleOpenDialog(row)}
          >
            Wallets
          </Typography>
        ),
      },
      {
        name: "totalGalaxyTickets",
        title: "Total Galaxy Tickets",
        getCellValue: (row) => row.totalGalaxyTickets,
      },
      {
        name: "totalWinningTickets",
        title: "Total Winning Tickets",
        getCellValue: (row) => row.totalWinningTickets,
      },
      { name: "entry", title: "Entry", getCellValue: (row: any) => row.entry },
      {
        name: "mainAddress",
        title: "Main Address",
        getCellValue: (row: any) => row.mainAddress,
      },
      {
        name: "customer",
        title: "Customer Id",
        getCellValue: (row) => row.customer,
      },
    ],
    []
  );

  const dialogProps = {
    open: dialogOpen,
    handleClose: () => setDialogOpen(false),
    dialogTitle: "Lottery Entry Wallets",
    dialogContent: () => (
      <EntryResultWalletsDialogContentComponent
        lotteryEntryResult={selectedRow}
      />
    ),
  };

  return (
    <TabPanel value="entry-results">
      <Grid
        rows={entryResults}
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
          messages={{ noData: isLoading ? "Loading..." : "No data" }}
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

      <EntriesDialog props={dialogProps} />
    </TabPanel>
  );
}

export default EntryResultsTab;
