import {RefreshTokenDB} from "../types/refresh.token.model";
import {addMinutes} from "date-fns";
import {RefreshTokensRepository} from "../repositories/refresh-token-db-repository";

export class RefreshTokensService {

    constructor(private readonly refreshTokensRepository: RefreshTokensRepository) {
    }

    private getTokenForBlackList = (token: string): RefreshTokenDB => {
        return {
            token,
            expireAt: addMinutes(new Date(), 10)
        }
    }

    public addToBlackList = async (token: string): Promise<string> => {
        const blackListToken = this.getTokenForBlackList(token);
        return await this.refreshTokensRepository.saveToken(blackListToken)
    }
}