// Libraries import
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import {
  Stack,
  Box,
  MenuItem,
  Tooltip,
  IconButton,
  useTheme,
  DialogContentText,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import {
  PagingState,
  CustomPaging,
  Column,
  PagingPanel,
} from "@devexpress/dx-react-grid";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";

// Components import
import DeleteOutlineSymbol from "@/components/icons/DeleteOutlineSymbol";
import DeleteIcon from "@/components/icons/DeleteIcon";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import { APIClient } from "@/core/api";
import InputField from "@/components/atoms/InputField";
import { useAlertContext } from "@/providers/AlertContext";
import {
  AlertTypes,
  NETWORK_LABELS,
  SUPPORTED_NETWORKS,
  ACTIONS,
  ADMIN_STATUS,
  ADMIN_DEFAULT_PAGE,
  ADMIN_EXIST_ACTIVE,
  ADMIN_EXIST_ALL,
  ADMIN_PAGE_SIZE,
  BTN_STATUS,
  BTN_TOOLTIP,
  MESSAGES,
  AdminExistRole,
  Admin,
  ADMIN_ROLE,
} from "@/types";
import { SetAdminsValidationSchema } from "@/components/screens/setAdmins/SetAdminsValidationSchema";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { SpreadSheet, TableHeader, TablePagination } from "@/components/Table";
import { Card } from "@/components/atoms/Card";
import MemoizedResetFormContext from "@/components/atoms/ResetFormContext";
import { useSelectorAuth, useSelectorContractAdmin } from "@/store/hook";
import {
  setAdminAddressToDelete,
  setCurrentAction,
  setIsAdminActive,
  setIsProcessing,
} from "@/store/features/contractAdminSlice";

const apiClient = APIClient.getInstance();

const SetAdmin: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const { role } = useSelectorAuth();
  const {
    isRefetch, // For refetching data when admin is added or deleted
    isProcessing, // For disabling buttons when processing
    isAdminActive, // For checking if logged in user is admin
    adminAddressToDelete, // To detect which admin address is being deleted
  } = useSelectorContractAdmin();
  const isViewer = role === ADMIN_ROLE.VIEWER;
  const theme = useTheme();
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const { status, account } = useMetaMask();
  const [adminData, setAdminData] = useState<Admin[]>([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [currentParams, setCurrentParams] = useState({
    page: ADMIN_DEFAULT_PAGE,
    network: SUPPORTED_NETWORKS[0],
    status: [ADMIN_STATUS.COMPLETED, ADMIN_STATUS.DELETING],
  });
  const tableColumnExtensions = [
    { columnName: "_id", flexGrow: 1 },
    { columnName: "adminAddress", flexGrow: 2 },
    { columnName: "action", width: 120, align: "center" },
  ];
  const [userScreenHeight, setUserScreenHeight] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tableInputFieldStyle = {
    "& .MuiInputBase-root": {
      border: `1px solid ${theme.palette.grey[300]}`,
      width: 238,
      height: 40,
    },
    "& .MuiInputBase-input": {
      height: "auto",
    },
    "& .Mui-error .MuiInputBase-input": {
      borderColor: theme.palette.error.main,
      "&:not(:focus)": {
        color: `${theme.palette.error.main} !important`,
      },
    },
  };

  useEffect(() => {
    loadData();
  }, [currentParams, isRefetch]);

  useEffect(() => {
    checkAdminActive(account);
  }, [account, currentParams.network, isRefetch]);

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

  const checkAdminActive = async (address: string | null): Promise<void> => {
    const isActive = await checkExistAdmin(ADMIN_EXIST_ACTIVE, address);
    dispatch(setIsAdminActive(isActive));
  };

  const checkExistAdmin = async (
    role: AdminExistRole,
    address: string | null,
  ) => {
    if (address) {
      const rs = await apiClient.setAdmins.isExisted(role, {
        adminAddress: ethers.getAddress(address),
        network: currentParams.network,
      });
      const { data } = rs;
      return !!data;
    }
    return false;
  };

  const loadData = async (page?: number) => {
    const response = await apiClient.setAdmins.getAdmins({
      ...currentParams,
      ...(page ? { page } : {}),
    });
    if (response && response.result) setAdminData(response.result);
    if (response && response.total) setTotalAdmins(response.total);
  };

  const changePage = (value: number): void => {
    setCurrentParams({
      ...currentParams,
      page: value,
    });
  };

  const changeNetwork = (value: number | unknown): void => {
    if (typeof value === "number") {
      setCurrentParams({
        ...currentParams,
        network: value,
        page: 0,
      });
    }
  };

  const submitSetAdmin = async (
    formData: any,
    helpers: FormikHelpers<any>,
  ): Promise<void> => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        const adminAddress = formData.adminAddress.trim();
        const { setFieldValue } = helpers;
        setFieldValue("adminAddress", adminAddress);
        const isAlreadyAdded = await checkExistAdmin(
          ADMIN_EXIST_ALL,
          adminAddress,
        );
        if (isAlreadyAdded) {
          const { setFieldError } = helpers;
          setFieldError("adminAddress", "Wallet address already exists");
          return;
        }
        const trx = await apiClient.contracts.addAdminContract(
          adminAddress,
          currentParams.network,
        );
        const { hash } = trx;
        if (hash) {
          const rs = await apiClient.setAdmins.create({
            adminAddress: ethers.getAddress(adminAddress),
            network: currentParams.network,
            txHash: hash,
          });
          if (rs.status === 201) {
            setShowAddForm(false);
            updateAlert("", "Data is being processed", AlertTypes.WARNING);
            dispatch(setIsProcessing(true));
            dispatch(setCurrentAction(ACTIONS.ADD_ADMIN));
            const { resetForm } = helpers;
            resetForm();
          }
        } else {
          console.error(trx);
          errorAlertHandler(trx);
        }
      } catch (error) {
        console.error(error);
        errorAlertHandler(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getBtnStatus = (isProcess: boolean): BTN_STATUS => {
    if (status !== "connected") return BTN_STATUS.NO_CONNECT;
    if (!isAdminActive) return BTN_STATUS.NO_PERMISSION;
    if (isProcess || isLoading) return BTN_STATUS.BEING_PROCESS;
    return BTN_STATUS.ACTIVE;
  };

  const btnParams = useMemo(() => {
    const stt = getBtnStatus(isProcessing);
    if (stt === BTN_STATUS.ACTIVE) {
      return {
        disabled: showAddForm,
        tooltipTitle: "",
      };
    }
    return {
      disabled: true,
      tooltipTitle: BTN_TOOLTIP[stt],
    };
  }, [status, isAdminActive, isProcessing, showAddForm, isLoading]);

  const formDisabled = useMemo(() => {
    const stt = getBtnStatus(isProcessing);
    return stt !== BTN_STATUS.ACTIVE;
  }, [status, isAdminActive, isProcessing, showAddForm, isLoading]);

  const toggleShowAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  const closeModal = () => {
    setShowDeleteModal(false);
  };

  const revokeAdmin = async () => {
    if (!isLoading && adminAddressToDelete) {
      try {
        setIsLoading(true);
        const trx = await apiClient.contracts.deleteAdminContract(
          adminAddressToDelete,
          currentParams.network,
        );
        const { hash } = trx;
        if (hash) {
          const rs = await apiClient.setAdmins.remove({
            adminAddress: ethers.getAddress(adminAddressToDelete),
            network: currentParams.network,
            txHash: hash,
          });
          if (rs.status === 200) {
            closeModal();
            updateAlert("", "Data is being processed", AlertTypes.WARNING);
            dispatch(setIsProcessing(true));
            dispatch(setCurrentAction(ACTIONS.DELETE_ADMIN));
          }
        } else {
          errorAlertHandler(trx);
        }
      } catch (error) {
        errorAlertHandler(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns = (() => {
    const arr: Column[] = [
      {
        name: "_id",
        title: "ID",
        getCellValue: (row) => (
          <Box component={"span"} sx={{ color: theme.palette.primary.main }}>
            {row._id || ""}
          </Box>
        ),
      },
      {
        name: "adminAddress",
        title: "Wallet Address",
        getCellValue: (row) =>
          row._id ? (
            <Box component={"span"} sx={{ color: theme.palette.primary.main }}>
              {row.adminAddress}
            </Box>
          ) : (
            <Box>
              <InputField
                sx={tableInputFieldStyle}
                name="adminAddress"
                isdisabled={formDisabled.toString()}
              />
            </Box>
          ),
      },
    ];
    if (!isViewer)
      arr.push({
        name: "action",
        title: "Action",
        getCellValue: (row) =>
          row._id ? (
            // If row._id is not null, it means that this row is an admin, not a form
            totalAdmins > 1 && (
              // Shows delete button only if there are more than 1 admin
              <Tooltip title={btnParams.tooltipTitle}>
                {/* Tooltip doesn't accept a disable child -> must wrap inside of a span */}
                <span>
                  <IconButton
                    type="button"
                    disabled={btnParams.disabled}
                    onClick={() => {
                      dispatch(setAdminAddressToDelete(row.adminAddress));
                      setShowDeleteModal(true);
                    }}
                    sx={{ py: 0 }}
                  >
                    <DeleteOutlineSymbol
                      color={
                        btnParams.disabled
                          ? theme.palette.action.disabledBackground
                          : theme.palette.error.main
                      }
                    />
                  </IconButton>
                </span>
              </Tooltip>
            )
          ) : (
            // Form row to add new admin, shows submit and cancel button
            <>
              {/* Submit button */}
              <Tooltip
                title={!isAdminActive && BTN_TOOLTIP[BTN_STATUS.NO_PERMISSION]}
              >
                <span>
                  <IconButton
                    type="submit"
                    disabled={formDisabled}
                    sx={{ py: 0 }}
                  >
                    <CheckCircleOutline
                      {...{
                        sx: {
                          color: formDisabled
                            ? theme.palette.grey[200]
                            : theme.palette.success.dark,
                        },
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
              {/* Cancel button */}
              <IconButton
                onClick={toggleShowAddForm}
                disabled={isLoading}
                sx={{ py: 0 }}
              >
                <CancelOutlined
                  {...{
                    sx: {
                      color: isLoading
                        ? theme.palette.grey[200]
                        : theme.palette.error.main,
                    },
                  }}
                />
              </IconButton>
            </>
          ),
      });
    return arr;
  })();

  // rows is an array of admin list get from API
  const rows = useMemo(
    () =>
      adminData.map((item: any) => ({
        _id: item._id,
        adminAddress: item.adminAddress,
      })),
    [adminData],
  );

  // Handle add new admin form
  const tableRows = useMemo(
    () => [...(showAddForm ? [{}] : []), ...rows],
    [rows, showAddForm],
  );

  const { page, network } = currentParams;

  return (
    <>
      <Stack spacing={2} sx={{ ml: 2 }}>
        <Card sx={{ position: "relative" }}>
          <Stack spacing={2}>
            <Typography variant="h4" color="primary.main">
              Contract Admin
            </Typography>
            <TextField
              select
              label="IDO Network"
              value={network}
              onChange={(e) => changeNetwork(e.target.value)}
              disabled={isLoading || isProcessing || showAddForm}
              sx={{ ...tableInputFieldStyle }}
            >
              {SUPPORTED_NETWORKS?.map(
                (networkId: keyof typeof NETWORK_LABELS, index: number) => (
                  <MenuItem key={index} value={networkId}>
                    {NETWORK_LABELS[networkId]}
                  </MenuItem>
                ),
              )}
            </TextField>
          </Stack>
          {!isViewer && (
            <Tooltip title={btnParams.tooltipTitle || ""} placement="bottom">
              <Box
                position={"absolute"}
                right={0}
                bottom={0}
                sx={{
                  mr: "1rem",
                  mb: "1rem",
                }}
              >
                <Button
                  disabled={btnParams.disabled}
                  color="primary"
                  onClick={() => !showAddForm && toggleShowAddForm()}
                  sx={{
                    width: "122px",
                    height: "40px",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Add new
                </Button>
              </Box>
            </Tooltip>
          )}
        </Card>

        <Card>
          <Formik
            validationSchema={SetAdminsValidationSchema}
            initialValues={{ adminAddress: "" }}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, helpers) => submitSetAdmin(values, helpers)}
          >
            {() => (
              <Form>
                <Grid
                  key={"AdminSetAdminGrid"}
                  rows={tableRows}
                  columns={columns as Column[]}
                >
                  <VirtualTable
                    columnExtensions={tableColumnExtensions as any}
                    tableComponent={SpreadSheet}
                    height={userScreenHeight - 286}
                  />
                  <TableHeaderRow rowComponent={TableHeader} />
                  <PagingState
                    currentPage={page}
                    onCurrentPageChange={changePage}
                    pageSize={ADMIN_PAGE_SIZE}
                  />
                  <CustomPaging totalCount={totalAdmins} />
                  {totalAdmins > ADMIN_PAGE_SIZE && (
                    <PagingPanel containerComponent={TablePagination} />
                  )}
                </Grid>
                <MemoizedResetFormContext showAddForm={showAddForm} />
              </Form>
            )}
          </Formik>
        </Card>
      </Stack>

      {/* Remove admin confirmation modal */}
      <Dialog open={showDeleteModal} onClose={closeModal} width="377px">
        <DialogIcon>
          <DeleteIcon fill={theme.palette.primary.main} />
        </DialogIcon>
        <DialogTitle>Remove Wallet Address</DialogTitle>
        <DialogContentText textAlign="center">
          <Typography color="text.secondary">
            {MESSAGES.CONFIRM_DELETE}
          </Typography>
        </DialogContentText>
        <DialogActions mt="10px">
          <LoadingButton
            sx={{
              width: 117,
              height: 40,
            }}
            color="primary"
            onClick={revokeAdmin}
            loading={isLoading}
          >
            Remove
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

SetAdmin.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SetAdmin;
