import {Request, Response} from 'express'
import {matchedData} from "express-validator";
import {postsService} from "../../posts/application/posts.service";
import {PostsQueryList} from "../../posts/types/posts.query.list";
import {blogsService} from "../application/blogs.service";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";

export const getPostsByBlogIdHandler = async (req: Request<{ blogId: string }>, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as Omit<PostsQueryList, 'blogId'>;

    const isBlogPersistInDb = await blogsService.isPersistInDb(req.params.blogId)

    if (!isBlogPersistInDb) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blogs = await postsService.getAll({...queryParamsFromValidator, blogId: req.params.blogId});
    res.send(blogs)
}