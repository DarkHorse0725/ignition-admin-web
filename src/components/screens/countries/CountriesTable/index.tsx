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
import { Country } from "@/types";
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

const CountriesTable = () => {
  const route = useRouter();
  const { errorAlertHandler } = useAlertContext();
  const [rows, setRows] = useState<Country[]>([]);

  const [columns] = useState([
    {
      name: "_id",
      title: "ID",
      getCellValue: (row: any) => (
        <Typography
          sx={{ cursor: "pointer" }}
          color="primary.main"
          onClick={() => route.push(`/admin/countries/${row._id}`)}
          noWrap
        >
          {row._id}
        </Typography>
      ),
    },
    {
      name: "name",
      title: "Name",
      getCellValue: (row) => row.name,
    },
    {
      name: "alpha2",
      title: "Alpha2",
      getCellValue: (row) => row.alpha2,
    },
    {
      name: "alpha3",
      title: "Alpha3",
      getCellValue: (row) => row.alpha3,
    },
    {
      name: "countryCode",
      title: "Country Code",
      getCellValue: (row) => row.countryCode,
    },
    {
      name: "iso31662",
      title: "ISO31662",
      getCellValue: (row) => row.iso31662,
    },
    {
      name: "region",
      title: "Region",
      getCellValue: (row) => row.region,
    },
    {
      name: "regionCode",
      title: "Region Code",
      getCellValue: (row) => row.regionCode,
    },
    {
      name: "restricted",
      title: "Restricted",
      getCellValue: (row) => row.restricted,
    },
  ]);
  const [tableColumnExtensions] = useState([
    {
      columnName: "_id",
      width: 250,
    },
    {
      columnName: "name",
      width: 250,
    },
  ]);

  const loadData = async () => {
    try {
      const result = await client.countries.list();
      const { total, data } = result;
      setRows(data);
    } catch (error) {
      errorAlertHandler(error);
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
      <VirtualTable
        columnExtensions={tableColumnExtensions}
        tableComponent={SpreadSheet}
        height="100%"
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

export default CountriesTable;
