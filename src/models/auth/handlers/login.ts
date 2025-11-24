import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {LoginInputModel} from "../types/login,input.model";
import {usersService} from "../../users/application/users.service";

export const loginHandler = async (req: Request<{}, LoginInputModel>, res: Response) => {

    const isVerified = await usersService.checkCredentials(req.body);

    res.sendStatus(
        isVerified
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.UNAUTHORIZED_401
    )
}