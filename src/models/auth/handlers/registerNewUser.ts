import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {UserInputModel} from "../../users/types/user.input.model";
import {ioc} from "../../../core/index";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {getHttpStatusCodeFromResultStatusCode} from "../../../core/utils/get-http-status-code-from-result-status-code";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";
import {AuthService} from "../application/auth.service";

const authService = ioc.get(AuthService);
export const registerNewUserHandler = async (req: Request<{}, UserInputModel>, res: Response) => {

    const result = await authService.register({
        password: req.body.password,
        email: req.body.email,
        login: req.body.login
    });

    if (result.status === SERVICE_RESULT_CODES.OK) {
        res
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return
    }
    console.log(getErrorRespond(result.extensions));
    res.status(getHttpStatusCodeFromResultStatusCode(result.status)).send(getErrorRespond(result.extensions));

}