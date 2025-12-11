import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../../posts/types/post.input.model";
import {postsService} from "../../posts/application/posts.service";
import {blogsQueryRepository} from "../repositories/query.repository";
import {postsQueryRepository} from "../../posts/repositories/query-repo";

export const createPostByBlogIdHandler = async (req: Request<{
    blogId: string
}, Omit<PostInputModel, 'blogId'>>, res: Response) => {

    const blog = await blogsQueryRepository.getById(req.params.blogId)

    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return
    }

    const id = await postsService.create({...req.body, blogId: req.params.blogId}, blog!);
    const post = await postsQueryRepository.getById(id);

    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(post)
}