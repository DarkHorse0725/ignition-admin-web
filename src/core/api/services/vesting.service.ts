import { ProjectDetails, ProjectVesting } from "@/types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base";

export class VestingService extends BaseService {
  protected readonly basePath: string = "/projects";
  /**
   * Update project vesting
   * endpoint /projects/:id/vesting
   * @param projectId project id
   */
  async updateVesting(
    projectId: string | undefined | null,
    dto: ProjectVesting
  ): Promise<AxiosResponse<ProjectDetails>> {
    const endPoint = this.endPoint(`/${projectId}/vesting`);
    return this.client.patch<ProjectDetails>(endPoint, dto);
  }
}
