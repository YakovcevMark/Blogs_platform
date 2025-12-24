import {refreshTokensCollection} from "../../../db-settings";
import {injectable} from "inversify";

@injectable()
export class RefreshTokensQueryRepository {

    public isTokenPersistInBlackList = async (token: string): Promise<boolean> => {
        const result = await refreshTokensCollection.countDocuments({token})
        return result > 0
    }

}


