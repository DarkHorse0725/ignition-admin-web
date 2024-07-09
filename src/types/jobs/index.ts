import { MongoDocument } from "../base";

export interface Job extends MongoDocument {
    /**
     * The name of the job.
     */
    name: string;
    duration?: number;
    /**
     * The type of the job (single|normal).
     */
    type: string;

    /**
     * The job details.
     */
    data: any;

    /**
     * The priority of the job.
     */
    priority: number;

    /**
     * How often the job is repeated using a human-readable or cron format.
     */
    repeatInterval: string | number;
    interval?: string | number;

    /**
     * The timezone that conforms to [moment-timezone](http://momentjs.com/timezone/).
     */
    repeatTimezone: string;

    /**
     * Date/time the job was las modified.
     */
    lastModifiedBy: string;

    /**
     * Date/time the job will run next.
     */
    nextRunAt: Date;

    /**
     * Date/time the job was locked.
     */
    lockedAt: Date;

    /**
     * Date/time the job was last run.
     */
    lastRunAt: Date;

    /**
     * Date/time the job last finished running.
     */
    lastFinishedAt: Date;

    /**
     * The reason the job failed.
     */
    failReason: string;

    /**
     * The number of times the job has failed.
     */
    failCount: number;

    /**
     * The date/time the job last failed.
     */
    failedAt: Date;

    /**
     * Job's state
     */
    disabled: boolean;
}

export interface JobList {
    data: Job[];
    total: number;
}

export enum JobIntervalTypes {
    SECONDS = 'seconds',
    MINUTES = 'minutes',
    HOURS = 'hours',
}

export enum AvailableJobTypes {
    CLOSE_LOTTERIES = 'lotteries.closeLotteries',
    TEST_JOB = 'test.job',
}

export const AllAvailableJobTypes = Object.values(AvailableJobTypes) as AvailableJobTypes[];
export const AllAvailableJobIntervalTypes = Object.values(JobIntervalTypes) as JobIntervalTypes[];
