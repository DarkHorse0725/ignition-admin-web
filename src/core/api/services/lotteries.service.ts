import { AxiosResponse } from "axios";
import {
  Lottery,
  LotteryEntry,
  LotteryEntryList,
  LotteryEntryResult,
  LotteryEntryResultList,
  LotteryList,
  LotteryListRequestParams,
  LotteryResult,
  Transaction,
  Transactions,
} from "@/types";
import { BaseService } from "./base";

export class LotteriesService extends BaseService {
  protected readonly basePath: string = "/lotteries";

  async list(projectId?: string): Promise<LotteryList> {
    const endPoint = this.endPoint();

    const params = this.generateParams(projectId ? { project: projectId } : {});

    const resp = await this.client.get<Lottery[]>(endPoint, params);

    return {
      data: resp?.data ?? [],
      total: resp?.data?.length ?? 0,
    };
  }

  async findOne(_id: string): Promise<AxiosResponse<Lottery>> {
    const endPoint = this.endPoint(`/${_id}`);
    return this.client.get<Lottery>(endPoint);
  }

  async getEntries(_id: string, limit = 200): Promise<LotteryEntryList> {
    const endPoint = this.endPoint(`/${_id}/entries`);

    const params = this.generateParams({
      limit,
    });

    const resp = await this.client.get<{
      entries: LotteryEntry[];
      total: number;
    }>(endPoint, params);

    return {
      data: resp?.data?.entries ?? [],
      total: resp?.data?.total ?? resp?.data?.entries.length ?? 0,
    };
  }

  async getTransactions(lotteryId: string | undefined): Promise<Transactions> {
    const endPoint = this.endPoint(`/${lotteryId}/transactions`);

    const resp = await this.client.get<Transaction[]>(endPoint);

    return {
      data: resp?.data ?? [],
      total: resp?.data?.length ?? 0,
    };
  }

  async getEntryResults(lotteryId: string): Promise<LotteryEntryResultList> {
    const endPoint = this.endPoint(`/${lotteryId}/entry-results`);
    const params = this.generateParams({
      limit: 200,
    });

    const resp = await this.client.get<{
      entryResults: LotteryEntryResult[];
      total: number;
    }>(endPoint, params);

    return {
      data: resp?.data?.entryResults ?? [],
      total: resp?.data?.total ?? resp?.data?.entryResults.length ?? 0,
    };
  }

  async getResults(_id: string): Promise<AxiosResponse<LotteryResult>> {
    const endPoint = this.endPoint(`/${_id}/results`);
    return this.client.get<LotteryResult>(endPoint);
  }
}
