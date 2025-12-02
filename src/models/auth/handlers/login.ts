import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {LoginInputModel} from "../types/login,input.model";
import {JwtService} from "../../../core/application/jwt.service";
import {usersQueryRepository} from "../../users/repositories/query-repo";
import {usersService} from "../../users/application/users.service";

export const loginHandler = async (req: Request<{}, LoginInputModel>, res: Response) => {
    try {
        const user = await usersQueryRepository.getUserByLoginOrEmail(req.body.loginOrEmail);
        if (!user) {
            throw Error('no such user');
        }
        const isPasswordCorrect = await usersService.checkCredentials({user, bodyPassword: req.body.password});
        if (!isPasswordCorrect) {
            throw Error('password incorrect');
        }
        const token = await JwtService.createJWT(user);

        res
            .status(HTTP_STATUS_CODES.OK_200)
            .send({
                accessToken: token,
            })
    } catch (e) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)
    }

}