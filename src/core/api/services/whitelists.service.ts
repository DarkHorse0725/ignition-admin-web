import { Whitelist, WhitelistPageResponse } from "@/types/whitelists";
import { BaseService } from "./base";
import { AxiosResponse } from "axios";

export class WhitelistsService extends BaseService {
  protected readonly basePath: string = "/whitelists";

  async list(project?: string): Promise<WhitelistPageResponse> {
    const endPoint = this.endPoint();
    const param: any =
      project &&
      this.generateParams({
        project: project,
      });
    const resp = await this.client.get<Whitelist[]>(endPoint, param);
    return {
      data: resp?.data ?? [],
      total: resp?.data?.length ?? 0,
    };
  }

  async findOne(_id: string): Promise<AxiosResponse<Whitelist>> {
    const endPoint = this.endPoint(`/${_id}`);
    return this.client.get<Whitelist>(endPoint);
  }

  async create(dto: Partial<Whitelist>): Promise<AxiosResponse<Whitelist>> {
    const endPoint = this.endPoint();
    return this.client.post<Whitelist>(endPoint, dto);
  }

  async update(
    _id: string,
    dto: Partial<Whitelist>
  ): Promise<AxiosResponse<Whitelist>> {
    const endPoint = this.endPoint(`/${_id}`);
    return this.client.patch<Whitelist>(endPoint, dto);
  }
}
