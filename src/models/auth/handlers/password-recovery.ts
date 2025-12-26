import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {ioc} from "../../../core/index";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {AuthService} from "../application/auth.service";

const authService = ioc.get(AuthService);
export const passwordRecoveryHandler = async (req: Request<{}, { email: string }>, res: Response) => {
    const result = await authService.recoverPassword(req.body.email);

    if (result.status === SERVICE_RESULT_CODES.OK) {
        res
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return
    }

    res.status(result.status).send(getErrorRespond(result.extensions));

}