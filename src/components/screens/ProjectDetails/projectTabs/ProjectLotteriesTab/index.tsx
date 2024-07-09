import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  ColumnChooser,
  TableColumnVisibility,
} from "@devexpress/dx-react-grid-material-ui";
import {
  DataTypeProvider,
  Column
} from "@devexpress/dx-react-grid";

// Components import
import { APIClient } from "@/core/api";
import {
  DateFormatter,
  SpreadSheet,
  TableHeader,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
  ToolBarRoot,
} from "@/components/Table";
import { Lottery } from "@/types";

const apiClient = APIClient.getInstance();

const ProjectLotteriesTab = () => {
  const router = useRouter();
  let { id: projectId } = router.query as { id: string };

  const [lotteriesList, setLotteriesList] = useState<Lottery[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectId) getLotteryList();
  }, [projectId])

  const getLotteryList = async () => {
    setIsLoading(true);
    const response = await apiClient.lotteries.list(projectId)
    const { data } = response;
    setLotteriesList(data)
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
    { name: 'project', title: 'Project', getCellValue: (row) => row.project?.name },
    { name: 'openDate', title: 'OpenDate' },
    { name: 'closeDate', title: 'CloseDate' },
    {
      name: 'status',
      title: 'Status',
      getCellValue: (row) => <Typography color="grey.500" sx={{ textTransform: 'capitalize' }}>{row.status}</Typography>,
    },
  ], []);

  return (
    <Grid
      rows={lotteriesList}
      columns={columns}
      getRowId={(row: any) => row._id}
    >

      <DataTypeProvider
        formatterComponent={DateFormatter}
        for={["openDate", "closeDate"]}
      />

      <VirtualTable
        tableComponent={SpreadSheet}
        height={"auto"}
        messages={{ noData: isLoading ? "Loading..." : "No data" }}
      />

      <TableHeaderRow rowComponent={TableHeader} />

      <Toolbar rootComponent={ToolBarRoot} />

      <TableColumnVisibility />

      <ColumnChooser toggleButtonComponent={ToggleButton} />

      {/* Refresh table button */}
      <TableRefreshState action={getLotteryList} />
      <TableRefresh />

    </Grid>
  );
};

export default ProjectLotteriesTab;