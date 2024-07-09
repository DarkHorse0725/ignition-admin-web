import { APIClient } from "@/core/api";
import { formatBigNumberToDecimal } from "@/helpers";
import { AppDispatch } from "@/store";
import {
  AlertTypes,
  AllowedNetwork,
  ProjectStatus,
  ProjectTransactionType,
  TransactionKind,
} from "@/types";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { useAlertContext } from "@/providers/AlertContext";
import ConfirmWithdraw from "../withdrawDialog/dialog/ConfirmWithdraw";
import EnterWalletDialog from "../withdrawDialog/dialog/EnterWalletDialog";
import BigNumber from "bignumber.js";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
import {
  setWithdrawParticipantFeeLoading,
  setWithdrawProjectFeeLoading,
} from "@/store/features/projectDetailsSlice";
import { useDispatch } from "react-redux";
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

export const WithdrawProjectFee = () => {
  const { current: projectDetails, withdrawProjectFeeLoading } =
    useSelectorProjectDetail();
  const {
    pools,
    network,
    totalRaise,
    purchaseToken,
    token,
    _id,
    tokenFee,
    status,
    vesting,
    projectType,
  } = projectDetails;
  const { TGEDate } = vesting;
  const { contractAddress: tokenContractAddress } = token;
  const crowdfundingPool = pools[1];
  const { contractAddress: poolAddress } = crowdfundingPool;
  const { status: statusConnectMetamask, connect, account } = useMetaMask();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [
    isDisabledWithdrawProjectFeeToken,
    setIsDisabledWithdrawProjectFeeToken,
  ] = useState<boolean>(true);
  const { updateAlert, errorAlertHandler } = useAlertContext();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const theme = useTheme();
  const [projectFee, setProjectFee] = useState<number>(0);
  const isBeforeLockupTime = dayjs().isBefore(
    dayjs(TGEDate).add(Number(LOCKUP), "minutes"),
  );
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  const { socket } = useSocket();
  const [isSuccessWithdraw, setIsSuccessWithdraw] = useState<boolean>(false);

  const { role } = useSelectorAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const permissionWithdraw = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_WITHDRAW,
  );

  const isContractAdmin = useCheckAdminContract();
  const handleClickOpenWalletDialog = () => {
    setOpenDialog(true);
  };

  const getTooltipMessage = () => {
    if (
      [ProjectStatus.CANCELLED, ProjectStatus.EMERGENCY_CANCELLED].includes(
        status,
      )
    )
      return "Project is canceled";
    if (withdrawProjectFeeLoading) return "Data is being processed";
    if (isBeforeLockupTime)
      return "Fee withdrawal is enabled after Lockup time (14 days after TGE Date)";
    if (isDisabledWithdrawProjectFeeToken) return "Already withdraw";
    if (!account) return "Connect wallet to perform this action";
    if (!isContractAdmin)
      return "Your wallet address is not in Factory Contract Admin list";
  };

  const disableButton =
    loadingData ||
    [ProjectStatus.CANCELLED, ProjectStatus.EMERGENCY_CANCELLED].includes(
      status,
    ) ||
    purchaseAmount === 0 ||
    projectFee === 0 ||
    isDisabledWithdrawProjectFeeToken ||
    !isContractAdmin ||
    withdrawProjectFeeLoading ||
    status !== ProjectStatus.FINISHED ||
    (projectType === "public_sale" && isBeforeLockupTime) ||
    !account;

  const handleBack = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    if (isContractAdmin) return;
    setOpenConfirmDialog(false), setOpenDialog(false);
  }, [isContractAdmin]);

  useEffect(() => {
    if (!(socket && _id)) return;
    socket.on(SUCCESS_EVENTS.WITHDRAW_TOKEN_FEE, () => {
      updateAlert("", `Transaction success`, AlertTypes.SUCCESS);
      setIsSuccessWithdraw(true);
      dispatch(setWithdrawProjectFeeLoading(false));
    });

    socket.on(USER_FAILED_EVENTS.WITHDRAW_TOKEN_FEE_FAILED, () => {
      updateAlert("", `Transaction failed`, AlertTypes.ERROR);
      dispatch(setWithdrawProjectFeeLoading(false));
    });

    return () => {
      socket.off(SUCCESS_EVENTS.WITHDRAW_TOKEN_FEE);
      socket.off(USER_FAILED_EVENTS.WITHDRAW_TOKEN_FEE_FAILED);
    };
  }, [socket, _id]);

  useEffect(() => {
    const getProjectFee = async () => {
      setLoadingData(true);
      if (!(poolAddress && purchaseToken && totalRaise)) {
        return;
      }
      const networkLabel = AllowedNetwork[network];

      if (!networkLabel) return;
      try {
        const client = APIClient.getInstance();

        const tokenFeeClaimedStatus =
          await client.contracts.getTokenFeeClaimedStatus(
            poolAddress,
            networkLabel,
          );

        setIsDisabledWithdrawProjectFeeToken(tokenFeeClaimedStatus);
        if (tokenFeeClaimedStatus) {
          setProjectFee(0);
          return;
        }

        const _totalPurchasedAmount = await client.contracts.getPurchasedAmount(
          poolAddress,
          networkLabel,
        );

        const totalPurchasedAmount = Number(
          formatBigNumberToDecimal(
            new BigNumber(_totalPurchasedAmount.toString()),
            purchaseToken.decimal,
          ),
        );

        setPurchaseAmount(totalPurchasedAmount);

        if (!totalPurchasedAmount) return;

        const _projectFee = formatBigNumberToDecimal(
          new BigNumber(_totalPurchasedAmount.toString()).dividedBy(
            100 / tokenFee,
          ),
          purchaseToken.decimal,
        );
        setProjectFee(Number(_projectFee));
        setLoadingData(false);
      } catch (error) {
        errorAlertHandler(error);
      }
    };
    getProjectFee();
  }, [isSuccessWithdraw]);

  const handleClickCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setOpenDialog(false);
  };
  const handleClickCloseWalletDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmWithdrawProjectFee = async () => {
    const client = APIClient.getInstance();

    if (!_id || !tokenContractAddress) {
      return;
    }

    const { ethereum }: any = window;
    if (!poolAddress) {
      return updateAlert(``, `Token address not found`, AlertTypes.ERROR);
    }
    // No Install
    if (!ethereum) {
      return updateAlert(``, `Metamask not detected`, AlertTypes.ERROR);
    }

    //No connect
    if (statusConnectMetamask === "notConnected") await connect();

    try {
      dispatch(setWithdrawProjectFeeLoading(true));

      const transactionReceipt: any = await client.contracts.claimTokenFee(
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
          transactionType: ProjectTransactionType.WITHDRAW_TOKEN_FEE,
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
      dispatch(setWithdrawProjectFeeLoading(false));
    }
  };

  return (
    <Box sx={{ width: 1 / 2 }}>
      <Box
        sx={{
          border: `1px solid ${theme.palette.text.secondary}`,
          borderRadius: "10px",
          padding: "20px",
          width: 1,
        }}
      >
        <Box
          sx={{
            fontWeight: 800,
            fontSize: "14px",
            lineHeight: "22px",
            color: theme.palette.primary.main,
            marginBottom: 3,
          }}
        >
          <Typography component="span" sx={{ color: theme.palette.error.main }}>
            *
          </Typography>
          Token Fee
        </Box>
        <Box
          sx={{
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "18px",
            letterSpacing: "0.02em",
            color: theme.palette.text.secondary,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              paddingBottom: 2,
            }}
          >
            <Box>Token Fee:</Box>
            <Box>{displayTokenAmount(projectFee, purchaseToken?.symbol)}</Box>
          </Box>
        </Box>
        {permissionWithdraw.includes(PERMISSION.WRITE) && (
          <Tooltip title={getTooltipMessage()} placement={"bottom"}>
            <span>
              <LoadingButton
                sx={{
                  width: 1,
                  height: "40px",
                }}
                onClick={handleClickOpenWalletDialog}
                disabled={disableButton}
                loading={withdrawProjectFeeLoading}
              >
                Withdraw
              </LoadingButton>
            </span>
          </Tooltip>
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
        onConfirm={handleConfirmWithdrawProjectFee}
        amount={displayTokenAmount(projectFee, purchaseToken?.symbol)}
        network={network}
        onBack={handleBack}
        isSubmitPending={withdrawProjectFeeLoading}
      />
    </Box>
  );
};
