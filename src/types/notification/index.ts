import { MongoDocument } from "../base";

interface NotificationProjectData {
    brand: string;
    name: string;
    _id: string;
}
export interface Notification extends MongoDocument {
    id?: string;
    _id: string;
    project: NotificationProjectData;
    isRead: boolean;
    __v: number;
}

export interface NotificationListRequestParams {
    page: number;
    status?: string;
}

export interface NotificationList {
    data: Notification[];
    total: number;
}