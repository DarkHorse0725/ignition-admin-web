import { User, UserLoginResponseDTO } from "@/types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base";

export class AuthService extends BaseService {
  protected readonly basePath: string = "/auth";

  async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<UserLoginResponseDTO>> {
    const endPoint = this.endPoint("/validate-user");
    const resp = await this.client.post<UserLoginResponseDTO>(endPoint, {
      email,
      password,
    });
    return resp;
  }

  async loginWithVerificationCode(
    email: string,
    password: string,
    code: string
  ): Promise<AxiosResponse<UserLoginResponseDTO>> {
    const endPoint = this.endPoint("/2fa/authenticate");
    const resp = await this.client.post<UserLoginResponseDTO>(endPoint, {
      email,
      password,
      twoFactorAuthenticationCode: code,
    });
    return resp;
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    cfNewPassword: string
  ) {
    const endPoint = this.endPoint("/change-password");
    const resp = await this.client.post<UserLoginResponseDTO>(endPoint, {
      currentPassword: oldPassword,
      newPassword,
      reEnterNewPassword: cfNewPassword,
    });
    return resp;
  }

  async generateQRCode() {
    const endPoint = this.endPoint("/2fa/generate");
    const resp = await this.client.post(endPoint);
    return resp;
  }

  async verifyAuthenticationCode(code: string) {
    const endPoint = this.endPoint("/2fa/verify");
    const resp = await this.client.post<UserLoginResponseDTO>(endPoint, {
      twoFactorAuthenticationCode: code,
    });
    return resp;
  }
}
