import { AxiosResponse } from "axios";
import { BaseService } from "./base";
import { SnapshotRecord } from "@/types";

export enum ESnapshotUserType {
  WHALE = 2,
  FAMILY_MEMBER = 1,
  NORMAL_USER = 3,
}

export interface SnapshotParams {
  page?: number;
  limit?: number;
  direction?: "asc" | "desc";
  sort?: string;
  email?: string;
}

export interface ISnapshotData {
  _id: string;
  email: string;
  walletAddress: string;
  numberOfAllocation: string;
  allocationValue: string;
  maxBuy: number;
  kycStatus: boolean;
  userType: ESnapshotUserType;
  project: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ISnapshotListData {
  result: SnapshotRecord[];
  page?: number;
  limit?: number;
  total: number;
}

export interface ISnapshotCreateParams {
  email: string;
  numberOfAllocation: number;
}

type TResponse<T> = [T | null, any];

export class SnapshotService extends BaseService {
  protected readonly basePath: string = "/snapshot";

  async list(
    projectId: string,
    snapshotParams: SnapshotParams,
  ): Promise<AxiosResponse<ISnapshotListData>> {
    const endPoint = this.endPoint(`/${projectId}`);
    const params = this.generateParams(snapshotParams);
    return this.client.get<ISnapshotListData>(endPoint, params);
  }

  async create(
    projectId: string,
    dto: Partial<ISnapshotCreateParams>,
  ): Promise<AxiosResponse<ISnapshotData>> {
    const endPoint = this.endPoint(`/${projectId}`);
    return this.client.post<ISnapshotData>(endPoint, dto);
  }

  async update(
    projectId: string,
    recordId: string,
    dto: Partial<ISnapshotCreateParams>,
  ): Promise<AxiosResponse<ISnapshotData>> {
    const endPoint = this.endPoint(`/${projectId}/${recordId}`);
    return this.client.patch<ISnapshotData>(endPoint, dto);
  }

  async delete(
    projectId: string,
    recordId: string,
  ): Promise<AxiosResponse<ISnapshotData>> {
    const endPoint = this.endPoint(`/${projectId}/${recordId}`);
    return this.client.delete<ISnapshotData>(endPoint);
  }

  async submit(projectId: string): Promise<AxiosResponse<string>> {
    const endPoint = this.endPoint(`/projects/${projectId}/roothash`);
    return this.client.post<string>(endPoint);
  }

  async getSnapshotTime(projectId: string): Promise<AxiosResponse<string>> {
    const endPoint = this.endPoint(`/projects/${projectId}/snapshot-time`);
    return this.client.get<string>(endPoint);
  }

  async cancel(projectId: string): Promise<AxiosResponse<string>> {
    const endPoint = this.endPoint(`/cancel-submitted-snapshot/${projectId}`);
    return this.client.patch<string>(endPoint);
  }

  async getRecordDetails(
    projectId: string,
    email: string,
  ): Promise<AxiosResponse<SnapshotRecord>> {
    const endPoint = this.endPoint(`/snapshot-record`);
    return this.client.post<SnapshotRecord>(endPoint, { email, projectId });
  }
}
