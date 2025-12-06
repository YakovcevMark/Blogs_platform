import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {authService} from "../../../core/index";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";

export const confirmRegistrationHandler = async (req: Request<{}, { code: string }>, res: Response) => {
    const result = await authService.confirmCode({code: req.body.code});

    if (result !== 'ok') {
        res
            .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
            .send(
                getErrorRespond(
                    [{field: 'code', message: result}],
                )
            )
    }

    res
        .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)

}