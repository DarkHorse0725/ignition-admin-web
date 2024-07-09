import { AxiosResponse } from "axios";
import { BaseService } from "./base";
import { Partner, PartnerDto, PartnerList } from "@/types";

export class PartnersService extends BaseService {
  protected readonly basePath: string = "/partners";

  public async find(): Promise<PartnerList> {
    const endPoint = this.endPoint();
    const resp = await this.client.get<Partner[]>(endPoint);
    const data = resp.data || [];
    return {
      data: data,
      total: data.length,
    };
  }

  public async findOne(id: string): Promise<AxiosResponse<Partner>> {
    const endPoint = this.endPoint(`/${id}`);
    return this.client.get<Partner>(endPoint);
  }

  public async create(dto: PartnerDto): Promise<AxiosResponse<Partner>> {
    const endPoint = this.endPoint();
    return this.client.post<Partner>(endPoint, dto);
  }

  public async update(
    id: string,
    dto: PartnerDto,
  ): Promise<AxiosResponse<Partner>> {
    const endPoint = this.endPoint(`/${id}`);
    return this.client.patch<Partner>(endPoint, dto);
  }
}
