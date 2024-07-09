import { APIClient } from "@/core/api";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  GridRowModesModel,
  useGridApiRef,
  GridRowModes,
  GridRowParams,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRenderEditCellParams,
  GridSortModel,
  GridRowModel,
  GridPreProcessEditCellProps,
  GridValidRowModel,
} from "@mui/x-data-grid-pro";
import { CancelOutlined, CheckCircleOutline, Edit } from "@mui/icons-material";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { AlertTypes, SnapshotRecord } from "@/types";
import { useAlertContext } from "@/providers/AlertContext";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { TextInputComponent } from "@/components/screens/users/TextInputComponent";
import { NumberInputComponent } from "@/components/screens/users/NumberInputComponent";
import { MuiEvent } from "@mui/x-data-grid-pro";
import { DataGridContainer } from "@/components/atoms/DataGrid";
import { validateAccount, validateAllocations } from "./utils";
import { SortedAscendingIcon, SortedDescendingIcon } from "./SortIcons";
import { NoResultsOverlay } from "./NoResultsOverlay";
import { TablePaginationV2 } from "@/components/Table/PaginationV2";
import { AccountDuplicateDialog } from "../AccountDuplicateDialog";
import { ErrorDialog } from "../ErrorDialog";
import { ACTIONS } from "..";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";

const getTotalPage = (totalRows: number, pageSize: number) => {
  const remainder = totalRows % pageSize;
  const quotient = Math.floor(totalRows / pageSize);
  return remainder > 0 ? quotient + 1 : quotient;
};

const client = APIClient.getInstance();

interface SnapshotTableProps {
  action: ACTIONS | undefined;
  setAction: Function;
  records: SnapshotRecord[];
  setRecords: Function;
  loadData: (
    currentPage: number,
    pageSize: number,
    searchText: string,
    sortField?: string,
    direction?: "asc" | "desc",
  ) => Promise<void>;
  rowCount: number;
  isLoading: boolean;
  searchValue: string;
  setSearchValue: Function;
  isEditingRecord: boolean;
  setIsEditingRecord: (isEditingRecord: boolean) => void;
  setRowModesModel: Function;
  rowModesModel: GridRowModesModel;
  isDisableEditMode: boolean;
}

const apiClient = APIClient.getInstance();

const INITIAL_PAGINATION = {
  pageSize: 10,
  page: 1,
};

const SnapshotTable = ({
  action,
  setAction,
  records,
  loadData,
  setRecords,
  rowCount,
  isLoading,
  searchValue,
  setSearchValue,
  isEditingRecord,
  setIsEditingRecord,
  setRowModesModel,
  rowModesModel,
  isDisableEditMode,
}: SnapshotTableProps) => {
  const theme = useTheme();
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [editingRow, setEditingRow] = useState({} as GridRowModel);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [allocErrorMessage, setAllocErrorMessage] = useState("");
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [paginationModel, setPaginationModel] = useState(INITIAL_PAGINATION);
  const { role } = useSelectorAuth();
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_SNAPSHOT,
  );

  const { current: projectDetails } = useSelectorProjectDetail();
  const { _id: projectId } = projectDetails;

  const apiRef = useGridApiRef();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId, row: any) => {
    setAction(ACTIONS.EDIT);
    setIsEditingRecord(true);
    setEditingRow(row);
    setSelectedRecord(row);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "email" },
    });
  };

  const handleSaveClick = async () => {
    const emailError = validateAccount(editingRow.email);
    const allocError = validateAllocations(editingRow.numberOfAllocation);
    if (emailError || allocError) {
      setEmailErrorMessage(emailError);
      setAllocErrorMessage(allocError);
      return;
    }

    if (!action) return;
    switch (action) {
      case ACTIONS.ADD_NEW:
        handleAddRecord(projectId, editingRow);
        break;
      case ACTIONS.EDIT:
        handleEditRecord(projectId, editingRow);
        break;
    }
  };

  const handleAddRecord = async (
    projectId: string,
    data: GridValidRowModel,
  ) => {
    try {
      const { email, numberOfAllocation } = data;
      await apiClient.snapshot.create(projectId, {
        email,
        numberOfAllocation: Number(numberOfAllocation),
      });

      updateAlert("", "New record created successfully", AlertTypes.SUCCESS);
      setPaginationModel(INITIAL_PAGINATION);
      setSearchValue("");
      setSortModel([]);
      setAction(undefined);
      setIsEditingRecord(false);
      setEditingRow({});
      setRowModesModel({
        ...rowModesModel,
        [editingRow._id]: { mode: GridRowModes.View },
      });

      setAction(undefined);
    } catch (error: any) {
      console.log(error);
      const { message } = error;
      switch (message) {
        case "Duplicate account!":
          setOpenDuplicateDialog(true);
          break;
        case "Account not connect to any wallet!":
          setSubtitle("This account has not been linked to any wallet.");
          setOpenErrorDialog(true);
          break;
        case "Account not found!":
          setSubtitle("This account has not registered on Ignition.");
          setOpenErrorDialog(true);
          break;
        case "Account not validated!":
          setSubtitle("This account has not registered on Ignition.");
          setOpenErrorDialog(true);
          break;
        default:
          errorAlertHandler(error);
          break;
      }
    }
  };

  const handleEditRecord = async (
    projectId: string,
    data: GridValidRowModel,
  ) => {
    try {
      const { email, numberOfAllocation } = data;
      await apiClient.snapshot.update(projectId, data._id, {
        email,
        numberOfAllocation: Number(numberOfAllocation),
      });

      updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
      getSnapshotData();
      setAction(undefined);
    } catch (error: any) {
      errorAlertHandler(error);
    } finally {
      setIsEditingRecord(false);
      setRowModesModel({
        ...rowModesModel,
        [editingRow._id]: { mode: GridRowModes.View },
      });
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow: any = records.find((record) => record._id === id);
    if (editedRow!.isNew)
      setRecords(records.filter((record) => record._id !== id));

    // set error message to empty
    setEmailErrorMessage("");
    setAllocErrorMessage("");
    setEditingRow({});
    setIsEditingRecord(false);
    setAction(undefined);
  };

  const getSnapshotData = () => {
    const { page, pageSize } = paginationModel;
    let sort;
    let direction;
    if (sortModel.length > 0) {
      sort = sortModel[0].field;
      direction = sortModel[0].sort ? sortModel[0].sort : undefined;
    }
    console.log("calling loadData");
    loadData(page, pageSize, searchValue, sort, direction);
  };

  useEffect(() => {
    console.log("snapshottable useEffect");
    getSnapshotData();
    setIsEditingRecord(false);
    setEmailErrorMessage("");
    setAllocErrorMessage("");
    setEditingRow({});
    setRowModesModel({
      ...rowModesModel,
      [editingRow._id]: { mode: GridRowModes.View },
    });
  }, [paginationModel.page, paginationModel.pageSize, sortModel, searchValue]);

  useEffect(() => {
    setPaginationModel({ ...paginationModel, page: 1 });
  }, [searchValue]);

  const handleDeleteRecord = async (recordId: string) => {
    if (!projectId) return;
    setIsEditingRecord(false);
    try {
      await client.snapshot.delete(projectId, recordId);
      updateAlert("Record deleted", "Success", AlertTypes.SUCCESS);

      if (records.length === 1) {
        const { page } = paginationModel;
        if (page === totalPage) {
          setPaginationModel((prev) => ({ ...prev, page: page - 1 }));
        }
      }

      getSnapshotData();
      setOpenConfirmDeleteDialog(false);
    } catch (error) {
      errorAlertHandler(error);
    }
  };

  const columns = useMemo(() => {
    const colsTable = [
      {
        field: "_id",
        headerName: "ID",
        editable: false,
        sortable: false,
        width: 100,
        renderCell: (params: GridRenderEditCellParams) => {
          const index =
            params.api.getRowIndexRelativeToVisibleRows(params.row._id) + 1;
          const id = 10 * (paginationModel.page - 1) + index;
          return <Typography color="primary.main">{id}</Typography>;
        },
      },
      {
        field: "email",
        headerName: "Account",
        editable: true,
        sortable: false,
        width: 300,
        renderCell: ({ value }: GridRenderEditCellParams) => {
          return <Typography color="primary.main">{value}</Typography>;
        },
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
          const emailValue = params.props.value;
          const hasChanged = params.hasChanged;
          if (hasChanged) {
            const errorMessage = validateAccount(emailValue);
            setEmailErrorMessage(errorMessage);
          }
          return params.props;
        },
        renderEditCell: (params: GridRenderEditCellParams) => {
          const { value, row } = params;
          const { isNew } = row;
          return isNew ? (
            <TextInputComponent
              props={params}
              setEditingRow={setEditingRow}
              errorMessage={emailErrorMessage}
            />
          ) : (
            <Typography
              variant="body1"
              color="primary.main"
              sx={{ marginLeft: 1 }}
            >
              {value}
            </Typography>
          );
        },
      },
      {
        field: "walletAddress",
        headerName: "Primary Wallet Address",
        editable: false,
        sortable: false,
        width: 450,
        renderCell: ({ value }: any) => {
          return <Typography color="primary.main">{value}</Typography>;
        },
      },
      {
        field: "numberOfAllocation",
        headerName: "Allocation",
        editable: true,
        width: 125,
        preProcessEditCellProps: async (
          params: GridPreProcessEditCellProps,
        ) => {
          const alloc = params.props.value;
          const hasChanged = params.hasChanged;
          if (hasChanged) {
            const errorMessage = validateAllocations(alloc);
            setAllocErrorMessage(errorMessage);
          }
          return params.props;
        },
        renderEditCell: (params: GridRenderEditCellParams) => {
          return (
            <NumberInputComponent
              props={{ ...params }}
              setEditingRow={setEditingRow}
              errorMessage={allocErrorMessage}
            />
          );
        },
      },
      {
        field: "allocationValue",
        headerName: "Value",
        editable: false,
        width: 125,
      },
      {
        field: "galaxyMaxBuy",
        headerName: "EP Max Buy",
        editable: false,
        width: 125,
      },
      {
        field: "maxBuy",
        headerName: "OP Max Buy",
        editable: false,
        width: 125,
      },
      {
        field: "balance",
        headerName: "Staked",
        editble: false,
        width: 125,
      },
      {
        field: "userType",
        headerName: "Type",
        editable: false,
        width: 125,
        renderCell: ({ value }: GridRenderEditCellParams) => {
          let userTypeLabel;
          switch (value) {
            case 1:
              userTypeLabel = "Family";
              break;
            case 2:
              userTypeLabel = "Whale";
              break;
            case 3:
              userTypeLabel = "Normal";
              break;
            default:
              userTypeLabel = "Invalid Type";
          }
          return <Typography color="primary.main">{userTypeLabel}</Typography>;
        },
      },
      {
        field: "kycStatus",
        headerName: "KYC",
        editable: false,
        width: 80,
        renderCell: ({ value }: GridRenderEditCellParams) => {
          return (
            <Typography color="primary.main">{value ? "Yes" : "No"}</Typography>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        cellClassName: "actions",
        width: 100,
        getActions: ({ id, row }: GridRowParams) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          const isDataChanged =
            row.numberOfAllocation === editingRow.numberOfAllocation;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="saveButton"
                icon={
                  <CheckCircleOutline
                    sx={{
                      color: isDataChanged
                        ? theme.palette.action.disabledBackground
                        : theme.palette.success.dark,
                    }}
                  />
                }
                label="Save"
                onClick={handleSaveClick}
                disabled={isDataChanged}
              />,
              <GridActionsCellItem
                key="cancelButton"
                icon={
                  <CancelOutlined sx={{ color: theme.palette.error.main }} />
                }
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          const isDisable = isDisableEditMode || isEditingRecord;
          return [
            <IconButton
              key="deleteButton"
              type="button"
              id="action-button"
              onClick={() => {
                setOpenConfirmDeleteDialog(true);
                setSelectedRecord(row);
              }}
              disabled={isDisable}
            >
              <DeleteIcon
                fill={
                  isDisable
                    ? theme.palette.action.disabledBackground
                    : theme.palette.error.main
                }
                width="18"
                height="18"
              />
            </IconButton>,
            <IconButton
              key="editButton"
              type="button"
              id="action-button"
              onClick={() => {
                handleEditClick(id, row);
              }}
              disabled={isDisable}
            >
              <Edit
                sx={{
                  fontSize: 17,
                  color: isDisable
                    ? theme.palette.action.disabledBackground
                    : theme.palette.primary.main,
                }}
              />
            </IconButton>,
          ];
        },
      },
    ];

    if (!permissionOfResource.includes(PERMISSION.WRITE)) colsTable.pop();

    return colsTable;
  }, [
    rowModesModel,
    records,
    allocErrorMessage,
    emailErrorMessage,
    editingRow,
    isDisableEditMode,
    isEditingRecord,
    paginationModel.page,
  ]);

  const handleSortModelChange = (sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model

    setSortModel(sortModel);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRecords(
      records.map((row) => (row._id === newRow.id ? updatedRow : row)),
    );
    return updatedRow;
  };

  const totalPage = useMemo(() => {
    return getTotalPage(rowCount, paginationModel.pageSize);
  }, [rowCount, paginationModel.pageSize]);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box sx={{ ml: "15px", height: "515px" }}>
      {records.length > 0 ? (
        <>
          <DataGridContainer
            apiRef={apiRef}
            sortingOrder={["asc", "desc", null]}
            rows={records}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pinnedColumns: { right: ["actions"] },
            }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              columnSortedDescendingIcon: SortedDescendingIcon,
              columnSortedAscendingIcon: SortedAscendingIcon,
            }}
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            sortModel={sortModel}
            rowCount={rowCount}
            onPaginationModelChange={setPaginationModel}
            hideFooter
            disableColumnMenu
            disableColumnReorder
            disableColumnSelector
            disableRowSelectionOnClick
            disableColumnResize
            loading={isLoading}
            sx={{
              "& .MuiDataGrid-pinnedColumns:nth-of-type(even) .MuiDataGrid-row--editable":
                {
                  borderRadius: "0 8px 8px 0!important",
                },
              "& .MuiDataGrid-row--editable:nth-of-type(even)": {
                borderRadius: "8px 0 0 8px",
              },
              "& .MuiDataGrid-pinnedColumns": {
                borderRadius: 0,
              },
            }}
          />

          <TablePaginationV2
            totalPages={totalPage}
            currentPage={paginationModel.page}
            onCurrentPageChange={(page: number) =>
              setPaginationModel((_paginationModel) => ({
                ..._paginationModel,
                page: page,
              }))
            }
          />
          {selectedRecord && (
            <ConfirmDeleteDialog
              open={openConfirmDeleteDialog}
              onClose={() => setOpenConfirmDeleteDialog(false)}
              onSubmit={() => handleDeleteRecord(selectedRecord._id)}
              account={selectedRecord.email}
            />
          )}
        </>
      ) : (
        <NoResultsOverlay />
      )}
      <AccountDuplicateDialog
        projectId={projectId}
        open={openDuplicateDialog}
        onClose={() => setOpenDuplicateDialog(false)}
        email={editingRow?.email}
      />
      <ErrorDialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
        subtitle={subtitle}
      />
    </Box>
  );
};

export default SnapshotTable;
