import {RateLimitsRepository} from "../repositories/rate-limit/rate-limit-db-repository";

export class RateLimitsService {
    constructor(protected rateLimitsRepository: RateLimitsRepository) {
    }
    public async create(ip: string, url:string): Promise<String> {
        return await this.rateLimitsRepository.create({
            ip,
            date: new Date(),
            url
        })
    }
}