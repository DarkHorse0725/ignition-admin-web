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
import { LotteryEntry } from "@/types";
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
import { WalletDialogContentComponent } from "../dialogComponent/WalletDialogContentComponent";
import { SnapshotDialogContentComponent } from "../dialogComponent/SnapshotDialogContentComponent";
import { useSelectorLotteryDetails } from "@/store/hook";

const apiClient = APIClient.getInstance();

function EntriesTab() {
  const { current: lotteryDetails } = useSelectorLotteryDetails();
  const { _id } = lotteryDetails;
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [userScreenHeight, setUserScreenHeight] = useState(0);

  // Table refresh
  const [isLoading, setIsLoading] = useState(false);

  // Table pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Dialog
  const [walletsDialogOpen, setWalletsDialogOpen] = useState(false);
  const [snapshotDialogOpen, setSnapshotDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LotteryEntry>();

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
    const response = await apiClient.lotteries.getEntries(_id, 1000);
    const { data } = response;
    setEntries(data);
    setIsLoading(false);
  };

  const handleOpenDialog = (row: LotteryEntry, isWalletsDialog: boolean) => {
    setSelectedRow(row);
    isWalletsDialog ? setWalletsDialogOpen(true) : setSnapshotDialogOpen(true);
  };

  const columns: Column[] = useMemo(
    () => [
      { name: "_id", title: "ID" },
      { name: "customer", title: "Customer Id" },
      { name: "mainGalaxyAddress", title: "Main Galaxy Address" },
      {
        name: "wallets",
        title: "Wallets",
        getCellValue: (row) => (
          <Typography
            color="primary.main"
            sx={{ cursor: "pointer" }}
            onClick={() => handleOpenDialog(row, true)}
          >
            Wallets
          </Typography>
        ),
      },
      {
        name: "snapshot",
        title: "Snapshot",
        getCellValue: (row) => (
          <Typography
            color="primary.main"
            sx={{ cursor: "pointer" }}
            onClick={() => handleOpenDialog(row, false)}
          >
            Snapshot
          </Typography>
        ),
      },
    ],
    []
  );

  const walletsDialogProps = {
    open: walletsDialogOpen,
    handleClose: () => setWalletsDialogOpen(false),
    dialogTitle: "Lottery Entry Wallets",
    dialogContent: () => (
      <WalletDialogContentComponent lotteryEntry={selectedRow} />
    ),
  };

  const snapshotDialogProps = {
    open: snapshotDialogOpen,
    handleClose: () => setSnapshotDialogOpen(false),
    dialogTitle: "Lottery Entry Wallets",
    dialogContent: () => (
      <SnapshotDialogContentComponent lotteryEntry={selectedRow} />
    ),
  };

  return (
    <TabPanel value="entries">
      <Grid rows={entries} columns={columns} getRowId={(row: any) => row._id}>
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

      {walletsDialogOpen && <EntriesDialog props={walletsDialogProps} />}
      {snapshotDialogOpen && <EntriesDialog props={snapshotDialogProps} />}
    </TabPanel>
  );
}

export default EntriesTab;
