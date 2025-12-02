import {Request, Response} from 'express'
import {UsersQueryList} from "../types/users.query.list";
import {matchedData} from "express-validator";
import {usersQueryRepository} from "../repositories/query-repo";

export const getUsersHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as UsersQueryList;
    const users = await usersQueryRepository.getAll({...req.query, ...queryParamsFromValidator});
    res.send(users)
}