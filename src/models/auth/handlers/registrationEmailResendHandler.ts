import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {authService} from "../../../core/index";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";
import {usersQueryRepository} from "../../users/repositories/query-repo";

export const registrationEmailResendHandler = async (req: Request<{}, { email: string }>, res: Response) => {
    const isUserWithGivenEmailAlreadyExist = await usersQueryRepository.isUserWithEmailExist(req.body.email)

    if (!isUserWithGivenEmailAlreadyExist) {
        res
            .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
            .send(
                getErrorRespond(
                    [{field: 'email', message: 'No user found with given email'}],
                )
            )
        return
    }

    const isEmailCodeHasSend = await authService.resendEmailConfirmationCode({email: req.body.email});

    if (isEmailCodeHasSend) {
        res
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return;
    }


    res
        .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
        .send(
            getErrorRespond(
                [{field: 'email', message: 'Email has already confirmed'}],
            )
        )


}