import {RateLimitRecordDB} from "../../types/rate-limit-record";
import {injectable} from "inversify";
import {rateLimitsCollection} from "../../../db-settings";

@injectable()
export class RateLimitsQueryRepository {

    public async getCount(filter: RateLimitRecordDB): Promise<number> {
        const {url, ip, date} = filter;
        return await rateLimitsCollection.countDocuments({url, ip, date: {$gte: date}});
    }
}