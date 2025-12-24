import jwt from 'jsonwebtoken';
import {injectable} from "inversify";

const secret = process.env.JWT_SECRET || '123';

type JWTPayload = {
    userId: string;
    deviceId: string;
    iat: Date;
    exp: Date;
}
@injectable()
export class JwtService {
    public createJWT = async (userId: string): Promise<string> => {
        return jwt.sign({userId}, secret, {expiresIn: "10s"});
    }

    public createJWTRefreshToken = async (userId: string, deviceId: string): Promise<string> => {
        return jwt.sign({userId, deviceId}, secret, {expiresIn: "20s"});
    }

    public verifyToken = async (token: string): Promise<JWTPayload | null> => {
        try {
            return jwt.verify(token, secret) as unknown as JWTPayload;
        } catch (e) {
            return null;
        }
    }
}