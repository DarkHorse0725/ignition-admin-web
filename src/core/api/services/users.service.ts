import { User, UserFormValue, UserList, UserListRequestParams } from "@/types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base";

export class UsersService extends BaseService {
  protected readonly basePath: string = "/users";

  async list(requestParams: UserListRequestParams): Promise<UserList> {
    const endPoint = this.endPoint();

    const params = this.generateParams(requestParams);

    const resp = await this.client.get<any>(endPoint, params);

    return {
      data: resp?.data?.result ?? [],
      total: resp?.data?.total ?? 0,
    };
  }

  async getProfile(): Promise<AxiosResponse<User>> {
    const endPoint = this.endPoint("/me");
    const resp = await this.client.get<User>(endPoint);
    return resp;
  }

  async create(data: UserFormValue): Promise<AxiosResponse> {
    const endPoint = this.endPoint();
    return this.client.post(endPoint, data);
  }

  async remove(data: Partial<User>): Promise<AxiosResponse> {
    const endPoint = this.endPoint("/delete-user");
    return this.client.delete(endPoint, { data });
  }

  async resetPassword(data: Partial<User>): Promise<AxiosResponse> {
    const endPoint = this.endPoint("/reset-user-password");
    return this.client.post(endPoint, data);
  }

  async reset2FA(data: Partial<User>): Promise<AxiosResponse> {
    const endPoint = this.endPoint("/reset-user-2fa");
    return this.client.post(endPoint, data);
  }

  // update user's email, name, role
  async update(data: UserFormValue): Promise<AxiosResponse> {
    const endPoint = this.endPoint("/user-information");
    return this.client.patch(endPoint, data);
  }
}
