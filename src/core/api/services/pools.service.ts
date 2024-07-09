import { Pool, UpdateConfigPoolDto } from "@/types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base";

export class PoolService extends BaseService {
  protected readonly basePath: string = "/projects";
  /**
   * Update crowdfunding pool
   * endpoint /projects/:id/pools/crowdfunding
   * @param projectId project id
   */
  async updateConfigPool(
    projectId: string | undefined | null,
    dto: UpdateConfigPoolDto,
  ): Promise<AxiosResponse<Pool[]>> {
    const endPoint = this.endPoint(`/${projectId}/pools`);
    return this.client.patch<Pool[]>(endPoint, dto);
  }
}
