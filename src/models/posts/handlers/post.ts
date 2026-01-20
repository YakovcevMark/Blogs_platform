import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../types/post.input.model";
import {PostsService} from "../application/posts.service";
import {BlogsQueryRepository} from "../../blogs/repositories/query.repository";
import {PostsQueryRepository} from "../repositories/query-repo";
import {ioc} from "../../../core/index";

const postsService = ioc.get(PostsService)
const postsQueryRepository = ioc.get(PostsQueryRepository)
const blogsQueryRepository = ioc.get(BlogsQueryRepository)
export const createPostHandler = async (req: Request<RequestEntityId, PostInputModel>, res: Response) => {
    const blog = await blogsQueryRepository.getById(req.body.blogId);

    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
    }

    const id = await postsService.create(req.body, blog!);

    const post = await postsQueryRepository.getById(id,req.userId!);
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(post)
}