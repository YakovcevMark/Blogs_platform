import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../../posts/types/post.input.model";
import {postsService} from "../../posts/application/posts.service";

export const createPostByBlogIdHandler = async (req: Request<{
    blogId: string
}, Omit<PostInputModel, 'blogId'>>, res: Response) => {
    const post = await postsService.create({...req.body, blogId: req.params.blogId});
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(post)
}