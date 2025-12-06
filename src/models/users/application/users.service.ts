import {UserViewModel} from "../types/user.view.model";
import {UsersRepository} from "../repositories/repo";
import {UserDb} from "../types/user.db.model";
import {UserInputModel} from "../types/user.input.model";
import {BcryptService} from "../../../core/application/bcrypt.service";

export class UsersService {
    constructor(protected usersRepository: UsersRepository) {
    }

    public create = async (body: UserInputModel): Promise<string> => {
        const hashedPassword = await BcryptService.genHashedPassword(body.password);

        const entity: UserDb = {
            createdAt: new Date().toISOString(),
            password: hashedPassword,
            email: body.email,
            login: body.login,
            emailConformation: {
                codes: [],
                isConfirmed: true,
            }
        }

        return await this.usersRepository.create(entity);
    }

    public checkCredentials = async ({user, bodyPassword}: {
        user: UserViewModel,
        bodyPassword: string
    }): Promise<boolean> => {
        const userDB = await this.usersRepository.getById(user.id)
        if (!userDB) return false
        return await BcryptService.comparePasswords({
            userPassword: userDB.password,
            bodyPassword
        });
    }

    public remove = async (id: string): Promise<boolean> => {
        return await this.usersRepository.remove(id);
    }

    public clearDB = async () => {
        return await this.usersRepository.clearDB();
    }

}
