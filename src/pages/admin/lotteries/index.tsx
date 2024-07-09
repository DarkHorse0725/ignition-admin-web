// Libraries import
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import { Grid, TableHeaderRow, Toolbar, VirtualTable, ColumnChooser, TableColumnVisibility, SearchPanel, } from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState, SearchState, PagingPanel, Column } from "@devexpress/dx-react-grid";

// Components import
import { APIClient } from "@/core/api";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import { SpreadSheet, TableHeader, TablePagination, TableRefresh, TableRefreshState, ToggleButton, ToolBarRoot, } from "@/components/Table";
import { InputSearch } from "@/components/atoms/InputSearch";
import { Lottery } from "@/types";
import { Card } from "@/components/atoms/Card";

const apiClient = APIClient.getInstance();

const Lotteries: NextPageWithLayout = () => {
  const router = useRouter();
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [lotteriesData, setLotteriesData] = useState<Lottery[]>([]);

  // Table search
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState<Lottery[]>([]);

  // Table refresh
  const [isLoading, setIsLoading] = useState(false);

  // Table pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Adjust table height based on screen height
    setUserScreenHeight(window.innerHeight);
    const handleResize = () => {
      setUserScreenHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const upperCaseSearchValue = searchValue.toUpperCase();
    const filteredArr: Lottery[] = lotteriesData.filter((row: any) => {
      const { _id, project, status } = row;
      const isIncludesId = _id?.toUpperCase().includes(upperCaseSearchValue);
      const isIncludesProject = project?.name?.toUpperCase().includes(upperCaseSearchValue);
      const isIncludesStatus = status?.toUpperCase().includes(upperCaseSearchValue);
      return isIncludesId || isIncludesProject || isIncludesStatus;
    });
    setFilteredRows(filteredArr);
  }, [searchValue]);

  const loadData = async () => {
    setIsLoading(true);
    const response = await apiClient.lotteries.list();
    const { data } = response;
    setLotteriesData(data);
    setFilteredRows(data)
    setIsLoading(false);
  }

  const columns: Column[] = useMemo(() => [
    {
      name: '_id',
      title: 'ID',
      getCellValue: (row) => (
        <Typography
          color="primary.main"
          sx={{
            textDecoration: 'none',
            cursor: "pointer",
          }}
          onClick={() => router.push(`/admin/lotteries/${row._id}`)}
        >
          {row._id}
        </Typography>
      ),
    },
    {
      name: 'project',
      title: 'Project',
      getCellValue: (row) => (
        <Typography
          color="primary.main"
          sx={{
            textDecoration: 'none',
            cursor: "pointer",
          }}
          onClick={() => router.push(`projects/${row.project?._id}`)}
        >
          {row.project?.name}
        </Typography>

      ),
    },
    { name: 'openDate', title: 'OpenDate' },
    { name: 'closeDate', title: 'CloseDate' },
    {
      name: 'status',
      title: 'Status',
      getCellValue: (row) => <Typography color="grey.500" sx={{ textTransform: 'capitalize' }}>{row.status}</Typography>,
    },
  ], []);

  return (
    <Stack
      spacing={2}
      sx={{ ml: 2 }}
    >
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Lottery List</Typography>
        </Stack>
      </Card>
      <Card>
        <Grid
          rows={filteredRows}
          columns={columns}
          getRowId={(row: any) => row._id}
        >

          {/* <DataTypeProvider
            formatterComponent={DateFormatter}
            for={["openDate", "closeDate"]}
          /> */}

          <PagingState
            pageSize={pageSize}
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />

          <IntegratedPaging />

          <VirtualTable
            tableComponent={SpreadSheet}
            height={userScreenHeight - 289}
            messages={{
              noData:
                searchValue
                  ?
                  `Sorry, we couldn't find any results for "${searchValue}"`
                  :
                  (
                    isLoading ?
                      "Loading..."
                      :
                      "No data"
                  ),
            }}
          />

          <TableHeaderRow rowComponent={TableHeader} />

          <PagingPanel containerComponent={TablePagination} />

          <Toolbar rootComponent={ToolBarRoot} />

          {/* Search table input */}
          <SearchState onValueChange={setSearchValue} value={searchValue} />
          <SearchPanel inputComponent={InputSearch} />

          <TableColumnVisibility />

          <ColumnChooser toggleButtonComponent={ToggleButton} />

          {/* Refresh table button */}
          <TableRefreshState action={loadData} />
          <TableRefresh />

        </Grid>
      </Card>
    </Stack>
  )
}

Lotteries.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Lotteries;
