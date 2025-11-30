import {Request, Response} from 'express'
import {commentsQueryRepository} from "../repositories/query-repo";
import {RequestEntityId} from "../../../core/types";

export const getCommentByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const comment = await commentsQueryRepository.getById({id:req.params.id});
    res.send(comment)
}