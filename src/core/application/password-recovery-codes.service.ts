import {addMinutes} from "date-fns";
import {inject, injectable} from "inversify";
import {
    PasswordRecoveryCodesRepository
} from "../repositories/password-recovery-codes/password-recovery-codes-repository";
import {PasswordRecoveryCodeDb} from "../types/password-recovery-code-db";
import {randomUUID} from "node:crypto";

@injectable()
export class PasswordRecoveryCodesService {

    constructor(@inject(PasswordRecoveryCodesRepository) protected readonly passwordRecoveryCodesRepository: PasswordRecoveryCodesRepository) {
    }

    async create(email: string): Promise<PasswordRecoveryCodeDb> {
        const code = randomUUID()
        const expireAt = addMinutes(new Date(), 10);

        const dto = {
            code,
            expireAt,
            email,
            isActive: true,
        }
        await this.passwordRecoveryCodesRepository.create(dto)

        return dto
    }

    async setIsCodeActiveFalse(code: string): Promise<boolean> {
        return await this.passwordRecoveryCodesRepository.update({code, isActive: false})
    }

}