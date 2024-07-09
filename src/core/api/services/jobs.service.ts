import { AxiosResponse } from 'axios';
import { BaseService } from "./base";
import { Job, JobList } from '@/types';

export class JobsService extends BaseService {
    protected readonly basePath: string = '/jobs';

    async getJobList(): Promise<JobList> {
        const endPoint = this.endPoint();

        const response = await this.client.get<Job[]>(endPoint);

        return {
            data: response?.data ?? [],
            total: response?.data?.length ?? 0,
        };
    }

    async findOne(_id: string): Promise<AxiosResponse<Job>> {
        const endPoint = this.endPoint(`/${_id}`);

        return this.client.get<Job>(endPoint);
    }

    async cancelJob(_id: string): Promise<AxiosResponse<unknown>> {
        const endPoint = this.endPoint(`/${_id}/cancel`);

        return this.client.delete<Job>(endPoint);
    }

    async createJob(createUserDto: Partial<Job>): Promise<AxiosResponse<Job>> {
        const endPoint = this.endPoint('/repeat-every');

        return this.client.post<Job>(endPoint, createUserDto);
    }

    async getJobNames(): Promise<AxiosResponse<any>> {
        const endPoint = this.endPoint('/names');
        
        return this.client.get<any>(endPoint);
    }

}
