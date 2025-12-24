import {Request, Response} from "express";
import {ioc} from "../../../core/index";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {REFRESH_TOKEN_COOKIE_NAME} from "../../../core/constants/cookieNames";
import {AuthService} from "../application/auth.service";

const authService = ioc.get(AuthService);
export const logoutHandler = async (req: Request, res: Response) => {
    const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    const result = await authService.logout(token, req.deviceId!, req.userId!);

    if (result.status === SERVICE_RESULT_CODES.OK) {

        res
            .clearCookie(REFRESH_TOKEN_COOKIE_NAME)
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return

    }

    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)

}