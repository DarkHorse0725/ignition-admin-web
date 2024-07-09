import { AxiosResponse } from "axios";
import { BaseService } from "./base";
import { NotificationListRequestParams, NotificationList } from "@/types";

export class NotificationService extends BaseService {
    protected readonly basePath: string = "/notifications";

    async list(requestParams: NotificationListRequestParams): Promise<NotificationList> {
        const endPoint = this.endPoint();
        const defaultParams = {
            limit: 10,
            sort: "createdAt",
            direction: "desc",
        }
        const params = this.generateParams({ ...defaultParams, ...requestParams });

        const resp = await this.client.get<any>(endPoint, params);

        return {
            data: resp?.data?.result ?? [],
            total: resp?.data?.total ?? 0,
        };
    }

    async getNumberOfUnread(): Promise<number> {
        const endPoint = this.endPoint(`/count`);
        const resp = await this.client.get<any>(endPoint);
        return resp.data ?? 0;
    }

    async markAsRead(notificationId: string): Promise<AxiosResponse> {
        const endPoint = this.endPoint(`/${notificationId}/mask-as-read`);
        return this.client.post(endPoint);
    }

    async markAsUnread(notificationId: string): Promise<AxiosResponse> {
        const endPoint = this.endPoint(`/${notificationId}/mask-as-unread`);
        return this.client.post(endPoint);
    }

    async markAllAsRead(): Promise<AxiosResponse> {
        const endPoint = this.endPoint(`/mark-all-as-read`);
        return this.client.post(endPoint);
    }
}
