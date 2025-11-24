import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {UserInputModel} from "../types/user.input.model";
import {usersService} from "../application/users.service";

export const createUserHandler = async (req: Request<RequestEntityId, UserInputModel>, res: Response) => {
    const user = await usersService.create(req.body);
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(user)
}