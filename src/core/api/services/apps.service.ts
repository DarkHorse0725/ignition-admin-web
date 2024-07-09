import { App } from "@/types";
import { AppList } from "@/types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base";

export class AppsService extends BaseService {
  protected readonly basePath: string = "/apps";

  async list(): Promise<AppList> {
    const endPoint = this.endPoint();
    const resp = await this.client.get<App[]>(endPoint);
    const data = resp.data || [];
    return {
      data: data,
      total: data.length,
    };
  }

  async findOne(_id: string): Promise<AxiosResponse<App>> {
    const endPoint = this.endPoint(`/${_id}`);
    return this.client.get<App>(endPoint);
  }

  async create(data: Partial<App>): Promise<AxiosResponse<App>> {
    const endPoint = this.endPoint();
    return this.client.post<App>(endPoint, data);
  }

  async update(_id: string, data: Partial<App>): Promise<AxiosResponse<App>> {
    const endPoint = this.endPoint(`/${_id}`);
    return this.client.patch<App>(endPoint, data);
  }

  async remove(_id: string): Promise<AxiosResponse<unknown>> {
    const endPoint = this.endPoint(`/${_id}`);
    return this.client.delete(endPoint);
  }
}
