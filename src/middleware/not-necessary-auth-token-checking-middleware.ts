import {NextFunction, Request, Response} from 'express';
import {JwtService} from "../core/application/jwt.service";
import {ioc} from "../core/index";

const jwtService = ioc.get(JwtService);
export const notNecessaryAuthTokenCheckingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers['authorization'] as string;

        const AuthToken = auth.split(' ')[1];
        const jwtPayload = await jwtService.verifyToken(AuthToken)

        if (jwtPayload?.userId) {
            req.userId = jwtPayload.userId;
        }
    } catch (err) {
    }
    next();
};