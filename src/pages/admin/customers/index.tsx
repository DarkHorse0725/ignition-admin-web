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
import { Customer } from "@/types";
import { Card } from "@/components/atoms/Card";
import { FloatingAddButton } from "@/components/atoms/FloatingAddButton";

const apiClient = APIClient.getInstance();

const Customers: NextPageWithLayout = () => {
  const router = useRouter();
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

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
    const response = await apiClient.customers.getList();
    const { data } = response;
    setCustomerList(data);
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
          onClick={() => router.push(`/admin/customers/${row._id}`)}
        >
          {row._id}
        </Typography>
      ),
    },
    {
      name: 'name',
      title: 'Name',
      getCellValue: (row) => row.name,
    },
    {
      name: 'surname',
      title: 'Surname',
      getCellValue: (row) => row.surname,
    },
    {
      name: 'country',
      title: 'Country',
      getCellValue: (row) => row.country?.name ?? '',
    },
    {
      name: 'brand',
      title: 'Brand',
      getCellValue: (row) => row.brand?.toUpperCase() ?? '',
    },
    {
      name: 'status',
      title: 'Status',
      getCellValue: (row) => row.status,
    },
    { name: 'email', title: 'Email', getCellValue: (row) => row.email },
  ], []);

  return (
    <Stack
      spacing={2}
      sx={{ ml: 2 }}
    >
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
      </Card>
      <Card>
        <Grid
          rows={customerList}
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
      <FloatingAddButton href={"/admin/customers/createNew"} />
    </Stack>
  );
};

Customers.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Customers;