import { AxiosResponse } from "axios";
import { BaseService } from "./base";
import { Customer, CustomerList } from "@/types";

export class CustomersService extends BaseService {
  protected readonly basePath: string = "/customers";

  async getList(): Promise<CustomerList> {
    const endPoint = this.endPoint();

    const resp = await this.client.get<Customer[]>(endPoint);

    return {
      data: resp?.data ?? [],
      total: resp?.data?.length ?? 0,
    };
  }

  async getCustomerById(id: string): Promise<AxiosResponse<Customer>> {
    const endPoint = this.endPoint(`/${id}`);

    return this.client.get<Customer>(endPoint);
  }

  async create(dto: Partial<Customer>): Promise<AxiosResponse<Customer>> {
    const endPoint = this.endPoint();

    return this.client.post<Customer>(endPoint, dto);
  }

  async update(
    id: string,
    dto: Partial<Customer>,
  ): Promise<AxiosResponse<Customer>> {
    const endPoint = this.endPoint(`/${id}`);

    return this.client.patch<Customer>(endPoint, dto);
  }
}
