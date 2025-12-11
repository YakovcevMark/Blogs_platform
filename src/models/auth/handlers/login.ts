import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {LoginInputModel} from "../types/login.input.model";
import {usersService} from "../../../core/index";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {REFRESH_TOKEN_COOKIE_NAME} from "../../../core/constants/cookieNames";

export const loginHandler = async (req: Request<{}, LoginInputModel>, res: Response) => {

    const result = await usersService.checkCredentials({
        userLoginOrEmail: req.body.loginOrEmail,
        bodyPassword: req.body.password
    })

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