import {Request, Response} from 'express'
import {commentsService} from "../application/comments.service";
import {CommentsQueryList} from "../types/comments.query.list";
import {matchedData} from "express-validator";

export const getCommentsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as CommentsQueryList;
    const comments = await commentsService.getAll({...req.query, ...queryParamsFromValidator});
    res.send(comments)
}