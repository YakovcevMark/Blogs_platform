import {RateLimitRecordDB} from "../../types/rate-limit-record";
import {injectable} from "inversify";
import {rateLimitsCollection} from "../../../db-settings";

@injectable()
export class RateLimitsRepository {

    public async create(body: RateLimitRecordDB): Promise<string> {
        const result = await rateLimitsCollection.insertOne(body);
        return String(result.insertedId);
    }
}