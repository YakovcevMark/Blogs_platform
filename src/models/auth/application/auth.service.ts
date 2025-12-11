import {UsersRepository} from "../../users/repositories/repo";
import {SmtpManager} from "../../../core/application/smtp.manager";
import {UserDb} from "../../users/types/user.db.model";
import {randomUUID} from "node:crypto";
import {addHours} from "date-fns";
import {BcryptService} from "../../../core/application/bcrypt.service";
import {Result} from "../../../core/types/service-result-object";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";

export class AuthService {
    constructor(protected usersRepository: UsersRepository, protected smtpManager: SmtpManager) {
    }

    public register = async (params: {
        email: string,
        password: string,
        login: string
    }): Promise<Result<{ newUserId: string } | null>> => {
        const {login, email, password} = params;


        const isUserWithGivenEmailAlreadyExist = await this.usersRepository.isUserWithEmailExist(email)
        const isUserWithGivenLoginAlreadyExist = await this.usersRepository.isUserWithLoginExist(login)

        if (isUserWithGivenEmailAlreadyExist) {
            return {
                status: SERVICE_RESULT_CODES.CLIENT_ERROR,
                errorMessage: 'User with given email already exist',
                extensions: [{field: 'email', message: 'User with given email already exist'}],
            }
        }

        if (isUserWithGivenLoginAlreadyExist) {
            return {
                status: SERVICE_RESULT_CODES.CLIENT_ERROR,
                errorMessage: 'User with given login already exist',
                extensions: [{field: 'login', message: 'User with given email already exist'}],
            }
        }

        const hashedPassword = await BcryptService.genHashedPassword(password);

        const code = randomUUID()
        const expired_in = addHours(new Date(), 1);

        const newUser: UserDb = {
            login,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            emailConformation: {
                isConfirmed: false,
                codes: [{
                    code,
                    expired_in
                }]
            },
            refreshTokens: [],
        }

        this.smtpManager.sendRegistrationCodeEmail({email, code});
        const newUserId = await this.usersRepository.create(newUser);

        return {
            data: {newUserId},
            status: SERVICE_RESULT_CODES.OK,
        }
    }

    public confirmCode = async (params: {
        code: string
    }): Promise<Result<{ isConfirmed: boolean } | null>> => {
        const {code} = params;

        const user = await this.usersRepository.getByCode(code)

        if (!user) return {
            status: SERVICE_RESULT_CODES.CLIENT_ERROR,
            errorMessage: 'No user found with that code',
            extensions: [{message: 'No user found with that code', field: 'code'}],
        }

        const {emailConformation} = user

        let isCodeConfirmed = false;

        emailConformation.codes.forEach((codeObj) => {
            if (isCodeConfirmed) return;
            if (codeObj.code === code) {
                if (codeObj.expired_in > new Date()) {
                    isCodeConfirmed = true;
                    return;
                }
            }
        });

        if (!isCodeConfirmed) return {
            status: SERVICE_RESULT_CODES.CLIENT_ERROR,
            errorMessage: 'Code is expired',
            extensions: [{message: 'Code is expired', field: 'code'}],
        }

        const isEmailConfirmed = await this.usersRepository.confirmEmail(String(user._id));
        if (!isEmailConfirmed) {
            return {
                status: SERVICE_RESULT_CODES.SERVER_ERROR,
                errorMessage: 'error in db repo',
                extensions: [{message: 'Email confirm issue', field: 'repo'}],
            }
        } else {
            return {
                status: SERVICE_RESULT_CODES.OK,
                data: {isConfirmed: true},
            }
        }
    }

    public resendEmailConfirmationCode = async (params: {
        email: string
    }): Promise<Result<{ isCodeAdded: boolean } | null>> => {
        const {email} = params;

        const user = await this.usersRepository.getUserByLoginOrEmail(email);
        if (!user) return {
            status: SERVICE_RESULT_CODES.CLIENT_ERROR,
            errorMessage: 'No user found with given email',
            extensions: [{field: 'email', message: 'No user found with given email'}],
        }

        if (user.emailConformation.isConfirmed) return {
            status: SERVICE_RESULT_CODES.CLIENT_ERROR,
            errorMessage: 'Email has already confirmed',
            extensions: [{field: 'email', message: 'Email has already confirmed'}],
        }

        const code = randomUUID()

        const expired_in = addHours(new Date(), 1);


        const isCodeAdded = await this.usersRepository.addConformationCode(String(user._id), code, expired_in);


        this.smtpManager.sendRegistrationCodeEmail({email, code});

        if (!isCodeAdded) {
            return {
                status: SERVICE_RESULT_CODES.SERVER_ERROR,
                errorMessage: 'error in db repo',
                extensions: [{message: 'add confirm code issue', field: 'repo'}],
            }
        } else {
            return {
                status: SERVICE_RESULT_CODES.OK,
                data: {isCodeAdded: true},
            }
        }

    }

    public logout = async (userId:string, cookieToken: string): Promise<Result> => {

        await this.usersRepository.removeRefreshToken(userId, cookieToken)

        return {
            status: SERVICE_RESULT_CODES.OK
        }
    }
}