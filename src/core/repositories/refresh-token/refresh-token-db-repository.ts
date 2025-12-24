import {RefreshTokenDB} from "../../types/refresh.token.model";
import {refreshTokensCollection} from "../../../db-settings";
import {injectable} from "inversify";
@injectable()
export class RefreshTokensRepository {

    public saveToken = async (token: RefreshTokenDB): Promise<string> => {
        const result = await refreshTokensCollection.insertOne(token);
        return String(result.insertedId)
    }

    public isTokenPersistInBlackList = async (token: string): Promise<boolean> => {
        const result = await refreshTokensCollection.findOne({token})
        return Boolean(result?.token)
    }

}


