import {refreshTokensCollection} from "../../db-settings";

export class RefreshTokensQueryRepository {

    public isTokenPersistInBlackList = async (token: string): Promise<boolean> => {
        const result = await refreshTokensCollection.findOne({token})
        return Boolean(result?.token)
    }

}


