import {Request, Response} from 'express'
import {commentsQueryRepository} from "../repositories/query-repo";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";

export const getCommentByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const comment = await commentsQueryRepository.getById({id:req.params.id});
    if(!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
        return;
    }
    res.send(comment)
}