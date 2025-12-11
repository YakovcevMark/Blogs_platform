import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '123';

type JWTPayload = {
    userId: string;
}

export class JwtService {
    static createJWT = async (userId: string): Promise<string> => {
        return jwt.sign({ userId }, secret, {expiresIn: "1d"});
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