import jwt from 'jsonwebtoken';
import {UserViewModel} from "../../models/users/types/user.view.model";

const secret = process.env.JWT_SECRET || '123';

type JWTPayload = {
    userId: string;
}

export class JwtService {

    static createJWT = async (user: UserViewModel): Promise<string> => {
        return jwt.sign({userId: user.id}, secret, {expiresIn: "1d"});
    }

    static verifyToken = async ({token}: { token: string }): Promise<JWTPayload | null> => {
        try {
            const result = jwt.verify(token, secret) as JWTPayload;
            return {
                userId: result.userId
            }
        } catch (e) {
            return null;
        }
    }
}