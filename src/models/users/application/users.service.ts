import {UsersRepository} from "../repositories/repo";
import {UserDb} from "../types/user.db.model";
import {UserInputModel} from "../types/user.input.model";
import {BcryptService} from "../../../core/application/bcrypt.service";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(BcryptService) protected bcryptService: BcryptService,
    ) {
    }

    async updatePassword(email: string, password: string) {
        return await this.usersRepository.updateByEmail(email, {password});
    }

    public create = async (body: UserInputModel): Promise<string> => {
        const hashedPassword = await this.bcryptService.genHashedPassword(body.password);

        const entity: UserDb = {
            createdAt: new Date().toISOString(),
            password: hashedPassword,
            email: body.email,
            login: body.login,
            emailConformation: {
                codes: [],
                isConfirmed: true,
            },
        }

        return await this.usersRepository.create(entity);
    }

    public remove = async (id: string): Promise<boolean> => {
        return await this.usersRepository.remove(id);
    }

}
