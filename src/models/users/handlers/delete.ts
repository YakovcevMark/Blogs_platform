import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {ioc} from "../../../core/index";
import {UsersService} from "../application/users.service";

const usersService = ioc.get(UsersService)
export const deleteUserHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const isRemoved = await usersService.remove(req.params.id);
    res.sendStatus(
        isRemoved
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.NOT_FOUND_404
    )
}