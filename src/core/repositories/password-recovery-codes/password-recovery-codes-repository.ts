import {injectable} from "inversify";
import {passwordRecoveryCodesCollection} from "../../../db-settings";
import {PasswordRecoveryCodeDb} from "../../types/password-recovery-code-db";

@injectable()
export class PasswordRecoveryCodesRepository {

    public async create(dto: PasswordRecoveryCodeDb) {
        const result = await passwordRecoveryCodesCollection.insertOne(dto);
        return String(result.insertedId);
    }

    public async getByCode(code: string) {
        return await passwordRecoveryCodesCollection.findOne({code});
    }


    public async update(dto: Partial<PasswordRecoveryCodeDb>):Promise<boolean> {
        const result =  await passwordRecoveryCodesCollection.updateOne({code: dto.code}, {$set: dto});
        return result.modifiedCount > 0;
    }
}