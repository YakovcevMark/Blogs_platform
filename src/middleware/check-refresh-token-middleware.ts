import {NextFunction, Request, Response} from "express";
import {JwtService} from "../core/application/jwt.service";
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {REFRESH_TOKEN_COOKIE_NAME} from "../core/constants/cookieNames";
import {refreshTokensQueryRepository, sessionDevicesQueryRepository} from "../core/index";

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

        const [isTokenPersistInBlackList, payload] = await Promise.all([
            refreshTokensQueryRepository.isTokenPersistInBlackList(token),
            JwtService.verifyToken(token),
        ]);

        if (isTokenPersistInBlackList) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        if (!payload) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }
        const isSessionPersist = await sessionDevicesQueryRepository.isPersistInDb(payload.deviceId)

        if (!isSessionPersist) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        req.userId = payload.userId;
        req.deviceId = payload.deviceId;

        return next();
    } catch (e) {
        return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }
};