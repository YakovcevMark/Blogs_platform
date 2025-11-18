import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../types/post.input.model";
import {postsService} from "../application/posts.service";

export const createPostHandler = async (req: Request<RequestEntityId, PostInputModel>, res: Response) => {
    const post = await postsService.create(req.body);
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(post)
}