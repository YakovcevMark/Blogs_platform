import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostsQueryRepository} from "../repositories/query-repo";
import {ioc} from "../../../core/index";

const postsQueryRepository = ioc.get(PostsQueryRepository)
export const getPostByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const post = await postsQueryRepository.getById(req.params.id);
    if (!post) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
    } else {
        res.send(post);
    }
}