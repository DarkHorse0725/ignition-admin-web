export enum AlertTypes {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

export type AlertType =
  | AlertTypes.SUCCESS
  | AlertTypes.ERROR
  | AlertTypes.WARNING;
