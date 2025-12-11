import {NextFunction, Request, Response} from "express";
import {JwtService} from "../core/application/jwt.service";
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {usersQueryRepository} from "../models/users/repositories/query-repo";
import {REFRESH_TOKEN_COOKIE_NAME} from "../core/constants/cookieNames";

export const checkRefreshTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

        if (!token) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        const [user, payload] = await Promise.all([
            usersQueryRepository.getByRefreshToken(token),
            JwtService.verifyToken({ token }),
        ]);

        if (!user) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        if (!payload) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        req.userId = payload.userId;

        return next();
    } catch (e) {
        return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }
};