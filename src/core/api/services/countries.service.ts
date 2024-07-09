import { Country, CountryList } from "@/types";
import { BaseService } from "./base";
import { AxiosResponse } from "axios";

export class CountriesService extends BaseService {
  protected readonly basePath: string = "/countries";
  async list(limit = 500): Promise<CountryList> {
    const endPoint = this.endPoint();
    const params: any = {
      limit,
    };
    const requestConfig = this.generateParams(params);

    const resp = await this.client.get<Country[]>(endPoint, requestConfig);

    return {
      data: resp?.data ?? [],
      total: resp?.data?.length ?? 0,
    };
  }

  async findOne(_id: string): Promise<Country> {
    const endPoint = this.endPoint(`/${_id}`);
    const resp = await this.client.get<Country>(endPoint);
    return resp.data;
  }

  async create(data: Partial<Country>): Promise<Country> {
    const endPoint = this.endPoint();
    const resp = await this.client.post<Country>(endPoint, data);
    return resp.data;
  }

  async update(_id: string, data: Partial<Country>): Promise<Country> {
    const endPoint = this.endPoint(`/${_id}`);
    const resp = await this.client.patch<Country>(endPoint, data);
    return resp.data;
  }

  async defaultRestrictedCountries(): Promise<Country[]> {
    const endPoint = this.endPoint(`/restricted`);
    const resp = await this.client.get<Country[]>(endPoint);
    return resp?.data || [];
  }
}
