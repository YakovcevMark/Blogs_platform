import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {postsQueryRepository} from "../repositories/query-repo";

export const getPostByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const post = await postsQueryRepository.getById(req.params.id);
    if (!post) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
    } else {
        res.send(post);
    }
}