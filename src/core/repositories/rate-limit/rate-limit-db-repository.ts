import {RateLimitRecordDB} from "../../types/rate-limit-record";
import {Collection} from "mongodb";

export class RateLimitsRepository {
    constructor(private rateLimitCollection:  Collection<RateLimitRecordDB>) {
    }

    public async create (body: RateLimitRecordDB):Promise<string> {
        const result = await this.rateLimitCollection.insertOne(body);
        return String(result.insertedId);
    }
}