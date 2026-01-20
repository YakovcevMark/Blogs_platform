import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {PostInputModel} from "../../posts/types/post.input.model";
import {PostsService} from "../../posts/application/posts.service";
import {PostsQueryRepository} from "../../posts/repositories/query-repo";
import {ioc} from "../../../core/index";
import {BlogsQueryRepository} from "../repositories/query.repository";

const postsService = ioc.get(PostsService)
const postsQueryRepository = ioc.get(PostsQueryRepository)
const blogsQueryRepository = ioc.get(BlogsQueryRepository)
export const createPostByBlogIdHandler = async (req: Request<{
    blogId: string
}, Omit<PostInputModel, 'blogId'>>, res: Response) => {

    const blog = await blogsQueryRepository.getById(req.params.blogId)

    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return
    }

    const id = await postsService.create({...req.body, blogId: req.params.blogId}, blog!);
    const post = await postsQueryRepository.getById(id, req.userId!);

    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(post)
}