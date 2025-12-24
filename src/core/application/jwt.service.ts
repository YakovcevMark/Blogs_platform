import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '123';

type JWTPayload = {
    userId: string;
    deviceId: string;
    iat: Date;
    exp: Date;
}

export class JwtService {
    static createJWT = async (userId: string): Promise<string> => {
        return jwt.sign({userId}, secret, {expiresIn: "10s"});
    }

    static createJWTRefreshToken = async (userId: string, deviceId: string): Promise<string> => {
        return jwt.sign({userId, deviceId}, secret, {expiresIn: "20s"});
    }

    static verifyToken = async (token: string): Promise<JWTPayload | null> => {
        try {
            return jwt.verify(token, secret) as unknown as JWTPayload;
        } catch (e) {
            return null;
        }
    }
}