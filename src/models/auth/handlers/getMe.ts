import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {usersQueryRepository} from "../../users/repositories/query-repo";

export const getMeHandler = async (req: Request, res: Response) => {

    if (!req.userId) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)
        return;
    }
    const user = await usersQueryRepository.getById({id: req.userId});

    if (!user) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)
        return;
    }

    res
        .status(HTTP_STATUS_CODES.OK_200)
        .send({
            email:user.email,
            login:user.login,
            userId:user.id,
        })

}