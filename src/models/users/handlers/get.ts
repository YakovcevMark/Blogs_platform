import {Request, Response} from 'express'
import {usersService} from "../application/users.service";
import {UsersQueryList} from "../types/users.query.list";
import {matchedData} from "express-validator";

export const getUsersHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as UsersQueryList;
    const users = await usersService.getAll({...req.query, ...queryParamsFromValidator});
    res.send(users)
}