import {UserViewModel} from "../types/user.view.model";
import {usersRepository} from "../repositories/repo";
import {UserDb} from "../types/user.db.model";
import {UserInputModel} from "../types/user.input.model";
import {BcryptService} from "../../../core/application/bcrypt.service";

class UsersService {

    public create = async (body: UserInputModel): Promise<string> => {
        const hashedPassword = await BcryptService.genHashedPassword(body.password);

        const entity: UserDb = {
            createdAt: new Date().toISOString(),
            password: hashedPassword,
            email: body.email,
            login: body.login,
        }

        return await usersRepository.create(entity);
    }

    public checkCredentials = async ({user, bodyPassword}: {
        user: UserViewModel,
        bodyPassword: string
    }): Promise<boolean> => {
        const userDB = await usersRepository.getById(user.id)
        if (!userDB) return false
        return await BcryptService.comparePasswords({
            userPassword: userDB.password,
            bodyPassword
        });
    }

    public remove = async (id: string): Promise<boolean> => {
        return await usersRepository.remove(id);
    }

    public clearDB = async () => {
        return await usersRepository.clearDB();
    }

}

const usersService = new UsersService();

export {
    usersService
}