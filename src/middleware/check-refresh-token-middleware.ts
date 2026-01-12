import {NextFunction, Request, Response} from "express";
import {JwtService} from "../core/application/jwt.service";
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {REFRESH_TOKEN_COOKIE_NAME} from "../core/constants/cookieNames";
import {ioc} from "../core/index";
import {SessionDevicesRepository} from "../models/session-devices/repositories/repo";

const jwtService = ioc.get(JwtService);
const sessionDevicesRepository = ioc.get(SessionDevicesRepository)

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

        const payload = await jwtService.verifyToken(token);
        if (!payload) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        const session = await sessionDevicesRepository.getByDeviceId(payload.deviceId)
        if (!session) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        if (session.lastActiveDate.getTime() !== payload.iat * 1000) {
            return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        }

        req.userId = payload.userId;
        req.deviceId = payload.deviceId;

        return next();
    } catch (e) {
        return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }
};