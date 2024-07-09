import { DatePickerField } from "@/components/atoms/DatePickerField";
import { Dialog, DialogIcon } from "@/components/atoms/Dialog";
import InputField from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import { AlertWarningIcon, WalletIcon } from "@/components/icons";
import {
  getPermissionOfResource,
  PERMISSION,
  RESOURCES,
} from "@/core/ACLConfig";
import { APIClient } from "@/core/api";
import { regexOnlyNumberAndDecimal, regexOnlyPositiveNumber } from "@/helpers";
import { useAlertContext } from "@/providers/AlertContext";
import {
  setLoadingVestingTransaction,
  updateDetails as updateProjectDetails,
} from "@/store/features/projectDetailsSlice";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
import {
  ADMIN_EXIST_ACTIVE,
  AlertTypes,
  PoolStatus,
  ProjectStatus,
} from "@/types";
import { LoadingButton } from "@mui/lab";
import { Box, DialogContentText, Tooltip } from "@mui/material";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import _ from "lodash";
import { useMetaMask } from "metamask-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { NumberCurrencyInputFormat, WrappedInput } from "../../components";
import { IEventOnChange } from "../../formStep/types";
import {
  disabledMessage,
  removePrefixNumberString,
  validateEnteringInput,
} from "../../projectFunction";
import { checkExistAdmin } from "../ProjectPoolsTab/poolFunction";
import { DisplayUnitLabel } from "./DisplayUnitLabel";
import { toolTipUnitVestingMessages } from "./tooltipUnitVesting";
import { VestingValidateSchema } from "./VestingValidation";

const PERIOD_UNIT_OPTIONS = [
  {
    label: "Minutes",
    value: "minute",
  },
  {
    label: "Hours",
    value: "hour",
  },
  {
    label: "Days",
    value: "day",
  },
  {
    label: "Weeks",
    value: "week",
  },
];

const validateNumberField = (
  e: IEventOnChange,
  name: string,
  setFieldValue: (field: string, value: string) => void
) => {
  if (
    e.target.value !== "" &&
    !validateEnteringInput(e, regexOnlyPositiveNumber.test(e.target.value))
  ) {
    e.preventDefault();
    return;
  }
  setFieldValue(name, e.target.value);
};

const ProjectVestingInfoTab = () => {
  const { current: projectDetails, isLoadingVestingTransaction } =
    useSelectorProjectDetail();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query as any;

  const [isOpenNotAdminWalletDialog, setIsOpenNotAdminWalletDialog] =
    useState<boolean>(false);

  const { errorAlertHandler, updateAlert } = useAlertContext();

  const { status: statusConnectMetamask, connect, account } = useMetaMask();

  const { vesting, status, announcementDate, pools, network, _id } =
    projectDetails;
  const galaxyPool = pools[0];
  const crowdfundingPool = pools[1];
  const valueTGEDate = crowdfundingPool?.crowdfundingEndTime
    ? vesting?.TGEDate
    : "";
  const initialState = {
    ...vesting,
    TGEDate: valueTGEDate ?? "",
    cliffLength: {
      value: vesting?.cliffLength?.value ?? "",
      periodUnit: vesting?.cliffLength?.periodUnit ?? "day",
    },
    frequency: {
      value: vesting?.frequency?.value ?? "",
      periodUnit: vesting?.frequency?.periodUnit ?? "day",
    },
    numberOfRelease: vesting?.numberOfRelease ?? "",
  };
  const { role } = useSelectorAuth();
  const permission = getPermissionOfResource(role, RESOURCES.PROJECT_INFO);

  const checkDisabledTGEDateMessage: string = useMemo(() => {
    if (!announcementDate)
      return "Please configure OpenPool End Time in Pool tab first";
    if (!crowdfundingPool.crowdfundingEndTime)
      return "Please configure OpenPool End Time in Pool tab first";
    return "";
  }, [announcementDate, crowdfundingPool]);

  const checkNullOrUndefined = (value: any) => {
    return value === undefined || value === null || value === "";
  };

  const checkDisabledValueUnit = (TGEPercentage: number): boolean => {
    return TGEPercentage === 100 ? true : false;
  };

  const updateTGEDateAfterDeployed = async (
    poolAddress: string,
    TGEDate: any
  ) => {
    const apiClient = APIClient.getInstance();
    const { ethereum }: any = window;
    // No Install
    if (!ethereum) {
      return updateAlert(``, `Metamask not detected`, AlertTypes.ERROR);
    }
    const provider = new ethers.BrowserProvider(ethereum, "any");
    const { chainId } = await provider.getNetwork();
    let accountConnected: string | null = "";
    if (!poolAddress) {
      return updateAlert(``, `PoolAddress address not found`, AlertTypes.ERROR);
    }
    //No connect
    if (statusConnectMetamask === "notConnected") {
      const rs = await connect();
      accountConnected = rs && rs[0];
    }
    const isActive = await checkExistAdmin(
      ADMIN_EXIST_ACTIVE,
      account || accountConnected,
      chainId
    );
    if (!isActive) {
      setIsOpenNotAdminWalletDialog(true);
      dispatch(setLoadingVestingTransaction(false));
      return;
    } else {
      try {
        dispatch(setLoadingVestingTransaction(true));
        const transactionReceipt: any = await apiClient.contracts.updateTGEDate(
          poolAddress,
          {
            projectNetwork: network,
            TGEDate: TGEDate,
          }
        );
        const { hash } = transactionReceipt;
        if (hash) {
          updateAlert("", "Data is being processed", AlertTypes.WARNING);
          return transactionReceipt;
        } else if (transactionReceipt.status === 500) {
          dispatch(setLoadingVestingTransaction(false));
          return updateAlert(
            ``,
            transactionReceipt.message || transactionReceipt.data.message,
            AlertTypes.ERROR
          );
        }
      } catch (err) {
        dispatch(setLoadingVestingTransaction(false));
        errorAlertHandler(err);
      }
    }
  };

  const handleSubmit = async (data: any) => {
    let updatedVesting = {
      ...data,
      TGEPercentage: parseFloat(data.TGEPercentage),
      cliffLength: {
        ...data.cliffLength,
        value: checkNullOrUndefined(data.cliffLength.value)
          ? ""
          : parseInt(data.cliffLength.value.toString()),
      },
      frequency: {
        ...data.frequency,
        value: checkNullOrUndefined(data.frequency.value)
          ? ""
          : parseInt(data.frequency.value.toString()),
      },
      numberOfRelease: checkNullOrUndefined(data.numberOfRelease)
        ? ""
        : parseInt(data.numberOfRelease.toString()),
    };
    //if value is null remove them out of the object
    if (checkNullOrUndefined(data.cliffLength.value)) {
      updatedVesting = _.omit(updatedVesting, "cliffLength");
    }

    if (checkNullOrUndefined(data.TGEDate)) {
      updatedVesting = _.omit(updatedVesting, "TGEDate");
    }

    if (checkNullOrUndefined(data.frequency.value)) {
      updatedVesting = _.omit(updatedVesting, "frequency");
    }

    if (checkNullOrUndefined(data.numberOfRelease)) {
      updatedVesting = _.omit(updatedVesting, "numberOfRelease");
    }
    let result = null;
    if ([PoolStatus.DRAFT, PoolStatus.PUBLISHED].includes(galaxyPool.status)) {
      try {
        result = await APIClient.getInstance().vesting.updateVesting(
          id,
          updatedVesting
        );
        if (result) {
          dispatch(updateProjectDetails(result.data));
          updateAlert(``, `Updated successfully`, AlertTypes.SUCCESS);
        }
      } catch (err) {
        errorAlertHandler(err);
      }
    } else {
      dispatch(setLoadingVestingTransaction(true));
      result = await updateTGEDateAfterDeployed(
        galaxyPool.contractAddress as any,
        data.TGEDate
      );
    }
  };
  return (
    <div>
      <Dialog
        open={isOpenNotAdminWalletDialog}
        onClose={() => setIsOpenNotAdminWalletDialog(false)}
        width="432px"
      >
        <DialogIcon>
          <WalletIcon />
        </DialogIcon>
        <DialogContentText textAlign={"center"} sx={{ pb: 2 }}>
          Your connected wallet is not in the Contract Admin List
          <br /> Please switch wallet to perform this action
        </DialogContentText>
      </Dialog>
      <Formik
        initialValues={initialState}
        enableReinitialize={!!vesting?.TGEDate}
        onSubmit={handleSubmit}
        validationSchema={VestingValidateSchema({
          announcementDate,
          crowdFundingEndTime: crowdfundingPool.crowdfundingEndTime,
          poolStatus: galaxyPool.status,
        })}
      >
        {({
          values,
          setFieldValue,
          errors,
          setFieldTouched,
          touched,
          setFieldError,
          isSubmitting,
          dirty,
        }) => {
          return (
            <Form>
              <>
                <WrappedInput>
                  <Tooltip
                    title={disabledMessage(
                      "Vesting (Schedule Details)",
                      projectDetails,
                      permission
                    )}
                  >
                    <div>
                      <InputField
                        name="description"
                        label="Vesting (Schedule Details)"
                        value={values.description}
                        disabled={
                          !!disabledMessage(
                            "description",
                            projectDetails,
                            permission
                          ) || crowdfundingPool.deployed
                        }
                      />
                    </div>
                  </Tooltip>
                </WrappedInput>
                <WrappedInput>
                  <Tooltip
                    title={
                      disabledMessage("TGEDate", projectDetails, permission) ||
                      checkDisabledTGEDateMessage
                    }
                  >
                    <div>
                      <DatePickerField
                        name="TGEDate"
                        label="TGE Date (Vesting Start Date)"
                        minDateTime={new Date()}
                        value={values.TGEDate}
                        setFieldValue={setFieldValue}
                        setFieldError={setFieldError}
                        setFieldTouched={setFieldTouched}
                        customError={errors?.TGEDate as any}
                        errors={errors}
                        touched={touched}
                        disabled={
                          !!disabledMessage(
                            "TGEDate",
                            projectDetails,
                            permission
                          ) || !!checkDisabledTGEDateMessage
                        }
                      />
                    </div>
                  </Tooltip>
                </WrappedInput>

                <WrappedInput>
                  <Tooltip
                    title={disabledMessage(
                      "TGEPercentage",
                      projectDetails,
                      permission
                    )}
                  >
                    <div>
                      <InputField
                        placeholder=""
                        name="TGEPercentage"
                        label="TGE Percentage"
                        value={values.TGEPercentage}
                        onChange={(e: any) => {
                          if (Number(e.target.value) === 100) {
                            setFieldValue("cliffLength.value", "");
                            setFieldValue("frequency.value", "");
                            setFieldValue("numberOfRelease", "");
                          }
                          setFieldValue("TGEPercentage", e.target.value);
                        }}
                        disabled={
                          !!disabledMessage(
                            "TGEPercentage",
                            projectDetails,
                            permission
                          ) || crowdfundingPool.deployed
                        }
                        InputProps={{
                          inputComponent: NumberCurrencyInputFormat,
                          inputProps: {
                            suffix: "%",
                          },
                        }}
                        onKeyDown={(e: {
                          keyCode: number;
                          target: any;
                          key: any;
                          preventDefault: () => any;
                        }) => {
                          if (
                            !validateEnteringInput(
                              e,
                              regexOnlyNumberAndDecimal(1).test(
                                removePrefixNumberString("%", e.target.value)
                              )
                            ) ||
                            (e.key === "." && e.target.value === "")
                          ) {
                            return e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </Tooltip>
                </WrappedInput>
                <WrappedInput>
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <DisplayUnitLabel
                          disable={
                            !!disabledMessage(
                              "vesting.cliffLength.value",
                              projectDetails,
                              permission
                            ) || crowdfundingPool.deployed
                          }
                        >
                          Cliff Length
                        </DisplayUnitLabel>
                        <Tooltip
                          title={toolTipUnitVestingMessages("cliffLength")}
                          placement="top"
                          arrow
                        >
                          <div>
                            <AlertWarningIcon />
                          </div>
                        </Tooltip>
                      </Box>
                      <Box sx={{ width: "70%", display: "flex" }}>
                        <Box sx={{ width: "70%", marginRight: "1rem" }}>
                          <Tooltip
                            title={disabledMessage(
                              "vesting.cliffLength.value",
                              projectDetails,
                              permission
                            )}
                          >
                            <div>
                              <InputField
                                name="cliffLength.value"
                                label="Number"
                                value={values.cliffLength?.value ?? ""}
                                disabled={
                                  !!disabledMessage(
                                    "cliffLength.value",
                                    projectDetails,
                                    permission
                                  ) ||
                                  checkDisabledValueUnit(
                                    Number(values.TGEPercentage)
                                  ) ||
                                  crowdfundingPool.deployed
                                }
                                onChange={(e: IEventOnChange) => {
                                  validateNumberField(
                                    e,
                                    "cliffLength.value",
                                    setFieldValue
                                  );
                                }}
                              />
                            </div>
                          </Tooltip>
                        </Box>
                        <Box sx={{ width: "25%" }}>
                          <SelectField
                            name="cliffLength.periodUnit"
                            label="Period Unit"
                            selectOptions={PERIOD_UNIT_OPTIONS}
                            disabled={
                              !!disabledMessage(
                                "cliffLength.periodUnit",
                                projectDetails,
                                permission
                              ) ||
                              checkDisabledValueUnit(
                                Number(values.TGEPercentage)
                              ) ||
                              crowdfundingPool.deployed
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ width: "50%" }}></Box>
                  </Box>
                </WrappedInput>

                {/* Vesting Frequency */}
                <WrappedInput>
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <DisplayUnitLabel
                          disable={
                            !!disabledMessage(
                              "vesting.frequency.value",
                              projectDetails,
                              permission
                            ) || crowdfundingPool.deployed
                          }
                        >
                          Vesting Frequency
                        </DisplayUnitLabel>
                        <Tooltip
                          title={toolTipUnitVestingMessages("frequency")}
                          placement="top"
                          arrow
                        >
                          <div>
                            <AlertWarningIcon />
                          </div>
                        </Tooltip>
                      </Box>
                      <DisplayUnitLabel
                        disable={
                          !!disabledMessage(
                            "vesting.frequency.value",
                            projectDetails,
                            permission
                          ) || crowdfundingPool.deployed
                        }
                        styles={{ paddingRight: 0 }}
                      >
                        Per
                      </DisplayUnitLabel>
                      <Box sx={{ width: "70%", display: "flex" }}>
                        <Box sx={{ width: "70%", marginRight: "1rem" }}>
                          <Tooltip
                            title={disabledMessage(
                              "vesting.frequency.value",
                              projectDetails,
                              permission
                            )}
                          >
                            <div>
                              <InputField
                                name="frequency.value"
                                label="Number"
                                value={values.frequency?.value ?? ""}
                                disabled={
                                  !!disabledMessage(
                                    "frequency.value",
                                    projectDetails,
                                    permission
                                  ) ||
                                  checkDisabledValueUnit(
                                    Number(values.TGEPercentage)
                                  ) ||
                                  crowdfundingPool.deployed
                                }
                                onChange={(e: IEventOnChange) => {
                                  validateNumberField(
                                    e,
                                    "frequency.value",
                                    setFieldValue
                                  );
                                }}
                              />
                            </div>
                          </Tooltip>
                        </Box>
                        <Box sx={{ width: "25%" }}>
                          <SelectField
                            name="frequency.periodUnit"
                            label="Period Unit"
                            selectOptions={PERIOD_UNIT_OPTIONS}
                            disabled={
                              !!disabledMessage(
                                "frequency.periodUnit",
                                projectDetails,
                                permission
                              ) ||
                              checkDisabledValueUnit(
                                Number(values.TGEPercentage)
                              ) ||
                              crowdfundingPool.deployed
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ width: "50%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", paddingLeft: "5rem" }}>
                          <DisplayUnitLabel
                            disable={
                              !!disabledMessage(
                                "vesting.numberOfRelease",
                                projectDetails,
                                permission
                              ) || crowdfundingPool.deployed
                            }
                          >
                            Number of Release
                          </DisplayUnitLabel>
                          <Tooltip
                            title={toolTipUnitVestingMessages(
                              "numberOfRelease"
                            )}
                            placement="top"
                            arrow
                          >
                            <div>
                              <AlertWarningIcon />
                            </div>
                          </Tooltip>
                        </Box>
                        <Box sx={{ width: "50%", marginRight: "1rem" }}>
                          <Tooltip
                            title={disabledMessage(
                              "vesting.numberOfRelease",
                              projectDetails,
                              permission
                            )}
                          >
                            <div>
                              <InputField
                                name="numberOfRelease"
                                label="Number"
                                value={values.numberOfRelease ?? ""}
                                disabled={
                                  !!disabledMessage(
                                    "numberOfRelease",
                                    projectDetails,
                                    permission
                                  ) ||
                                  checkDisabledValueUnit(
                                    Number(values.TGEPercentage)
                                  ) ||
                                  crowdfundingPool.deployed
                                }
                                onChange={(e: IEventOnChange) => {
                                  validateNumberField(
                                    e,
                                    "numberOfRelease",
                                    setFieldValue
                                  );
                                }}
                              />
                            </div>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </WrappedInput>
                <WrappedInput>
                  {permission.includes(PERMISSION.WRITE) && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "4rem",
                      }}
                    >
                      <Tooltip
                        title={
                          isLoadingVestingTransaction
                            ? "Data is being processed"
                            : ""
                        }
                        placement="top"
                        arrow
                      >
                        <div>
                          <LoadingButton
                            sx={{
                              padding: "9px 32px",
                            }}
                            loading={isLoadingVestingTransaction}
                            disabled={
                              [
                                ProjectStatus.CANCELLED,
                                ProjectStatus.EMERGENCY_CANCELLED,
                              ].includes(status) ||
                              !dirty ||
                              isSubmitting
                            }
                            type="submit"
                          >
                            Submit
                          </LoadingButton>
                        </div>
                      </Tooltip>
                    </Box>
                  )}
                </WrappedInput>
              </>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProjectVestingInfoTab;
