import { AxiosResponse } from "axios";

import { BaseService } from "./base";
import { Transaction, TransactionKind } from "@/types";

export class TransactionService extends BaseService {
  protected readonly basePath: string = "/transactions";

  async createTransaction(
    dto: Partial<Transaction>
  ): Promise<AxiosResponse<Transaction>> {
    const endPoint = this.endPoint();
    return this.client.post<Transaction>(endPoint, dto);
  }

  async getTransaction(
    projectId: string,
    transactionKind: TransactionKind,
    transactionType: string
  ): Promise<AxiosResponse<Transaction>> {
    const endPoint = this.endPoint(`/${projectId}`);
    const params = this.generateParams({
      transactionKind: transactionKind,
      transactionType: transactionType,
    });
    return this.client.get<Transaction>(endPoint, params);
  }

  async getTransactionStatus(
    projectId: string,
    transactionKind: TransactionKind,
    transactionType: string
  ): Promise<AxiosResponse<string>> {
    const endPoint = this.endPoint(`/status/${projectId}`);
    const params = this.generateParams({
      transactionKind: transactionKind,
      transactionType: transactionType,
    });
    return this.client.get<string>(endPoint, params);
  }
}
