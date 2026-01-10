import {injectable} from "inversify";
import {PasswordRecoveryCodeDb} from "../../types/password-recovery-code-db";
import {PasswordRecoveryCodeModel} from "../../schemas/password-recovery-code-db-schema";

@injectable()
export class PasswordRecoveryCodesRepository {

    public async create(dto: PasswordRecoveryCodeDb) {
        const entity = new PasswordRecoveryCodeModel(dto);
        await entity.save();
        return entity.id;
    }

    public async getByCode(code: string) {
        return PasswordRecoveryCodeModel.findOne({code}).lean();
    }


    public async update(dto: Partial<PasswordRecoveryCodeDb>):Promise<boolean> {
        const result =  await PasswordRecoveryCodeModel.updateOne({code: dto.code}, {$set: dto});
        return result.modifiedCount > 0;
    }
}