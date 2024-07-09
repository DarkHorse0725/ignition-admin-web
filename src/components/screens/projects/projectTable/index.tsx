import React, { useState, useEffect, useMemo } from "react";
import { useProjectsSpreadSheet } from "./useProjectsSpreadSheet";
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  ColumnChooser,
  TableColumnVisibility,
  SearchPanel,
  TableFixedColumns,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import {
  DataTypeProvider,
  IntegratedPaging,
  PagingState,
  SearchState,
  PagingPanel,
} from "@devexpress/dx-react-grid";
import {
  CurrencyFormatter,
  DateFormatter,
  SpreadSheet,
  TableHeader,
  TableRefresh,
  TableRefreshState,
  ToggleButton,
  ToolBarRoot,
} from "@/components/Table";
import { Card } from "@/components/atoms/Card";
import { InputSearch } from "@/components/atoms/InputSearch";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { TablePaginationV2 } from "@/components/Table/PaginationV2";
import { useSelectorAuth } from "@/store/hook";

const defaultPagination = {
  page: 1,
  limit: 10,
};
export default function ProjectTable() {
  const {
    columns,
    tableColumnExtensions,
    rows,
    loadData,
    totalPages,
    loading,
  } = useProjectsSpreadSheet();
  const { role } = useSelectorAuth();
  const [searchValue, setSearchValue] = useState("");
  const [currentPagination, setCurrentPagination] = useState(defaultPagination);
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_INFO,
  );
  const refreshTable = () => {
    setTrigger((prev) => !prev);
    loadData(defaultPagination.page, defaultPagination.limit, "");
  };

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

  useEffect(() => {
    loadData(currentPagination.page, currentPagination.limit, searchValue);
  }, [currentPagination, searchValue]);

  const SearchWrapper = useMemo(() => {
    return (
      <SearchPanel
        messages={{
          searchPlaceholder: "Search by Project's Name",
        }}
        inputComponent={() => (
          <InputSearch
            trigger={trigger}
            onValueChange={(value) => {
              setSearchValue(value);
              setCurrentPagination(defaultPagination);
            }}
            placeholder="Search by Project's Name"
          />
        )}
      />
    );
  }, [trigger]);

  return (
    <Card
      sx={{
        ml: "15px",
        overflow: "hidden",
      }}
    >
      <Grid rows={rows} columns={columns} getRowId={(row: any) => row._id}>
        <DataTypeProvider
          formatterComponent={DateFormatter}
          for={["poolOpenDate", "announcementDate"]}
        />

        <DataTypeProvider
          formatterComponent={CurrencyFormatter}
          for={["totalRaise"]}
        />

        <SearchState />
        <PagingState />

        <IntegratedPaging />

        <VirtualTable
          columnExtensions={tableColumnExtensions}
          tableComponent={SpreadSheet}
          height={userScreenHeight - 302}
          messages={{
            noData: searchValue
              ? `Sorry, we couldn't find any project names matching ${searchValue}`
              : loading
                ? "Loading"
                : "No data",
          }}
        />

        <TableHeaderRow rowComponent={TableHeader} />
        {!permissionOfResource.includes(PERMISSION.NONE) && (
          <TableFixedColumns rightColumns={["action"]} />
        )}
        <Toolbar rootComponent={ToolBarRoot} />

        {!!rows.length && (
          <PagingPanel
            containerComponent={() => (
              <TablePaginationV2
                totalPages={Math.ceil(totalPages / 10)}
                currentPage={currentPagination.page}
                onCurrentPageChange={(page: number) =>
                  setCurrentPagination({ ...currentPagination, page })
                }
              />
            )}
          />
        )}

        {SearchWrapper}

        <TableColumnVisibility />

        <ColumnChooser toggleButtonComponent={ToggleButton} />

        <TableRefreshState action={() => refreshTable()} />
        <TableRefresh />
      </Grid>
    </Card>
  );
}
