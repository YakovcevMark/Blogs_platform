import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {rateLimitsQueryRepository, rateLimitsService} from "../core/index";
import {addSeconds} from "date-fns";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!;
    const url = req.originalUrl;
    const requestsCount = await rateLimitsQueryRepository.getCount({url, ip, date: addSeconds(new Date, -10)})
    if (requestsCount >= 5) {
        res.sendStatus(HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429)
        return;
    }

    await rateLimitsService.create(ip, url)
    next();
};