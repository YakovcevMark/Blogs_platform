import {compare, hash} from "bcrypt";

export class BcryptService {

    static genHashedPassword = async (password: string): Promise<string> => {
        return await hash(password, 10);
    }

    static comparePasswords = async ({bodyPassword, userPassword}: {
        bodyPassword: string,
        userPassword: string
    }): Promise<boolean> => {
        return await compare(bodyPassword, userPassword);
    }
}