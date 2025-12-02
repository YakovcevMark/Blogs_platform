import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {UserInputModel} from "../types/user.input.model";
import {usersService} from "../application/users.service";
import {usersQueryRepository} from "../repositories/query-repo";

export const createUserHandler = async (req: Request<RequestEntityId, UserInputModel>, res: Response) => {
    const id = await usersService.create(req.body);
    const user = await usersQueryRepository.getById({id});
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(user)
}