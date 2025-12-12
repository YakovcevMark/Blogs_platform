import {Request, Response} from "express";
import {authService} from "../../../core/index";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {REFRESH_TOKEN_COOKIE_NAME} from "../../../core/constants/cookieNames";

export const logoutHandler = async (req: Request, res: Response) => {
    const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    const result = await authService.logout(token)

    if (result.status === SERVICE_RESULT_CODES.OK) {

        res
            .clearCookie(REFRESH_TOKEN_COOKIE_NAME)
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return

    }

    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)

}