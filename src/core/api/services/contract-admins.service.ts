import { AxiosResponse } from "axios";
import { Admin, AdminExistRole, AdminList, AdminListRequestParams, ADMIN_PAGE_SIZE } from "@/types";
import { BaseService } from "./base";

export class ContractAdminsService extends BaseService {
  protected readonly basePath: string = '/contract-admins';

  async getAdmins(requestParams: AdminListRequestParams, limit = ADMIN_PAGE_SIZE): Promise<AdminList> {
    const endPoint = this.endPoint();
    const newLimit = limit <= 0 ? ADMIN_PAGE_SIZE : limit;

    const { page, network, status } = requestParams;

    const params = this.generateParams({
      page: page + 1,
      limit: newLimit,
      network: network,
      ...(status ? { status } : {}),
      sort: 'updatedAt',
      direction: 'desc',
    });

    const resp = await this.client.get<AdminList>(endPoint, {
      ...params,
      paramsSerializer: {
        indexes: null, // remove indexes, default is false
      }
    });
    return {
      result: resp?.data?.result || [],
      total: resp?.data?.total || 0
    }
  }


  async create(data: Partial<Admin>): Promise<AxiosResponse> {
    const endPoint = this.endPoint();
    return this.client.post(endPoint, data);
  }

  async remove(data: Partial<Admin>): Promise<AxiosResponse> {
    const endPoint = this.endPoint('/deleted');
    return this.client.delete(endPoint, { data });
  }

  async isExisted(role: AdminExistRole, data: Partial<Admin>): Promise<AxiosResponse> {
    const endPoint = this.endPoint(`/existed/${role}`);
    const params = this.generateParams({
      ...data,
    });
    return this.client.get(endPoint, params);
  }
}
