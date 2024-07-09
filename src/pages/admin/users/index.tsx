// Libraries
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Stack,
  Box,
  Tooltip,
  useTheme,
  DialogContentText,
  Typography,
  Button,
} from "@mui/material";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColDef,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRenderEditCellParams,
  GridPreProcessEditCellProps,
  GridCellParams,
} from "@mui/x-data-grid-pro";
import { randomId } from "@mui/x-data-grid-generator";
import { LoadingButton } from "@mui/lab";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  CancelOutlined,
  CheckCircleOutline,
  CleaningServices,
} from "@mui/icons-material";

// Hooks & Components
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import Layout from "@/components/layout";
import { Card } from "@/components/atoms/Card";
import ACLActionButton from "@/components/screens/users/ACLActionButton";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { DataGridContainer } from "@/components/atoms/DataGrid";
import { ADMIN_ROLE, AlertTypes, ModalText, USER_ACTIONS, User } from "@/types";
import {
  roleNameConverter,
  isAccountActivated,
  validateEmail,
  validateFullName,
} from "@/components/screens/users/UsersValidationSchema";
import { TablePaginationV2 } from "@/components/Table/PaginationV2";
import { TextInputComponent } from "@/components/screens/users/TextInputComponent";
import { SelectComponent } from "@/components/screens/users/SelectComponent";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { SnapshotTabIcon } from "@/components/icons/SnapshotTabIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { useSelectorAuth } from "@/store/hook";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

const apiClient = APIClient.getInstance();

const defaultEditingRow = { role: ADMIN_ROLE.VIEWER } as User;

const UserDetails = () => {
  const theme = useTheme();
  const router = useRouter();
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const { role } = useSelectorAuth();

  // =========== For dialog ===========
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionName, setActionName] = useState<string>(
    USER_ACTIONS.RESET_PASSWORD
  );

  // =========== For table ===========
  const [isLoading, setIsLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(0);
  const [rows, setRows] = useState([] as User[]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [editingRow, setEditingRow] = useState(defaultEditingRow);
  const [isEditing, setIsEditing] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState("");
  const [nameFieldError, setNameFieldError] = useState("");
  const [userScreenHeight, setUserScreenHeight] = useState(0);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  useEffect(() => {
    getAdminList();
    cancelAllEditingRows();
  }, [currentParams]);

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

  const cancelAllEditingRows = () => {
    setIsEditing(false);
    setRowModesModel((oldModel) => {
      const newModel = { ...oldModel };
      Object.keys(oldModel).forEach((key) => {
        newModel[key] = { mode: GridRowModes.View, ignoreModifications: true };
      });
      return newModel;
    });
    setEmailFieldError("");
    setNameFieldError("");
  };

  const getAdminList = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.users.list(currentParams);
      const { data, total } = response;

      const totalPages = Math.ceil(total / 10);
      setTotalPages(totalPages);

      const modifiedData = data.map((item) => ({ ...item, id: item._id }));
      setRows(modifiedData);
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const EditToolbar = useCallback(
    (props: EditToolbarProps) => {
      const { setRows, setRowModesModel } = props;

      const handleAddNewButton = () => {
        setIsEditing(true);
        setActionName(USER_ACTIONS.ADD_NEW);
        const id = randomId();
        setRows((oldRows) => [{ id, fullName: "", isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [id]: { mode: GridRowModes.Edit, fieldToFocus: "email" },
        }));
      };

      return (
        <GridToolbarContainer>
          <Card
            sx={{
              height: "115px",
              position: "relative",
              width: "100%",
              mb: "1rem",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h4" color="primary.main">
                Access Control List
              </Typography>
            </Stack>
            <Box
              position={"absolute"}
              right={0}
              bottom={0}
              sx={{ mr: "1rem", mb: "1rem" }}
            >
              <Button
                color="primary"
                sx={{
                  px: 3.7,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: 700,
                }}
                onClick={handleAddNewButton}
                disabled={isEditing}
              >
                Add new
              </Button>
            </Box>
          </Card>
        </GridToolbarContainer>
      );
    },
    [isEditing]
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId, row: any) => () => {
    setIsEditing(true); // to disable add new button
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "fullName" },
    });
    setEditingRow(row);
  };

  const handleSaveClick = () => {
    const emailErrorMessage = validateEmail(editingRow.email);
    const nameErrorMessage = validateFullName(editingRow.fullName.trim());
    if (nameErrorMessage || emailErrorMessage) {
      setEmailFieldError(emailErrorMessage);
      setNameFieldError(nameErrorMessage);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) setRows(rows.filter((row) => row.id !== id));

    setIsEditing(false);
    // set error message to empty
    setEmailFieldError("");
    setNameFieldError("");
    setEditingRow(defaultEditingRow);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "_id",
        headerName: "ID",
        flex: 0.3,
        editable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => {
          const { value: userId } = params;
          return (
            <Typography variant="body1" color="primary.main">
              {userId as ReactNode}
            </Typography>
          );
        },
      },
      {
        field: "email",
        headerName: "Email",
        flex: 0.4,
        renderEditCell: (params: GridRenderEditCellParams) => {
          const { value, row } = params;
          const { isNew } = row;
          return isNew ? (
            <TextInputComponent
              props={params}
              setEditingRow={setEditingRow}
              errorMessage={emailFieldError}
              maxLength={320}
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
        editable: true,
        sortable: false,
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
          const emailValue = params.props.value;
          const hasChanged = params.hasChanged;
          if (hasChanged) {
            const messageError = validateEmail(emailValue);
            setEmailFieldError(messageError);
          }
          return params.props;
        },
        renderCell: (params: GridCellParams) => {
          const { value: email } = params;
          return (
            <Typography variant="body1" color="primary.main">
              {email as ReactNode}
            </Typography>
          );
        },
      },
      {
        field: "role",
        headerName: "Role",
        renderEditCell: (params: GridRenderEditCellParams) => (
          <SelectComponent props={params} setEditingRow={setEditingRow} />
        ),
        type: "singleSelect",
        minWidth: 120,
        flex: 0.25,
        editable: true,
        sortable: false,
        renderCell: (params: GridCellParams) => {
          const { value } = params;
          return (
            <Typography color="grey.500">
              {roleNameConverter(value as string)}
            </Typography>
          );
        },
      },
      {
        field: "fullName",
        headerName: "Name",
        flex: 0.75,
        editable: true,
        sortable: false,
        renderEditCell: (params: GridRenderEditCellParams) => (
          <TextInputComponent
            props={params}
            setEditingRow={setEditingRow}
            errorMessage={nameFieldError}
            maxLength={30}
          />
        ),
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
          const nameValue = params.props.value;
          const hasChanged = params.hasChanged;
          if (hasChanged) {
            const messageError = validateFullName(nameValue.trim());
            setNameFieldError(messageError);
          }
          return params.props;
        },
        renderCell: (params: GridCellParams) => {
          const { value } = params;
          return <Typography color="grey.500">{value as string}</Typography>;
        },
      },
      {
        field: "status",
        renderHeader: () => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            Status
            <Tooltip title="Users who logged in, changed passwords and setup 2FA are marked as ‘Active’.">
              <ErrorOutlineIcon
                sx={{
                  ml: 0.5,
                  mb: 0.3,
                  color: theme.palette.action.disabledBackground,
                  fontSize: "18px",
                }}
              />
            </Tooltip>
          </Box>
        ),
        width: 142,
        sortable: false,
        renderCell: (params: GridCellParams) => {
          const { row } = params;
          const { email, status, isFactorAuthenticationEnabled } = row;
          const accountActivated = isAccountActivated(
            status,
            isFactorAuthenticationEnabled
          );
          if (email)
            return (
              <Typography color="grey.500">
                {accountActivated ? "Active" : "Inactive"}
              </Typography>
            );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id, row }) => {
          const {
            status,
            isFactorAuthenticationEnabled,
            totalResetPasswordInDay,
            isNew,
          } = row;
          const accountActivated = isAccountActivated(
            status,
            isFactorAuthenticationEnabled
          );

          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            // disable save button if editing (not creating new user) and no changes were made
            const isSaveButtonDisabled =
              !isNew &&
              row.fullName === editingRow.fullName &&
              row.role === editingRow.role;
            return [
              <GridActionsCellItem
                key="saveButton"
                icon={
                  <CheckCircleOutline
                    sx={{
                      color: isSaveButtonDisabled
                        ? theme.palette.action.disabledBackground
                        : theme.palette.success.dark,
                    }}
                  />
                }
                label="Save"
                onClick={handleSaveClick}
                disabled={isSaveButtonDisabled}
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

          return [
            <ACLActionButton
              key="actionButton"
              handleEditButton={handleEditClick(id, row)}
              openDialog={openDialog}
              executeSetEditingRow={() => setEditingRow(row)}
              setActionName={setActionName}
              isDisabled={isEditing}
              isAccountActive={accountActivated}
              isResetPasswordDisabled={totalResetPasswordInDay === 3}
            />,
          ];
        },
      },
    ],
    [
      rows,
      editingRow,
      isEditing,
      emailFieldError,
      nameFieldError,
      rowModesModel,
    ]
  );

  // =============== MODAL ===============
  const modalText: ModalText = useMemo(() => {
    const userEmail = editingRow?.email;
    return {
      [USER_ACTIONS.ADD_NEW]: {
        dialogTitle: `Add ${userEmail} To Access Control List`,
        dialogContentText:
          "This account will gain access to the admin panel. Do you want to proceed?",
        actionButtonText: "Add",
      },
      [USER_ACTIONS.EDIT]: {
        dialogTitle: `Save change for ${userEmail}`,
        dialogContentText:
          "New information will be updated to this account. Do you want to proceed?",
        actionButtonText: "Save",
      },
      [USER_ACTIONS.RESET_PASSWORD]: {
        dialogTitle: `Reset Password for ${userEmail}`,
        dialogContentText:
          "New password will be sent to this account and old password will be removed. Do you want to proceed?",
        actionButtonText: "Reset",
      },
      [USER_ACTIONS.RESET_2_FA]: {
        dialogTitle: `Reset 2FA for ${userEmail}`,
        dialogContentText:
          "Remove existing setup of 2FA and require this account to setup new 2FA.  Do you want to proceed?",
        actionButtonText: "Reset",
      },
      [USER_ACTIONS.REMOVE_ACCOUNT]: {
        dialogTitle: ` Remove ${userEmail} From Access Control List`,
        dialogContentText:
          "Remove this email from ACL means this account will be no longer have access to the admin panel. Do you want to proceed?",
        actionButtonText: "Remove",
      },
    };
  }, [editingRow]);

  const handleAddNewUser = async () => {
    const { email, role = ADMIN_ROLE.VIEWER, fullName, id } = editingRow;
    setIsLoading(true);
    try {
      const response = await apiClient.users.create({
        email,
        role,
        name: fullName.trim(),
      });
      if (response.status === 201) {
        setCurrentParams({ ...currentParams, page: 1 });
        updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
        setIsEditing(false);
        setEditingRow(defaultEditingRow);
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "Email already exist") {
        setEmailFieldError(errorMessage);
      } else {
        errorAlertHandler(error);
      }
      setRowModesModel({
        ...rowModesModel,
        [id]: { ...rowModesModel[id], mode: GridRowModes.Edit },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    setIsLoading(true);
    try {
      const { email } = editingRow;
      const response = await apiClient.users.remove({ email });
      if (response.status === 200) {
        // if currentParams.page === 1, do nothing; else, check if rows.length === 1, if yes, set page to page - 1
        if (currentParams.page !== 1 && rows.length === 1) {
          setCurrentParams({ ...currentParams, page: currentParams.page - 1 });
        } else {
          getAdminList();
        }
        updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
      }
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setIsLoading(false);
      setEditingRow(defaultEditingRow);
    }
  };

  const handleEditUserInfo = async () => {
    const { email, role, fullName, id } = editingRow;
    setIsLoading(true);
    try {
      const response = await apiClient.users.update({
        email,
        role,
        name: fullName.trim(),
      });
      if (response.status === 200) {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View },
        });
        updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
        setRows((prevRows) => {
          const newRows = [...prevRows];
          const index = newRows.findIndex((row) => row.id === id);
          newRows[index] = {
            ...newRows[index],
            email,
            role,
            fullName: fullName.trim(),
          };
          return newRows;
        });
        setCurrentParams((prev) => ({ ...prev, page: 1 }));
        setEditingRow(defaultEditingRow);
      }
    } catch (error) {
      errorAlertHandler(error);
      handleCancelClick(id)();
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const { email, id } = editingRow;
      const response = await apiClient.users.resetPassword({ email });
      if (response.status === 201) {
        updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
        setRows((prevRows) => {
          return prevRows.map((row) => {
            if (row.id === id) {
              return {
                ...row,
                totalResetPasswordInDay: row.totalResetPasswordInDay + 1 || 1,
              };
            }
            return row;
          });
        });
      }
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setIsLoading(false);
      setEditingRow(defaultEditingRow);
    }
  };

  const handleReset2FA = async () => {
    setIsLoading(true);
    try {
      const { email } = editingRow;
      const response = await apiClient.users.reset2FA({ email });
      if (response.status === 201) {
        updateAlert("", "Updated successfully", AlertTypes.SUCCESS);
      }
    } catch (error) {
      errorAlertHandler(error);
    } finally {
      setIsLoading(false);
      setEditingRow(defaultEditingRow);
    }
  };

  const handleConfirmRequest = () => {
    if (actionName === USER_ACTIONS.ADD_NEW) {
      handleAddNewUser();
    } else if (actionName === USER_ACTIONS.EDIT) {
      handleEditUserInfo();
    } else if (actionName === USER_ACTIONS.RESET_PASSWORD) {
      handleResetPassword();
    } else if (actionName === USER_ACTIONS.RESET_2_FA) {
      handleReset2FA();
    } else if (actionName === USER_ACTIONS.REMOVE_ACCOUNT) {
      handleRemoveUser();
    }
    setIsDialogOpen(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    if (
      actionName === USER_ACTIONS.ADD_NEW ||
      actionName === USER_ACTIONS.EDIT
    ) {
      setRowModesModel({
        ...rowModesModel,
        [editingRow.id]: {
          ...rowModesModel[editingRow.id],
          mode: GridRowModes.Edit,
        },
      });
    } else {
      setEditingRow(defaultEditingRow);
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const renderConfirmDialog = useCallback(() => {
    return (
      <Dialog open={isDialogOpen} onClose={closeDialog} width="477px">
        <DialogIcon>
          {actionName === USER_ACTIONS.REMOVE_ACCOUNT ? (
            <DeleteIcon fill={theme.palette.primary.main} />
          ) : (
            <SnapshotTabIcon size={65} color={theme.palette.primary.main} />
          )}
        </DialogIcon>
        <DialogTitle>{modalText[actionName]?.dialogTitle}</DialogTitle>
        <DialogContentText textAlign="center">
          {modalText[actionName]?.dialogContentText}
        </DialogContentText>
        <DialogActions mt="10px" gap={2}>
          <LoadingButton
            sx={{ width: 117, height: 40 }}
            color="secondary"
            onClick={closeDialog}
            loading={isLoading}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            sx={{ width: 117, height: 40 }}
            color="primary"
            onClick={handleConfirmRequest}
            loading={isLoading}
          >
            {modalText[actionName]?.actionButtonText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }, [isDialogOpen, actionName, isLoading]);

  if (role) {
    const userPermissions = getPermissionOfResource(role, RESOURCES.USER_ADMIN);
    if (userPermissions.includes(PERMISSION.NONE)) {
      router.push("/404");
      return;
    }
  } else {
    return <Typography color="text.main">Loading...</Typography>;
  }

  return (
    <Stack sx={{ ml: 2, height: `${userScreenHeight - 50}px` }}>
      {renderConfirmDialog()}
      <Box sx={{ flexGrow: 1 }}>
        <DataGridContainer
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          hideFooter
          disableColumnReorder
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnResize
          loading={isLoading}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <TablePaginationV2
          totalPages={totalPages}
          currentPage={currentParams.page}
          onCurrentPageChange={(page: number) =>
            setCurrentParams({ ...currentParams, page })
          }
        />
      </Box>
    </Stack>
  );
};

UserDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default UserDetails;
