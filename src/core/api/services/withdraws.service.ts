import { AxiosResponse } from "axios";
import { BaseService } from "./base";
import WithdrawType from "@/types/withdraw";

export class WithdrawsService extends BaseService {
  protected readonly basePath: string = "/withdraw";

  async getWithdrawStatus(projectId: string): Promise<AxiosResponse> {
    const endPoint = this.endPoint(`/${projectId}`);
    return this.client.get(endPoint);
  }

  async getWithdrawData(
    withdrawType: WithdrawType,
    projectId: string,
    deploy_by: string
  ): Promise<AxiosResponse> {
    const endPoint = this.endPoint(`/${withdrawType}`);
    const params = this.generateParams({
      withdrawType: withdrawType,
      project: projectId,
      beneficiary: deploy_by,
    });
    const { data } = await this.client.get(endPoint, params);
    return data;
  }
}
