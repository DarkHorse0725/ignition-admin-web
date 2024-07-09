import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import EnterWalletDialog from "../withdrawDialog/dialog/EnterWalletDialog";
import ConfirmWithdraw from "../withdrawDialog/dialog/ConfirmWithdraw";
import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import {
  AlertTypes,
  AllowedNetwork,
  ProjectStatus,
  ProjectTransactionType,
  TransactionKind,
} from "@/types";
import { APIClient } from "@/core/api";
import { useAlertContext } from "@/providers/AlertContext";
import { formatBigNumberToDecimal } from "@/helpers";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { setWithdrawParticipantFeeLoading } from "@/store/features/projectDetailsSlice";
import { useCheckAdminContract } from "@/hooks/useCheckAdminContract";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import {
  SUCCESS_EVENTS,
  USER_FAILED_EVENTS,
  useSocket,
} from "@/providers/SocketContext";
import { LOCKUP } from "@/helpers/constant";

const displayTokenAmount = (amount: number | undefined, symbol: any) => {
  if (amount === undefined) return "TBD";
  const formatAmount = Math.floor(amount * 100) / 100;
  if (!symbol) symbol = formatAmount > 1 ? "Tokens" : "Token";
  return `${formatAmount} ${symbol}`;
};

export const WithdrawParticipantFee = () => {
  const [participantFeeAmount, setParticipantFeeAmount] = useState<number>(0);
  const { current: projectDetails, withdrawParticipantFeeLoading } =
    useSelectorProjectDetail();
  const { pools, network, totalRaise, purchaseToken, _id, vesting, status } =
    projectDetails;
  const { TGEDate } = vesting;
  const crowdfundingPool = pools[1];
  const { contractAddress: poolAddress } = crowdfundingPool;
  const { status: statusConnectMetamask, connect, account } = useMetaMask();
  const isContractAdmin = useCheckAdminContract();
  const [isDisableWithdrawParticipantFee, setIsDisableWithdrawParticipantFee] =
    useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { updateAlert, errorAlertHandler } = useAlertContext();
  const theme = useTheme();
  const { role } = useSelectorAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const [isSuccessWithdraw, setIsSuccessWithdraw] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const isBeforeLockupTime = dayjs().isBefore(
    dayjs(TGEDate).add(Number(LOCKUP), "minutes"),
  );
  const permissionWithdraw = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_WITHDRAW,
  );
  const getTooltipMessage = () => {
    if (
      [ProjectStatus.CANCELLED, ProjectStatus.EMERGENCY_CANCELLED].includes(
        status,
      )
    )
      return "Project is canceled";
    if (withdrawParticipantFeeLoading) return "Data is being processed";
    if (isBeforeLockupTime)
      return "Fee withdrawal is enabled after Lockup time (14 days after TGE Date)";
    if (isDisableWithdrawParticipantFee) return "Already withdraw";
    if (!account) return "Connect wallet to perform this action";
    if (!isContractAdmin)
      return "Your wallet address is not in Factory Contract Admin list";
  };

  const disableButton =
    loadingData ||
    [ProjectStatus.CANCELLED, ProjectStatus.EMERGENCY_CANCELLED].includes(
      status,
    ) ||
    participantFeeAmount === 0 ||
    isDisableWithdrawParticipantFee ||
    !isContractAdmin ||
    withdrawParticipantFeeLoading ||
    status !== ProjectStatus.FINISHED ||
    isBeforeLockupTime ||
    !account;

  useEffect(() => {
    if (!(socket && _id)) return;
    socket.on(SUCCESS_EVENTS.WITHDRAW_PARTICIPATION_FEE, () => {
      updateAlert("", `Transaction success`, AlertTypes.SUCCESS);
      setIsSuccessWithdraw(true);
      dispatch(setWithdrawParticipantFeeLoading(false));
    });

    socket.on(USER_FAILED_EVENTS.WITHDRAW_PARTICIPATION_FEE_FAILED, () => {
      updateAlert("", `Transaction failed`, AlertTypes.ERROR);
      dispatch(setWithdrawParticipantFeeLoading(false));
    });

    return () => {
      socket.off(SUCCESS_EVENTS.WITHDRAW_PARTICIPATION_FEE);
      socket.off(USER_FAILED_EVENTS.WITHDRAW_PARTICIPATION_FEE_FAILED);
    };
  }, [socket, _id]);

  const handleClickOpenWalletDialog = () => {
    setOpenDialog(true);
  };
  const handleClickCloseWalletDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleClickCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setOpenDialog(false);
  };

  const handleBack = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    if (isContractAdmin) return;
    setOpenConfirmDialog(false), setOpenDialog(false);
  }, [isContractAdmin]);

  useEffect(() => {
    (async () => {
      setLoadingData(true);
      const networkLabel = AllowedNetwork[network];

      if (!(purchaseToken && networkLabel && poolAddress)) {
        return;
      }
      const client = APIClient.getInstance();
      const participantFeeClaimedStatus =
        await client.contracts.getParticipationFeeClaimedStatus(
          poolAddress,
          networkLabel,
        );
      setIsDisableWithdrawParticipantFee(participantFeeClaimedStatus);

      if (participantFeeClaimedStatus) {
        setParticipantFeeAmount(0);
        return;
      }

      const _participantFeeAmount =
        await client.contracts.getParticipationFeeAmount(
          poolAddress,
          networkLabel,
        );

      const participantFeeAmount: number = Number(
        formatBigNumberToDecimal(
          _participantFeeAmount as any,
          purchaseToken.decimal,
        ),
      );

      setParticipantFeeAmount(participantFeeAmount);
      setLoadingData(false);
    })();
  }, [isSuccessWithdraw]);

  const handleConfirmWithdrawParticipantFee = async () => {
    if (!_id) {
      return;
    }
    const { ethereum }: any = window;
    if (!poolAddress) {
      return updateAlert(``, `Pool address not found`, AlertTypes.ERROR);
    }
    // No Install
    if (!ethereum) {
      return updateAlert(``, `Metamask not detected`, AlertTypes.ERROR);
    }

    //No connect
    if (statusConnectMetamask === "notConnected") await connect();
    const client = APIClient.getInstance();

    try {
      dispatch(setWithdrawParticipantFeeLoading(true));
      const transactionReceipt: any =
        await client.contracts.claimParticipationFee(
          poolAddress,
          network,
          walletAddress,
        );
      const { hash, nonce } = transactionReceipt;
      if (hash && account) {
        updateAlert("", `Data is being processed`, AlertTypes.WARNING);
        handleClickCloseConfirmDialog();
        const resp = await client.transaction.createTransaction({
          project: _id,
          hash: hash,
          to: account,
          from: poolAddress,
          nonce: nonce,
          chainId: network,
          transactionKind: TransactionKind.PROJECTv2,
          transactionType: ProjectTransactionType.WITHDRAW_PARTICIPATION_FEE,
        });
      } else if (transactionReceipt.status === 500) {
        updateAlert(
          "",
          transactionReceipt.message || transactionReceipt.data.message,
          AlertTypes.ERROR,
        );
      }
    } catch (error) {
      errorAlertHandler(error);
      dispatch(setWithdrawParticipantFeeLoading(false));
    }
  };

  return (
    <Box sx={{ width: 1 / 2 }}>
      <Box
        sx={{
          border: `1px solid ${theme.palette.text.secondary}`,
          borderRadius: "10px",
          padding: "20px",
          height: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "14px",
              lineHeight: "22px",
              color: theme.palette.primary.main,
              marginBottom: 3,
              display: "block",
            }}
            component="span"
          >
            <Typography
              component="span"
              sx={{ color: theme.palette.error.main }}
            >
              *
            </Typography>
            Participant Fee
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              paddingBottom: 2,
              color: theme.palette.text.secondary,
            }}
          >
            <Box component="span">Participant Fee:</Box>
            <Box component="span">
              {displayTokenAmount(participantFeeAmount, purchaseToken?.symbol)}
            </Box>
          </Box>
        </Box>

        {permissionWithdraw.includes(PERMISSION.WRITE) && (
          <Box
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "0.02em",
              color: theme.palette.text.secondary,
              width: 1,
            }}
          >
            <Tooltip title={getTooltipMessage()} placement={"bottom"}>
              <div>
                <LoadingButton
                  color="primary"
                  variant="contained"
                  onClick={handleClickOpenWalletDialog}
                  sx={{
                    width: 1,
                    height: "40px",
                  }}
                  disabled={disableButton}
                  loading={withdrawParticipantFeeLoading}
                >
                  Withdraw
                </LoadingButton>
              </div>
            </Tooltip>
          </Box>
        )}
      </Box>
      <EnterWalletDialog
        open={openDialog}
        onClose={handleClickCloseWalletDialog}
        onConfirm={(formData: any) => {
          if (!formData?.walletAddress) return;
          setWalletAddress(formData.walletAddress);
          handleClickOpenConfirmDialog();
        }}
      />

      <ConfirmWithdraw
        open={openConfirmDialog}
        onClose={handleClickCloseConfirmDialog}
        walletAddress={walletAddress}
        onConfirm={handleConfirmWithdrawParticipantFee}
        amount={displayTokenAmount(participantFeeAmount, purchaseToken?.symbol)}
        network={network}
        onBack={handleBack}
        isSubmitPending={withdrawParticipantFeeLoading}
      />
    </Box>
  );
};
