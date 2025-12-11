import {UsersRepository} from "../repositories/repo";
import {UserDb} from "../types/user.db.model";
import {UserInputModel} from "../types/user.input.model";
import {BcryptService} from "../../../core/application/bcrypt.service";
import {Result} from "../../../core/types/service-result-object";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {JwtService} from "../../../core/application/jwt.service";

export class UsersService {
    constructor(protected usersRepository: UsersRepository) {
    }

    private generateTokens = async (userId: string) => {
        const accessToken = await JwtService.createJWT(userId);
        const refreshToken = await JwtService.createJWTRefreshToken(userId);
        return {
            accessToken,
            refreshToken
        }
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
            },
            refreshTokens: []
        }

        return await this.usersRepository.create(entity);
    }

    public checkCredentials = async ({userLoginOrEmail, bodyPassword}: {
        userLoginOrEmail: string,
        bodyPassword: string
    }): Promise<Result<{ accessToken: string, refreshToken: string } | null>> => {

        const userDB = await this.usersRepository.getUserByLoginOrEmail(userLoginOrEmail)

        if (!userDB) {
            return {
                status: SERVICE_RESULT_CODES.UNAUTHORIZED,
                errorMessage: 'no such user',
                extensions: [{message: 'no such user', field: 'user'}],
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
                extensions: [{message: 'password is incorrect', field: 'user'}],
                data: null,
            }
        }

        const tokens = await this.generateTokens(String(userDB._id));
        await this.usersRepository.addRefreshToken(String(userDB._id), tokens.refreshToken)
        return {
            status: SERVICE_RESULT_CODES.OK,
            data: tokens,
        }


    }


    public refreshToken = async (userId: string, cookieToken:string): Promise<Result<{
        accessToken: string,
        refreshToken: string
    } | null>> => {

        const tokens = await this.generateTokens(userId);

        await Promise.all([
            this.usersRepository.removeRefreshToken(userId, cookieToken),
            this.usersRepository.addRefreshToken(userId, tokens.refreshToken)
        ]);

        return {
            status: SERVICE_RESULT_CODES.OK,
            data: tokens,
        }

    }


    public remove = async (id: string): Promise<boolean> => {
        return await this.usersRepository.remove(id);
    }

    public clearDB = async () => {
        return await this.usersRepository.clearDB();
    }

}
