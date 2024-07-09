import { DatePickerField } from "@/components/atoms/DatePickerField";
import { Dialog } from "@/components/atoms/Dialog";
import InputField from "@/components/atoms/InputField";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { ReactNode, useEffect, useMemo } from "react";
import { addMinutes, compareAsc } from "date-fns";
import {
  InputAdornmentCustom,
  NumberCurrencyInputFormat,
  WrappedInput,
} from "../../components";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import {
  ADMIN_EXIST_ACTIVE,
  PoolStatus,
  PoolTransactionType,
  TransactionKind,
  UpdateConfigPoolDto,
  UpdateTimePoolDto,
} from "@/types";
import {
  checkDisableButtonSubmit,
  checkExistAdmin,
  FieldName,
  getMinDatePoolEndTime,
} from "./poolFunction";
import {
  CONDITION_HOUR,
  UpdateGalaxyPoolStepValidationSchema,
} from "./poolValidation";
import { AlertTypes } from "@/types";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { cleanData, formatDate, regexOnlyNumberAndDecimal } from "@/helpers";
import {
  setLoadingPoolTransaction,
  updatePools,
  updateTGEDate,
} from "@/store/features/projectDetailsSlice";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import {
  removePrefixNumberString,
  validateEnteringInput,
} from "../../projectFunction";
import _ from "lodash";
import { useSelectorProjectDetail } from "@/store/hook";

interface IChangeEvents {
  keyCode: number;
  target: any;
  key: any;
  ctrlKey: any;
  metaKey: any;
  preventDefault: () => any;
}

interface IEditPoolStepProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  setIsOpenNotAdminWalletDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const LabelComponent = ({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: any;
}) => {
  return (
    <Typography color="primary.main" ml="20px" sx={...styles}>
      {children}
    </Typography>
  );
};
const CustomDatePickerField = (props: any) => {
  const { values, setFieldValue } = useFormikContext() as any;
  useEffect(() => {
    if (!values?.tierOpenTime) {
      setFieldValue("crowdfundEndTime", null);
      setFieldValue("endTime", null);
    }
    if (!values?.endTime) {
      setFieldValue("crowdfundEndTime", null);
    }
  }, [setFieldValue, values]);
  return <DatePickerField {...props} />;
};

export const EditPoolStep = (props: IEditPoolStepProps) => {
  const theme = useTheme();
  const { isLoadingPoolTransaction } = useSelectorProjectDetail();
  const { openDialog, handleCloseDialog, setIsOpenNotAdminWalletDialog } =
    props;
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const { status: statusConnectMetamask, connect, account } = useMetaMask();
  const dispatch = useDispatch();
  const currentTime = new Date();
  const { current: projectDetails } = useSelectorProjectDetail();
  const { pools, announcementDate, status, network, _id, vesting } =
    projectDetails;
  const galaxyPool = pools[0];
  const crowdFundingPool = pools[1];

  const checkPoolEndTimeChanged = (
    galaxyEndTime: Date,
    crowdfundingEndTime: Date
  ): boolean => {
    if (galaxyPool.status !== PoolStatus.DEPLOYED) {
      return true;
    }
    if (
      _.isEqual(
        new Date(galaxyPool.galaxyEndTime as any),
        new Date(galaxyEndTime as any)
      ) &&
      _.isEqual(
        new Date(crowdFundingPool.crowdfundingEndTime as any),
        new Date(crowdfundingEndTime as any)
      )
    ) {
      return false;
    }
    return true;
  };
  const checkDisableOpenTimeInput = () => {
    if (isEnableField) {
      return !announcementDate;
    }
    return true;
  };
  const handleSubmit = async (data: any, { setSubmitting, setErrors }: any) => {
    if (
      data.tierOpenTime &&
      data.tierOpenTime?.toString() != galaxyPool.galaxyOpenTime?.toString()
    ) {
      const currentTimePlus30Hours = addMinutes(
        new Date(),
        CONDITION_HOUR * 60
      );
      if (!checkDisableOpenTimeInput) {
        let errorTierOpenTime = `EarlyPool Open Time must be later than ${formatDate(
          new Date(addMinutes(new Date(), CONDITION_HOUR * 60))
        )}`;
        if (compareAsc(currentTimePlus30Hours, data.tierOpenTime) === 1) {
          return setErrors({ tierOpenTime: errorTierOpenTime });
        }
      }
    }
    setSubmitting(true);
    let response = null;
    if ([PoolStatus.DRAFT, PoolStatus.PUBLISHED].includes(galaxyPool.status)) {
      const formatData: UpdateConfigPoolDto = {
        galaxyPool: {
          galaxyRaisePercentage: Number(data.totalRaise),
          galaxyOpenTime: data.tierOpenTime,
          galaxyEndTime: data.endTime,
          galaxyParticipantFee: Number(data.participantFee),
          capLimit: data.galaxyCapLimit,
        },
        crowdfundingPool: {
          earlyAccessPercentage: Number(data.earlyAccessPercentage),
          crowdfundingEndTime: data.crowdfundEndTime,
          crowdfundingParticipantFee: Number(data.crowdfundParticipantFee),
          capLimit: data.capLimit,
        },
      };
      response = await updateConfigPool(projectDetails._id, formatData);
      if (response) {
        if (!data.crowdfundEndTime) {
          dispatch(updateTGEDate(null));
        }
        dispatch(updatePools(response));
      }
    } else {
      response = await updateEndTimePool(galaxyPool.contractAddress as string, {
        galaxyEndTime: data.endTime,
        crowdfundingEndTime: data.crowdfundEndTime,
        projectNetwork: network,
      });
    }
    if (response) {
      handleCloseDialog();
    }
    setSubmitting(false);
  };
  const isEnableField = useMemo(() => {
    if (isLoadingPoolTransaction) return false;
    return (
      (galaxyPool.status === PoolStatus.DRAFT &&
        crowdFundingPool.status === PoolStatus.DRAFT) ||
      (galaxyPool.status === PoolStatus.PUBLISHED &&
        crowdFundingPool.status === PoolStatus.PUBLISHED)
    );
  }, [galaxyPool.status, crowdFundingPool.status]);

  const checkDisableInputForCrowdfundingEndTime = (values: any) => {
    if (crowdFundingPool.status !== PoolStatus.CLOSED) {
      return !values.tierOpenTime || !values.endTime;
    }
    return true;
  };

  const handleTooltipMessage = (
    fieldName: FieldName,
    isEnableField: boolean,
    values?: any
  ) => {
    if (isLoadingPoolTransaction) {
      return "Data is being processed";
    }
    switch (fieldName) {
      case FieldName.OPEN_TIME:
        if (!isEnableField) {
          return `This field is no longer editable due to EarlyPool/OpenPool  status is ${galaxyPool.status}`;
        }
        if (isEnableField && !announcementDate) {
          return `You should specify the project's Announcement date' before setting EarlyPool's opening date`;
        }
        break;
      case FieldName.GALAXY_END_TIME:
        if (galaxyPool.status === PoolStatus.CLOSED) {
          return `This field is no longer editable due to EarlyPool/OpenPool status is ${galaxyPool.status}`;
        }
        if (!!values && !values.tierOpenTime) {
          return `You must specify EarlyPool Open Time first`;
        }
        break;
      case FieldName.CROWDFUNDING_END_TIME:
        if (crowdFundingPool.status === PoolStatus.CLOSED) {
          return `This field is no longer editable due to EarlyPool/OpenPool status is ${galaxyPool.status}`;
        }
        if (!!values && (!values.tierOpenTime || !values.endTime)) {
          return `You must specify the EarlyPool end date first`;
        }
        break;
      default:
        if (!isEnableField) {
          return `This field is no longer editable due to EarlyPool/OpenPool status is ${crowdFundingPool.status}`;
        }
        break;
    }
    return "";
  };

  const updateConfigPool = async (
    projectId: string,
    data: UpdateConfigPoolDto
  ) => {
    const apiClient = APIClient.getInstance();
    const result = await apiClient.pools.updateConfigPool(projectId, data);
    errorAlertHandler(result);
    if (result.status >= 200 && result.status <= 300) {
      updateAlert(``, `Successfully update pool data`, AlertTypes.SUCCESS);
      return result.data;
    }
    return undefined;
  };

  const updateEndTimePool = async (
    poolAddress: string,
    data: UpdateTimePoolDto
  ) => {
    const apiClient = APIClient.getInstance();
    const dto = cleanData(data, {
      removeEmptyStrings: true,
    }) as UpdateTimePoolDto;
    const { ethereum }: any = window;
    // No Install
    if (!ethereum) {
      return updateAlert(``, `Metamask not detected`, AlertTypes.ERROR);
    }
    const provider = new ethers.BrowserProvider(ethereum, "any");
    const { chainId } = await provider.getNetwork();
    let accountConnected: string | null = "";
    if (!poolAddress) {
      return updateAlert(``, `Pool address not found`, AlertTypes.ERROR);
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
      return setIsOpenNotAdminWalletDialog(true);
    }
    const checkGalaxyEndTimeChanged = _.isEqual(
      new Date(galaxyPool.galaxyEndTime as any),
      new Date(data.galaxyEndTime as any)
    );
    const checkCrowdfundingEndTimeChanged = _.isEqual(
      new Date(crowdFundingPool.crowdfundingEndTime as any),
      new Date(data.crowdfundingEndTime as any)
    );
    try {
      dispatch(setLoadingPoolTransaction(true));
      const transactionReceipt: any =
        await apiClient.contracts.updateTimeOfPool(poolAddress, dto);
      const { hash, nonce } = transactionReceipt;
      if (hash && account) {
        const transactionDto = {
          project: _id,
          hash: hash,
          to: account,
          from: poolAddress,
          nonce: nonce,
          chainId: network,
          transactionKind: TransactionKind.POOLv2,
        };
        // check if both end time field is changed
        if (!checkGalaxyEndTimeChanged && !checkCrowdfundingEndTimeChanged) {
          await apiClient.transaction.createTransaction({
            ...transactionDto,
            transactionType: PoolTransactionType.ADJUST_BOTH_POOLS_END_TIME,
          });
        } else if (!checkGalaxyEndTimeChanged) {
          await apiClient.transaction.createTransaction({
            ...transactionDto,
            transactionType: PoolTransactionType.ADJUST_GALAXY_END_TIME,
          });
        } else {
          await apiClient.transaction.createTransaction({
            ...transactionDto,
            transactionType: PoolTransactionType.ADJUST_CROWDFUNDING_END_TIME,
          });
        }
        updateAlert("", "Data is being processed", AlertTypes.WARNING);
        return transactionReceipt;
      } else if (transactionReceipt.status === 500) {
        dispatch(setLoadingPoolTransaction(false));
        return updateAlert(
          ``,
          transactionReceipt.message || transactionReceipt.data.message,
          AlertTypes.ERROR
        );
      }
    } catch (err) {
      dispatch(setLoadingPoolTransaction(false));
      errorAlertHandler(err);
    }
  };

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog} width="700px">
        <Box sx={{ height: "700px", overflow: "scroll" }}>
          <Formik
            validationSchema={UpdateGalaxyPoolStepValidationSchema(
              announcementDate,
              galaxyPool.status,
              status,
              checkDisableOpenTimeInput(),
              vesting?.TGEDate
            )}
            initialValues={{
              totalRaise: galaxyPool.galaxyRaisePercentage || 80,
              tierOpenTime: galaxyPool.galaxyOpenTime
                ? new Date(galaxyPool.galaxyOpenTime)
                : null,
              endTime: galaxyPool.galaxyEndTime
                ? new Date(galaxyPool.galaxyEndTime)
                : null,
              participantFee: galaxyPool.galaxyParticipantFee || 15,
              galaxyCapLimit: galaxyPool.capLimit || 0,
              earlyAccessPercentage: crowdFundingPool.earlyAccessPercentage || 0,
              crowdfundEndTime: crowdFundingPool.crowdfundingEndTime
                ? new Date(crowdFundingPool.crowdfundingEndTime)
                : null,
              crowdfundParticipantFee:
                crowdFundingPool.crowdfundingParticipantFee || 15,
              capLimit: crowdFundingPool.capLimit || 0
            }}
            onSubmit={handleSubmit}
          >
            {({
              values,
              setFieldError,
              setFieldValue,
              setFieldTouched,
              errors,
              touched,
              isSubmitting,
              dirty,
            }) => {
              return (
                <Form>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: theme.palette.primary.main, fontSize: 24 }}
                  >
                    Update Pool
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ fontSize: 14 }}
                    >
                      Project: {projectDetails.name}
                    </Typography>
                  </Typography>
                  <LabelComponent styles={{ fontSize: 20 }}>
                    EarlyPool
                  </LabelComponent>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OTHER,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <InputField
                          placeholder="Pool Raise Percentage"
                          name="totalRaise"
                          label="Pool Raise Percentage (over Total Raise) (%) *"
                          value={values.totalRaise}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OTHER,
                              isEnableField,
                              values
                            )
                          }
                          onKeyDown={(e: IChangeEvents) => {
                            if (
                              !validateEnteringInput(
                                e,
                                regexOnlyNumberAndDecimal(1).test(
                                  removePrefixNumberString("%", e.target.value)
                                )
                              ) ||
                              (e.key === "." && e.target.value === "")
                            ) {
                              if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                                return;
                              }
                              e.preventDefault();
                            }
                          }}
                          InputProps={{
                            inputComponent: NumberCurrencyInputFormat,
                            endAdornment: <InputAdornmentCustom />,
                          }}
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OPEN_TIME,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <CustomDatePickerField
                          name="tierOpenTime"
                          label="Tier Open Time"
                          minDateTime={currentTime}
                          value={values.tierOpenTime}
                          setFieldValue={setFieldValue}
                          setFieldError={setFieldError}
                          setFieldTouched={setFieldTouched}
                          errors={errors}
                          touched={touched}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OPEN_TIME,
                              isEnableField,
                              values
                            )
                          }
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.GALAXY_END_TIME,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <CustomDatePickerField
                          name="endTime"
                          label="End Time"
                          value={values.endTime}
                          setFieldValue={setFieldValue}
                          setFieldError={setFieldError}
                          setFieldTouched={setFieldTouched}
                          errors={errors}
                          touched={touched}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.GALAXY_END_TIME,
                              isEnableField,
                              values
                            ) || isLoadingPoolTransaction
                          }
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OTHER,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <InputField
                          placeholder="Set Fee"
                          name="participantFee"
                          label="Participant Fee (%) *"
                          value={values.participantFee}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OTHER,
                              isEnableField,
                              values
                            )
                          }
                          onKeyDown={(e: IChangeEvents) => {
                            if (
                              !validateEnteringInput(
                                e,
                                regexOnlyNumberAndDecimal(1).test(
                                  removePrefixNumberString("%", e.target.value)
                                )
                              ) ||
                              (e.key === "." && e.target.value === "")
                            ) {
                              if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                                return;
                              }
                              e.preventDefault();
                              return;
                            }
                          }}
                          InputProps={{
                            inputComponent: NumberCurrencyInputFormat,
                            endAdornment: <InputAdornmentCustom />,
                          }}
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OTHER,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <InputField
                          placeholder="Cap Limit"
                          name="galaxyCapLimit"
                          label="Cap Limit"
                          value={values.galaxyCapLimit}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OTHER,
                              isEnableField,
                              values
                            )
                          }
                          onKeyDown={(e: IChangeEvents) => {
                            if (
                              !validateEnteringInput(
                                e,
                                regexOnlyNumberAndDecimal(2).test(e.target.value)
                              )
                            ) {
                              if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                                return;
                              }
                              e.preventDefault();
                              return;
                            }
                          }}
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>

                  <LabelComponent styles={{ fontSize: 20 }}>
                    OpenPool
                  </LabelComponent>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OTHER,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <InputField
                          placeholder="Early Access Percentage"
                          name="earlyAccessPercentage"
                          label="Early Access Percentage (%) *"
                          value={values.earlyAccessPercentage}
                          InputProps={{
                            inputComponent: NumberCurrencyInputFormat,
                            endAdornment: <InputAdornmentCustom />,
                          }}
                          onKeyDown={(e: IChangeEvents) => {
                            if (
                              !validateEnteringInput(
                                e,
                                regexOnlyNumberAndDecimal(1).test(
                                  removePrefixNumberString("%", e.target.value)
                                )
                              ) ||
                              (e.key === "." && e.target.value === "")
                            ) {
                              e.preventDefault();
                              return;
                            }
                          }}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OTHER,
                              isEnableField,
                              values
                            )
                          }
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.CROWDFUNDING_END_TIME,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <CustomDatePickerField
                          name="crowdfundEndTime"
                          label="End Time"
                          minDateTime={
                            !!values.endTime &&
                            getMinDatePoolEndTime(
                              new Date(values.endTime),
                              addMinutes(new Date(values.endTime), 1)
                            )
                          }
                          value={values.crowdfundEndTime}
                          setFieldValue={setFieldValue}
                          setFieldError={setFieldError}
                          setFieldTouched={setFieldTouched}
                          errors={errors}
                          touched={touched}
                          disabled={
                            checkDisableInputForCrowdfundingEndTime(values) ||
                            isLoadingPoolTransaction
                          }
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OTHER,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <InputField
                          placeholder="Set Fee"
                          name="crowdfundParticipantFee"
                          label="Participant Fee (%) *"
                          value={values.crowdfundParticipantFee}
                          InputProps={{
                            inputComponent: NumberCurrencyInputFormat,
                            endAdornment: <InputAdornmentCustom />,
                          }}
                          onKeyDown={(e: IChangeEvents) => {
                            if (
                              !validateEnteringInput(
                                e,
                                regexOnlyNumberAndDecimal(1).test(
                                  removePrefixNumberString("%", e.target.value)
                                )
                              ) ||
                              (e.key === "." && e.target.value === "")
                            ) {
                              if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                                return;
                              }
                              e.preventDefault();
                              return;
                            }
                          }}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OTHER,
                              isEnableField,
                              values
                            )
                          }
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Tooltip
                      title={handleTooltipMessage(
                        FieldName.OTHER,
                        isEnableField,
                        values
                      )}
                    >
                      <div>
                        <InputField
                          placeholder="Cap Limit"
                          name="capLimit"
                          label="Cap Limit"
                          value={values.capLimit}
                          disabled={
                            !!handleTooltipMessage(
                              FieldName.OTHER,
                              isEnableField,
                              values
                            )
                          }
                          onKeyDown={(e: IChangeEvents) => {
                            if (
                              !validateEnteringInput(
                                e,
                                regexOnlyNumberAndDecimal(2).test(e.target.value)
                              )
                            ) {
                              if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                                return;
                              }
                              e.preventDefault();
                              return;
                            }
                          }}
                        />
                      </div>
                    </Tooltip>
                  </WrappedInput>
                  <WrappedInput>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Tooltip
                          title={
                            isLoadingPoolTransaction
                              ? "Data is being processed"
                              : ""
                          }
                          placement="top"
                          arrow
                        >
                          <div>
                            <LoadingButton
                              type="submit"
                              loading={isLoadingPoolTransaction}
                              disabled={
                                !dirty ||
                                isSubmitting ||
                                isLoadingPoolTransaction ||
                                checkDisableButtonSubmit(
                                  galaxyPool.status,
                                  crowdFundingPool.status
                                ) ||
                                !checkPoolEndTimeChanged(
                                  new Date(values.endTime as any),
                                  new Date(values.crowdfundEndTime as any)
                                )
                              }
                              color="primary"
                            >
                              Submit
                            </LoadingButton>
                          </div>
                        </Tooltip>
                      </Box>
                    </Box>
                  </WrappedInput>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Dialog>
    </>
  );
};
