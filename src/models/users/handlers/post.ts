import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {UserInputModel} from "../types/user.input.model";
import {usersQueryRepository} from "../repositories/query-repo";
import {usersService} from "../../../core/index";

export const createUserHandler = async (req: Request<UserInputModel>, res: Response) => {
    const id = await usersService.create(req.body);
    const user = await usersQueryRepository.getById({id});
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(user)
}