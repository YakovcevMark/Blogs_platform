import {Request, Response} from 'express'
import {CommentsQueryList} from "../types/comments.query.list";
import {matchedData} from "express-validator";
import {postsQueryRepository} from "../../posts/repositories/query-repo";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {commentsQueryRepository} from "../repositories/query-repo";

export const getCommentsHandler = async (req: Request<{ postId: string }>, res: Response) => {
    const isPersistInDb = await postsQueryRepository.isPersistInDb(req.params.postId);
    if (!isPersistInDb) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
        return;
    }
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as CommentsQueryList;
    const comments = await commentsQueryRepository.getAll({...req.params, ...req.query, ...queryParamsFromValidator});
    res.send(comments)
}