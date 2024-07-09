import { SelectFieldOption } from "@/components/atoms/SelectField";

export interface UserListRequestParams {
  page: number;
  limit: number;
}

export enum ADMIN_ROLE {
  SUPER_ADMIN = "super_admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export enum USER_ACTIONS {
  ADD_NEW = "addNew",
  EDIT = "edit",
  RESET_PASSWORD = "resetPassword",
  RESET_2_FA = "reset2FA",
  REMOVE_ACCOUNT = "removeAccount",
}

export type ModalText = {
  [key: string]: {
    dialogTitle: string;
    dialogContentText: string;
    actionButtonText: string;
  };
};

export const roleOptions = Object.keys(ADMIN_ROLE).map(
  (currency: string, index: number): SelectFieldOption => {
    return {
      label: currency.toUpperCase(),
      value: currency,
    };
  }
);

export const tableInputFieldStyle = {
  "& .MuiInputBase-root": {
    border: `1px solid grey.300`,
    width: 191,
  },
  "& .MuiInputBase-input": {
    padding: "4px 8px",
    fontSize: 12,
    // lineHeight: 3,
  },
  "& .Mui-error .MuiInputBase-input": {
    borderColor: "error.main",
    "&:not(:focus)": {
      color: `error.main !important`,
    },
  },
};

export const getRole = (role: string) => {
  switch (role) {
    case ADMIN_ROLE.SUPER_ADMIN:
      return "Super Admin";
    case ADMIN_ROLE.EDITOR:
      return "Admin";
    case ADMIN_ROLE.VIEWER:
      return "Viewer";

    default:
      return "Viewer";
  }
};
