import {Request, Response} from "express";
import {ioc} from "../../../core/index";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {REFRESH_TOKEN_COOKIE_NAME} from "../../../core/constants/cookieNames";
import {AuthService} from "../application/auth.service";

const authService = ioc.get(AuthService);
export const refreshTokenHandler = async (req: Request, res: Response) => {
    const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const result = await authService.refreshToken(req.userId!, token, req.headers.host!, req.ip!, req.deviceId!);

    if (result.status === SERVICE_RESULT_CODES.OK) {
        res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.data?.refreshToken, {httpOnly: true, secure: true});
        res
            .status(HTTP_STATUS_CODES.OK_200)
            .send({
                accessToken: result.data?.accessToken,
            })
        return

    }
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)

}