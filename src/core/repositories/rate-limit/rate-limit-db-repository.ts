import {RateLimitRecordDB} from "../../types/rate-limit-record";
import {injectable} from "inversify";
import {RateLimitRecordModel} from "../../schemas/rate-limit-record-schema";

@injectable()
export class RateLimitsRepository {

    public async create(dto: RateLimitRecordDB): Promise<string> {
        const entity = new RateLimitRecordModel(dto)
        await entity.save();
        return entity.id
    }
}