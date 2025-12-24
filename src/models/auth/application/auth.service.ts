import {UsersRepository} from "../../users/repositories/repo";
import {SmtpManager} from "../../../core/application/smtp.manager";
import {UserDb} from "../../users/types/user.db.model";
import {randomUUID} from "node:crypto";
import {addHours} from "date-fns";
import {BcryptService} from "../../../core/application/bcrypt.service";
import {Result} from "../../../core/types/service-result-object";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {RefreshTokensService} from "../../../core/application/refrest-tokens.service";
import {JwtService} from "../../../core/application/jwt.service";
import {SessionDevicesService} from "../../session-devices/application/session-device.service";

export class AuthService {
    constructor(
        protected usersRepository: UsersRepository,
        protected smtpManager: SmtpManager,
        protected refreshTokensService: RefreshTokensService,
        protected sessionDevicesService: SessionDevicesService,
    ) {
    }

    private generateTokens = async (userId: string, deviceId?: string) => {
        const tokenDeviceId = deviceId ?? crypto.randomUUID();
        const accessToken = await JwtService.createJWT(userId);
        const refreshToken = await JwtService.createJWTRefreshToken(userId, tokenDeviceId);
        return {
            accessToken,
            refreshToken
        }
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

    public login = async ({userLoginOrEmail, bodyPassword, deviceName, ip, cookieToken}: {
        userLoginOrEmail: string,
        bodyPassword: string,
        ip: string,
        deviceName: string,
        cookieToken?: string,
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


        let deviceId;

        if (cookieToken) {
            const payload = await JwtService.verifyToken(cookieToken);
            deviceId = payload?.deviceId;
        }

        const tokens = await this.generateTokens(String(userDB._id), deviceId);
        const refreshTokenHeaderAndPayload = await JwtService.verifyToken(tokens.refreshToken);

        if (deviceId) {
            await this.sessionDevicesService.update({
                deviceId,
                expireAt: refreshTokenHeaderAndPayload!.exp,
                title: deviceName,
                ip,
                lastActiveDate: refreshTokenHeaderAndPayload!.iat,
                userId: String(userDB._id)
            })
        } else {
            await this.sessionDevicesService.create({
                deviceId: refreshTokenHeaderAndPayload!.deviceId,
                expireAt: refreshTokenHeaderAndPayload!.exp,
                title: deviceName,
                ip,
                lastActiveDate: refreshTokenHeaderAndPayload!.iat,
                userId: String(userDB._id),
            })
        }

        return {
            status: SERVICE_RESULT_CODES.OK,
            data: tokens,
        }


    }

    public refreshToken = async (userId: string, cookieToken: string, deviceName: string, ip: string, deviceId: string): Promise<Result<{
        accessToken: string,
        refreshToken: string
    } | null>> => {

        const [tokens] = await Promise.all([
            this.generateTokens(userId, deviceId),
            this.refreshTokensService.addToBlackList(cookieToken),
        ])

        const refreshTokenHeaderAndPayload = await JwtService.verifyToken(tokens.refreshToken);

        await this.sessionDevicesService.update({
            deviceId,
            expireAt: refreshTokenHeaderAndPayload!.exp,
            title: deviceName,
            ip,
            lastActiveDate: refreshTokenHeaderAndPayload!.iat,
            userId
        })

        return {
            status: SERVICE_RESULT_CODES.OK,
            data: tokens,
        }

    }

    public logout = async (cookieToken: string, deviceId: string, userId: string): Promise<Result> => {

        await Promise.all([
            this.refreshTokensService.addToBlackList(cookieToken),
            this.sessionDevicesService.remove(deviceId, userId)
        ])

        return {
            status: SERVICE_RESULT_CODES.OK
        }
    }
}