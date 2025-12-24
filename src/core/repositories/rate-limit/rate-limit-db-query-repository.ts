import {RateLimitRecordDB} from "../../types/rate-limit-record";
import {Collection} from "mongodb";

export class RateLimitsQueryRepository {
    constructor(private rateLimitCollection: Collection<RateLimitRecordDB>) {
    }

    public async getCount(filter: RateLimitRecordDB): Promise<number> {
        const {url, ip, date} = filter;
        return await this.rateLimitCollection.countDocuments({url, ip, date: {$gte: date}});
    }
}