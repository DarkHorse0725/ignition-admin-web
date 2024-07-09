import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useMetaMask } from "metamask-react";
import io, { Socket } from "socket.io-client";
import {
  COMMON_FAILED_EVENTS,
  SUCCESS_EVENTS,
  PROJECT_FAILED_EVENTS,
  USER_FAILED_EVENTS,
} from "./events";
import { useAlertContext } from "../AlertContext";
import { AlertTypes, EProjectAsyncStatus, ProjectStatus } from "@/types";
import {
  useSelectorContractAdmin,
  useSelectorProjectDetail,
} from "@/store/hook";
import {
  setAdminAddressToDelete,
  setCurrentAction,
  setIsAdminActive,
  setIsProcessing,
  setIsRefetch,
} from "@/store/features/contractAdminSlice";
import { getActionSuccessMessage } from "@/components/screens/setAdmins/SetAdminsValidationSchema";
import {
  setLoadingPoolTransaction,
  setLoadingVestingTransaction,
  setSubmitSnapshotStatus,
  setWithdrawParticipantFeeLoading,
  setWithdrawProjectFeeLoading,
  updateDetails,
  updateTGEDate,
} from "@/store/features/projectDetailsSlice";
import {
  setOpenPoolDialog,
  updatePoolDate,
  setCancelLoading,
  setDeleteLoading,
  setClaimableLoading,
  updateClaimable,
} from "@/store/features/projectDetailsSlice";
import { useRouter } from "next/router";
import { formatDate } from "@/helpers";
export * from "./events";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";
const socketOptions = {
  forceNew: true,
  autoConnect: false,
  transports: ["websocket"],
  reconnection: false,
  query: {},
};

const SocketContext = createContext(
  {} as {
    socket: Socket;
  }
);

const SocketsProvider = ({ children }: any) => {
  const { account } = useMetaMask();
  const { updateAlert } = useAlertContext();
  const dispatch = useDispatch();
  const { current: projectDetails } = useSelectorProjectDetail();
  const {
    isRefetch,
    currentAction,
    adminAddressToDelete,
    isProcessing: isContractAdminProcessing,
  } = useSelectorContractAdmin();
  const prevContractAdminProcessingRef = useRef<boolean>(false);
  const { _id: projectId, status } = projectDetails;
  const router = useRouter();

  const socket = useMemo(() => {
    const _io = io(SOCKET_URL, socketOptions);

    _io.connect().on("connect", () => {
      console.log("socket is connected with id =", _io.id);
    });
    return _io;
  }, []);

  const handleSocketUpdatePoolRes = (data: any, isSuccess: boolean) => {
    if (isSuccess) {
      dispatch(updatePoolDate(data));
    }
    updateAlert(
      "",
      isSuccess ? `Transaction success` : `Transaction failed`,
      isSuccess ? AlertTypes.SUCCESS : AlertTypes.ERROR
    );
    dispatch(setOpenPoolDialog(false));
    dispatch(setLoadingPoolTransaction(false));
  };

  useEffect(() => {
    if (!(socket && projectId)) return;
    socket.on(SUCCESS_EVENTS.SUBMIT_SNAPSHOT_SUCCESS, (data) => {
      updateAlert("", `Transaction success`, AlertTypes.SUCCESS);
      if (data._id === projectId) {
        dispatch(updateDetails(data.project));
      }
    });

    socket.on(SUCCESS_EVENTS.UPDATE_TGE_DATE, (data) => {
      updateAlert("", `Transaction success`, AlertTypes.SUCCESS);
      dispatch(setLoadingVestingTransaction(false));
      dispatch(updateTGEDate(formatDate(data?.newTGEDate)));
    });

    socket.on(PROJECT_FAILED_EVENTS.SUBMIT_SNAPSHOT_FAILED, () => {
      updateAlert("", `Transaction failed`, AlertTypes.ERROR);
      dispatch(setSubmitSnapshotStatus(EProjectAsyncStatus.NONE));
    });

    socket.on(SUCCESS_EVENTS.POOL_END_TIME_UPDATED, (data) => {
      handleSocketUpdatePoolRes(data, true);
    });
    socket.on(
      PROJECT_FAILED_EVENTS.ADJUST_BOTH_POOLS_END_TIME_FAILED,
      (data) => {
        handleSocketUpdatePoolRes(data, false);
      }
    );
    socket.on(PROJECT_FAILED_EVENTS.ADJUST_GALAXY_END_TIME_FAILED, (data) => {
      handleSocketUpdatePoolRes(data, false);
    });
    socket.on(
      PROJECT_FAILED_EVENTS.ADJUST_CROWDFUNDING_END_TIME_FAILED,
      (data) => {
        handleSocketUpdatePoolRes(data, false);
      }
    );

    socket.on(SUCCESS_EVENTS.WITHDRAW_TOKEN_FEE, () => {
      updateAlert("", `Transaction success`, AlertTypes.SUCCESS);
      dispatch(setWithdrawProjectFeeLoading(false));
    });

    socket.on(USER_FAILED_EVENTS.WITHDRAW_TOKEN_FEE_FAILED, () => {
      updateAlert("", `Transaction failed`, AlertTypes.ERROR);
      dispatch(setWithdrawProjectFeeLoading(false));
    });

    socket.on(SUCCESS_EVENTS.WITHDRAW_PARTICIPATION_FEE, () => {
      updateAlert("", `Transaction success`, AlertTypes.SUCCESS);
      dispatch(setWithdrawParticipantFeeLoading(false));
    });

    socket.on(USER_FAILED_EVENTS.WITHDRAW_PARTICIPATION_FEE_FAILED, () => {
      updateAlert("", `Transaction failed`, AlertTypes.ERROR);
      dispatch(setWithdrawParticipantFeeLoading(false));
    });

    return () => {
      socket.off(SUCCESS_EVENTS.SUBMIT_SNAPSHOT_SUCCESS);
      socket.off(PROJECT_FAILED_EVENTS.SUBMIT_SNAPSHOT_FAILED);
      socket.off(SUCCESS_EVENTS.POOL_END_TIME_UPDATED);
      socket.off(SUCCESS_EVENTS.WITHDRAW_TOKEN_FEE);
      socket.off(SUCCESS_EVENTS.WITHDRAW_PARTICIPATION_FEE);
      socket.off(PROJECT_FAILED_EVENTS.ADJUST_BOTH_POOLS_END_TIME_FAILED);
      socket.off(PROJECT_FAILED_EVENTS.ADJUST_CROWDFUNDING_END_TIME_FAILED);
      socket.off(PROJECT_FAILED_EVENTS.ADJUST_GALAXY_END_TIME_FAILED);
      socket.off(USER_FAILED_EVENTS.WITHDRAW_TOKEN_FEE_FAILED);
      socket.off(USER_FAILED_EVENTS.WITHDRAW_PARTICIPATION_FEE_FAILED);
    };
  }, [socket, projectId]);

  // ========== Contract admin socket ==========
  useEffect(() => {
    if (!socket) return;
    socket.emit(SUCCESS_EVENTS.JOIN_ROOM, { room: `Common_contract_admin` });
    socket.on(SUCCESS_EVENTS.GRANT_ADMIN_UPDATED, () => {
      dispatch(setIsProcessing(false));
    });

    socket.on(COMMON_FAILED_EVENTS.GRANT_ADMIN_UPDATED_FAILED, () => {
      updateAlert("", "Transaction Failed", AlertTypes.ERROR);
    });

    return () => {
      socket.off(SUCCESS_EVENTS.GRANT_ADMIN_UPDATED);
      socket.off(COMMON_FAILED_EVENTS.GRANT_ADMIN_UPDATED_FAILED);
    };
  }, [socket]);

  useEffect(() => {
    // Listen to socket event to update table and alert
    if (!isContractAdminProcessing) {
      if (prevContractAdminProcessingRef.current) {
        const message = getActionSuccessMessage(currentAction);
        updateAlert("", message, AlertTypes.SUCCESS);
        dispatch(setIsRefetch(!isRefetch));
        if (
          adminAddressToDelete.toLocaleLowerCase() ===
          account?.toLocaleLowerCase()
        ) {
          dispatch(setIsAdminActive(false));
          dispatch(setAdminAddressToDelete(""));
        }
        dispatch(setCurrentAction(null));
      }
    }
    prevContractAdminProcessingRef.current = isContractAdminProcessing;
  }, [isContractAdminProcessing]);
  // ========== Contract admin socket ==========

  useEffect(() => {
    if (!socket) return;
    if (status === ProjectStatus.FINISHED) {
      socket.on(SUCCESS_EVENTS.SET_PROJECT_CLAIMABLE, (data) => {
        updateAlert(``, `Project has been updated`, AlertTypes.SUCCESS);
        const { claimable } = data;
        dispatch(updateClaimable(claimable));
        dispatch(setClaimableLoading(false));
      });
    }

    if (status === ProjectStatus.FINISHED) {
      socket.on(PROJECT_FAILED_EVENTS.ENABLE_CLAIM_FAILED, () => {
        updateAlert(``, `Transaction failed`, AlertTypes.ERROR);
        dispatch(setClaimableLoading(false));
      });
    }

    if (status === ProjectStatus.FINISHED) {
      socket.on(PROJECT_FAILED_EVENTS.DISABLE_CLAIM_FAILED_FAILED, () => {
        updateAlert(``, `Transaction failed`, AlertTypes.ERROR);
        dispatch(setClaimableLoading(false));
      });
    }

    if (
      status === ProjectStatus.LIVE ||
      status === ProjectStatus.FINISHED ||
      status === ProjectStatus.CANCELLED
    ) {
      socket.on(SUCCESS_EVENTS.PROJECT_CANCELLED, (data) => {
        updateAlert(``, `Project has been cancelled`, AlertTypes.SUCCESS);
        dispatch(updateDetails(data));
        dispatch(setCancelLoading(false));
      });
    }

    if (
      status === ProjectStatus.LIVE ||
      status === ProjectStatus.FINISHED ||
      status === ProjectStatus.CANCELLED
    ) {
      socket.on(PROJECT_FAILED_EVENTS.CANCEL_FAILED, () => {
        updateAlert(``, `Transaction failed`, AlertTypes.ERROR);
        dispatch(setCancelLoading(false));
      });
    }

    if (status === ProjectStatus.LIVE) {
      socket.on(SUCCESS_EVENTS.PROJECT_DELETED, (data) => {
        updateAlert(``, `Project has been deleted`, AlertTypes.SUCCESS);
        dispatch(updateDetails(data));
        dispatch(setDeleteLoading(false));
        router.push("/admin/projects");
      });
    }

    if (status === ProjectStatus.LIVE) {
      socket.on(PROJECT_FAILED_EVENTS.DELETE_FAILED, () => {
        updateAlert(``, `Transaction failed`, AlertTypes.ERROR);
        dispatch(setDeleteLoading(false));
      });
    }

    if (status === ProjectStatus.FINISHED) {
      socket.on(SUCCESS_EVENTS.PROJECT_EMERGENCY_CANCELLED, (data) => {
        updateAlert(``, `Project has been cancelled`, AlertTypes.SUCCESS);
        dispatch(setCancelLoading(false));
        dispatch(updateDetails(data));
      });
    }

    if (status === ProjectStatus.FINISHED) {
      socket.on(PROJECT_FAILED_EVENTS.EMERGENCY_CANCELLED_FAILED, () => {
        updateAlert(``, `Transaction failed`, AlertTypes.ERROR);
        dispatch(setCancelLoading(false));
      });
    }

    return () => {
      socket.off(SUCCESS_EVENTS.PROJECT_CANCELLED);
      socket.off(SUCCESS_EVENTS.PROJECT_DELETED);
      socket.off(SUCCESS_EVENTS.SET_PROJECT_CLAIMABLE);
      socket.off(SUCCESS_EVENTS.PROJECT_EMERGENCY_CANCELLED);
      socket.off(PROJECT_FAILED_EVENTS.ENABLE_CLAIM_FAILED);
      socket.off(PROJECT_FAILED_EVENTS.DISABLE_CLAIM_FAILED_FAILED);
      socket.off(PROJECT_FAILED_EVENTS.CANCEL_FAILED);
      socket.off(PROJECT_FAILED_EVENTS.EMERGENCY_CANCELLED_FAILED);
      socket.off(PROJECT_FAILED_EVENTS.DELETE_FAILED);
    };
  }, [socket, status]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketsProvider;
