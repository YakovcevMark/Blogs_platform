import {Request, Response} from 'express'
import {UsersQueryList} from "../types/users.query.list";
import {matchedData} from "express-validator";
import {UsersQueryRepository} from "../repositories/query-repo";
import {ioc} from "../../../core/index";

const usersQueryRepository = ioc.get(UsersQueryRepository)
export const getUsersHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as UsersQueryList;
    const users = await usersQueryRepository.getAll({...req.query, ...queryParamsFromValidator});
    res.send(users)
}