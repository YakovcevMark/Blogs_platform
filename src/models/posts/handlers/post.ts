import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../types/post.input.model";
import {postsService} from "../application/posts.service";
import {blogsQueryRepository} from "../../blogs/repositories/query.repository";
import {postsQueryRepository} from "../repositories/query-repo";

export const createPostHandler = async (req: Request<RequestEntityId, PostInputModel>, res: Response) => {
    const blog = await blogsQueryRepository.getById(req.body.blogId);

    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
    }

    const id = await postsService.create(req.body, blog!);

    const post = await postsQueryRepository.getById(id);
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(post)
}