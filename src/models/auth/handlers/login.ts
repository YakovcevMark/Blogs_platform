import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {LoginInputModel} from "../types/login,input.model";
import {usersService} from "../../users/application/users.service";
import {JwtService} from "../../../core/application/jwtService";

export const loginHandler = async (req: Request<{}, LoginInputModel>, res: Response) => {

    const user = await usersService.checkCredentials(req.body);

    if (!user) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)
        return;
    }

    const token = await JwtService.createJWT(user);

    res
        .status(HTTP_STATUS_CODES.OK_200)
        .send({
            accessToken: token,
        })

}