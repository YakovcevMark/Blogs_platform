import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {UserInputModel} from "../../users/types/user.input.model";
import {authService} from "../../../core/index";

export const registerNewUserHandler = async (req: Request<{}, UserInputModel>, res: Response) => {
    await authService.register({password: req.body.password, email: req.body.email, login: req.body.login});
    res
        .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)

}