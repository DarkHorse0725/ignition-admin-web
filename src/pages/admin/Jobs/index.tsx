import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  TableColumnVisibility,
} from "@devexpress/dx-react-grid-material-ui";
import {
  DataTypeProvider,
  IntegratedPaging,
  PagingState,
  PagingPanel,
  Column
} from "@devexpress/dx-react-grid";

// Components import
import { APIClient } from "@/core/api";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import {
  DateFormatter,
  SpreadSheet,
  TableHeader,
  TablePagination,
  TableRefresh,
  TableRefreshState,
  ToolBarRoot,
} from "@/components/Table";
import { Job } from "@/types";
import { Card } from "@/components/atoms/Card";
import { FloatingAddButton } from "@/components/atoms/FloatingAddButton";

const apiClient = APIClient.getInstance();

const Jobs: NextPageWithLayout = () => {
  const router = useRouter();
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [jobList, setJobList] = useState<Job[]>([]);

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

  const loadData = async () => {
    setIsLoading(true);
    const response = await apiClient.jobs.getJobList();
    const { data } = response;
    setJobList(data);
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
          onClick={() => router.push(`/admin/jobs/${row._id}`)}
        >
          {row._id}
        </Typography>
      ),
    },
    { name: 'name', title: 'Name' },
    { name: 'repeatInterval', title: 'Repeat Interval' },
    { name: 'nextRunAt', title: 'Next Run At' },
    {
      name: 'disabled',
      title: 'Disabled',
      getCellValue: (row) => (row.disabled ? 'true' : 'false'),
    },
  ], []);

  return (
    <Stack
      spacing={2}
      sx={{ ml: 2 }}
    >
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Cron Jobs</Typography>
        </Stack>
      </Card>
      <Card>
        <Grid
          rows={jobList}
          columns={columns}
          getRowId={(row: any) => row._id}
        >

          <DataTypeProvider
            formatterComponent={DateFormatter}
            for={["nextRunAt"]}
          />

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
            messages={{ noData: isLoading ? "Loading..." : "No data" }}
          />

          <TableHeaderRow rowComponent={TableHeader} />

          <PagingPanel containerComponent={TablePagination} />

          <Toolbar rootComponent={ToolBarRoot} />

          <TableColumnVisibility />

          <TableRefreshState action={loadData} />
          <TableRefresh />

        </Grid>
      </Card>
      <FloatingAddButton href={"/admin/jobs/createNew"} />
    </Stack>
  );
};

Jobs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Jobs;