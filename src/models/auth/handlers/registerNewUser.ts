import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {UserInputModel} from "../../users/types/user.input.model";
import {authService} from "../../../core/index";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";
import {usersQueryRepository} from "../../users/repositories/query-repo";

export const registerNewUserHandler = async (req: Request<{}, UserInputModel>, res: Response) => {

    const isUserWithGivenEmailAlreadyExist = await usersQueryRepository.isUserWithEmailExist(req.body.email)
    const isUserWithGivenLoginAlreadyExist = await usersQueryRepository.isUserWithLoginExist(req.body.login)

    if (isUserWithGivenEmailAlreadyExist) {
        res
            .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
            .send(
                getErrorRespond(
                    [{field: 'email', message: 'User with given email already exist'}],
                )
            )
        return
    }


    if (isUserWithGivenLoginAlreadyExist) {
        res
            .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
            .send(
                getErrorRespond(
                    [{field: 'login', message: 'User with given login already exist'}],
                )
            )
        return
    }


    await authService.register({
        password: req.body.password,
        email: req.body.email,
        login: req.body.login
    });


    res
        .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)

}