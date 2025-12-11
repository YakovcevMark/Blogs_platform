import {UsersRepository} from "../repositories/repo";
import {UserDb} from "../types/user.db.model";
import {UserInputModel} from "../types/user.input.model";
import {BcryptService} from "../../../core/application/bcrypt.service";
import {Result} from "../../../core/types/service-result-object";
import {formatErrors} from "../../../middleware/input-validation-result-middleware";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {JwtService} from "../../../core/application/jwt.service";

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

    public checkCredentials = async ({userLoginOrEmail, bodyPassword}: {
        userLoginOrEmail: string,
        bodyPassword: string
    }): Promise<Result<{ accessToken:string } | null>> => {

        const userDB = await this.usersRepository.getUserByLoginOrEmail(userLoginOrEmail)

        if (!userDB) {
            return {
                status: SERVICE_RESULT_CODES.UNAUTHORIZED,
                errorMessage: 'no such user',
                extensions: [formatErrors({msg: 'no such user', path: 'user'})],
                data: null,
            }
        }


        const isPasswordCorrect = await BcryptService.comparePasswords({
            userPassword: userDB.password,
            bodyPassword
        });

        if (!isPasswordCorrect) {
            return {
                status: SERVICE_RESULT_CODES.UNAUTHORIZED,
                errorMessage: 'password is incorrect',
                extensions: [formatErrors({msg: 'password is incorrect', path: 'user'})],
                data: null,
            }
        } else {
            const accessToken =  await JwtService.createJWT(String(userDB._id));
            return {
                status: SERVICE_RESULT_CODES.OK,
                data: { accessToken },
            }
        }


    }

    public remove = async (id: string): Promise<boolean> => {
        return await this.usersRepository.remove(id);
    }

    public clearDB = async () => {
        return await this.usersRepository.clearDB();
    }

}
