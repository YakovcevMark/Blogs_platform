import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../types/post.input.model";
import {PostsService} from "../application/posts.service";
import {ioc} from "../../../core/index";

const postsService = ioc.get(PostsService)
export const updatePostHandler = async (req: Request<RequestEntityId, PostInputModel>, res: Response) => {
    const isUpdated = await postsService.update(req.params.id, req.body);
    res.sendStatus(
        isUpdated
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.NOT_FOUND_404
    )
}