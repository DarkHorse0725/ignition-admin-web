import { createContext, useContext, useState } from "react";
import { AlertType, AlertTypes } from "@/types";
import { METAMASK_ERRORS } from "@/core/api/services/contract.service/contract.utils";
import { useRouter } from "next/router";

export const AlertContext = createContext<AlertContextState>(
  {} as AlertContextState
);

export const useAlertContext = () => useContext(AlertContext);

interface AlertProviderProps {
  children: any;
}

interface AlertContextState {
  message: string | string[];
  open: boolean;
  type: AlertType;
  title: string;
  updateAlert: (
    _message: string | string[],
    _title: string,
    _type: AlertType
  ) => void;
  closeAlert: () => void;
  errorAlertHandler: (_result: any, _alert?: boolean) => void;
}

const AlertProvider = ({ children }: AlertProviderProps) => {
  const router = useRouter();
  const [message, setMessage] = useState<string | string[]>("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>(AlertTypes.SUCCESS);
  const [title, setTitle] = useState("Success");
  const closeAlert = () => {
    setOpen(false);
  };

  const updateAlert = (
    _message: string | string[],
    _title: string,
    _type: AlertType
  ) => {
    setOpen(true);
    setMessage(_message);
    setTitle(_title);
    setType(_type);
  };

  const errorAlertHandler = (error: any) => {
    if (!error?.message) return;

    const { status, message } = error;
    if (
      (status >= 400 && status <= 500) ||
      (error.name === "AxiosError" && message)
    ) {
      // Handle error from axios
      updateAlert(message || "Error", "Error", AlertTypes.ERROR);
    } else if (METAMASK_ERRORS[error.code]) {
      // Handle error from metamask
      updateAlert(
        METAMASK_ERRORS[error.code].message,
        "Error",
        AlertTypes.ERROR
      );
    }
  };

  return (
    <AlertContext.Provider
      value={{
        message,
        open,
        type,
        title,
        closeAlert,
        updateAlert,
        errorAlertHandler,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
