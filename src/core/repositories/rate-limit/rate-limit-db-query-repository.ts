import {RateLimitRecordDB} from "../../types/rate-limit-record";
import {injectable} from "inversify";
import {RateLimitRecordModel} from "../../schemas/rate-limit-record-schema";

@injectable()
export class RateLimitsQueryRepository {

    public async getCount(filter: RateLimitRecordDB): Promise<number> {
        const {url, ip, date} = filter;
        return  RateLimitRecordModel.countDocuments({url, ip, date: {$gte: date}});
    }
}