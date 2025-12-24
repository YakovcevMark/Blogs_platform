import {compare, hash} from "bcrypt";
import {injectable} from "inversify";

@injectable()
export class BcryptService {

    public genHashedPassword = async (password: string): Promise<string> => {
        return await hash(password, 10);
    }

    public comparePasswords = async ({bodyPassword, userPassword}: {
        bodyPassword: string,
        userPassword: string
    }): Promise<boolean> => {
        return await compare(bodyPassword, userPassword);
    }
}