import { MongoDocument } from '../base';

export enum ADMIN_STATUS {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  DELETING = 'deleting',
  DELETED = 'deleted',
  FAILED = 'failed',
}

export const ADMIN_EXIST_ACTIVE = 'active';
export const ADMIN_EXIST_ALL = 'all';
export const ADMIN_PAGE_SIZE = 10;
export const ADMIN_DEFAULT_PAGE = 0;

export enum BTN_STATUS {
  NO_CONNECT,
  NO_PERMISSION,
  BEING_PROCESS,
  ACTIVE,
}

export const BTN_TOOLTIP = {
  [BTN_STATUS.NO_PERMISSION]: 'You do not have permission to perform this action',
  [BTN_STATUS.NO_CONNECT]: 'Please connect wallet to perform this action',
  [BTN_STATUS.BEING_PROCESS]: 'Data is being processed',
}

export enum MESSAGES {
  CONFIRM_DELETE = 'Remove this Wallet Address from Admin Wallet Address List?',
  ADD_SUCCESS = 'Admin has been added successfully',
  DELETE_SUCCESS = 'Admin has been deleted',
}

export enum ACTIONS {
  ADD_ADMIN,
  DELETE_ADMIN,
}

export type AdminExistRole = typeof ADMIN_EXIST_ACTIVE | typeof ADMIN_EXIST_ALL;

export interface AdminListRequestParams {
  network: number;
  page: number;
  status?: string[];
}

export interface Admin extends MongoDocument {
  network: number;
  adminAddress: string;
  status: string;
  txHash: string;
}

export interface AdminList {
  result: Admin[];
  total: number;
}
