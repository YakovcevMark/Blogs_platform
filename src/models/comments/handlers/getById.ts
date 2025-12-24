import {Request, Response} from 'express'
import {CommentsQueryRepository} from "../repositories/query-repo";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {ioc} from "../../../core/index";

const commentsQueryRepository = ioc.get(CommentsQueryRepository)
export const getCommentByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const comment = await commentsQueryRepository.getById({id:req.params.id});
    if(!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
        return;
    }
    res.send(comment)
}