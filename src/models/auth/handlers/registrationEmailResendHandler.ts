import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {authService} from "../../../core/index";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {getHttpStatusCodeFromResultStatusCode} from "../../../core/utils/get-http-status-code-from-result-status-code";

export const registrationEmailResendHandler = async (req: Request<{}, { email: string }>, res: Response) => {

    const result = await authService.resendEmailConfirmationCode({email: req.body.email});

    if (result.status === SERVICE_RESULT_CODES.OK) {
        res
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return;
    }

    res.status(getHttpStatusCodeFromResultStatusCode(result.status)).send(getErrorRespond(result.extensions));

}