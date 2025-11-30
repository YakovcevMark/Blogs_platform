import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";

export const getMeHandler = async (req: Request, res: Response) => {

    if (!req.user) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)
        return;
    }

    res
        .status(HTTP_STATUS_CODES.OK_200)
        .send(req.user)

}