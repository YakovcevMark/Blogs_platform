import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {JwtService} from "../core/application/jwt.service";
import {ioc} from "../core/index";

const jwtService = ioc.get(JwtService);
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers['authorization'] as string;
        const token = auth.split(' ')[1];
        const jwtPayload = await jwtService.verifyToken(token)

        if (!jwtPayload?.userId) {
            throw new Error('invalid token');
        }
        if (!jwtPayload?.deviceId) {
            throw new Error('invalid token');
        }

        req.userId = jwtPayload?.userId;
        req.deviceId = jwtPayload?.deviceId;
        next();
    } catch (err) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }
};