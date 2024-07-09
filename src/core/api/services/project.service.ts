import {
  ProjectDetails,
  ProjectList,
  ProposalInfo,
  Transaction,
  Transactions,
} from "@/types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base";

export class ProjectService extends BaseService {
  protected readonly basePath: string = "/projects";

  async list(
    page: number,
    limit: number,
    searchValue: string
  ): Promise<ProjectList> {
    const endPoint = this.endPoint();
    const params = this.generateParams({
      page: page,
      limit: limit,
      sort: "createdAt",
      direction: "desc",
      searchField: "name",
      searchValue: searchValue,
    });

    const resp = await this.client.get<any>(endPoint, params);
    return {
      data: resp?.data?.result || [],
      total: resp?.data?.total || 0,
    };
  }
  async listAllProjects(): Promise<ProjectList> {
    const endPoint = this.endPoint("?limit=0");
    const resp = await this.client.get<any>(endPoint);
    return {
      data: resp?.data?.result || [],
      total: resp?.data?.total || 0,
    };
  }
  async listPurchaseToken(): Promise<any> {
    const endPoint = "/purchase-token";
    const resp = await this.client.get<any>(endPoint);
    return resp;
  }
  async create(data: ProjectDetails): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint();
    return this.client.post<ProjectDetails>(endPoint, data);
  }

  async update(
    id: string,
    data: ProjectDetails
  ): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint(`/${id}`);
    return this.client.patch<any>(endPoint, data);
  }

  async findOne(
    id: string | undefined
  ): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint(`/${id}/project`);
    return this.client.get<ProjectDetails>(endPoint);
  }

  async publish(id: string): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint(`/${id}/publish`);
    return this.client.patch<ProjectDetails>(endPoint);
  }

  async cancel(id: string): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint(`/${id}/cancel`);
    return this.client.patch<ProjectDetails>(endPoint);
  }

  async getTransactions(projectId: string | undefined): Promise<Transactions> {
    const endPoint = this.endPoint(`/${projectId}/transactions`);
    const resp = await this.client.get<Transaction[]>(endPoint);
    return {
      data: resp?.data ?? [],
      total: resp?.data?.length ?? 0,
    };
  }

  async startSubmitSnapshot(
    projectId: string,
    tx_hash: string
  ): Promise<AxiosResponse<boolean>> {
    const endPoint = this.endPoint(`/${projectId}/start_submit_snapshot`);
    return this.client.post<boolean>(endPoint, { tx_hash });
  }

  async delete(id: string): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint(`/${id}`);
    return this.client.delete<ProjectDetails>(endPoint);
  }

  async getProposalInfo(projectId: string | undefined): Promise<any> {
    const endPoint = this.endPoint(`/${projectId}/get-project-proposal`);
    const resp = await this.client.get<ProposalInfo>(endPoint);
    return resp?.data;
  }

  async approveProposal(
    projectId: string,
    signature: string,
    proposalId: string
  ): Promise<AxiosResponse<any>> {
    const endPoint = this.endPoint(`/${projectId}/approve-proposal`);
    return this.client.post<any>(endPoint, {
      signature,
      proposalId,
    });
  }

  async rejectProposal(
    projectId: string,
    proposalId: string
  ): Promise<AxiosResponse<any>> {
    const endPoint = this.endPoint(`/${projectId}/reject-proposal`);
    return this.client.post<any>(endPoint, {
      signature: "", // doesn't need signature
      proposalId,
    });
  }

}
