import { BaseService } from "./base";

export class TagService extends BaseService {
  protected readonly basePath: string = "/tags";

  async list(): Promise<any> {
    const endPoint = this.endPoint();
    const resp = await this.client.get<any>(endPoint);
    return {
      data: resp?.data ?? [],
    };
  }
}
