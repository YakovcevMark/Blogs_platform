import {UsersRepository} from "../../users/repositories/repo";
import {SmtpManager} from "../../../core/application/smtp.manager";
import {UserDb} from "../../users/types/user.db.model";
import {randomUUID} from "node:crypto";
import {addHours} from "date-fns";

export class AuthService {
    constructor(protected usersRepository: UsersRepository, protected smtpManager: SmtpManager) {
    }

    public register = async (params: { email: string, password: string, login: string }) => {
        const {login, email, password} = params;
        const code = randomUUID()
        const expired_in = addHours(new Date(), 1);

        const newUser: UserDb = {
            login,
            email,
            password,
            createdAt: new Date().toISOString(),
            emailConformation: {
                isConfirmed: false,
                codes: [{
                    code,
                    expired_in
                }]
            }
        }

        this.smtpManager.sendRegistrationCodeEmail({email, code});
        await this.usersRepository.create(newUser);
        return true;
    }

    public confirmCode = async (params: {
        code: string
    }): Promise<'No user found with that code' | 'ok' | 'Code is expired'> => {
        const {code} = params;

        const user = await this.usersRepository.getByCode(code)

        if (!user) return 'No user found with that code'

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

        if (!isCodeConfirmed) {
            return 'Code is expired';
        }

        await this.usersRepository.confirmEmail(String(user._id));
        return 'ok'

    }

    public resendEmailConfirmationCode = async (params: {
        email: string
    }): Promise<'Not found user with that email' | 'User with given email already confirmed' | 'ok'> => {
        const {email} = params;

        const user = await this.usersRepository.getUserByLoginOrEmail(email);

        if (!user) return 'Not found user with that email'
        if (user.emailConformation.isConfirmed) return 'User with given email already confirmed'
        const code = randomUUID()

        const expired_in = addHours(new Date(), 1);


        await this.usersRepository.addConformationCode(String(user._id), code, expired_in);


        this.smtpManager.sendRegistrationCodeEmail({email, code});


        return 'ok';
    }

}