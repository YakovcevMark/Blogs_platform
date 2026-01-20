import {Request, Response} from 'express'
import {matchedData} from "express-validator";
import {PostsQueryList} from "../../posts/types/posts.query.list";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {BlogsQueryRepository} from "../repositories/query.repository";
import {PostsQueryRepository} from "../../posts/repositories/query-repo";
import {ioc} from "../../../core/index";

const blogsQueryRepository = ioc.get(BlogsQueryRepository)
const postsQueryRepository = ioc.get(PostsQueryRepository)
export const getPostsByBlogIdHandler = async (req: Request<{ blogId: string }>, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as Omit<PostsQueryList, 'blogId'>;

    const isBlogPersistInDb = await blogsQueryRepository.isPersistInDb(req.params.blogId)

    if (!isBlogPersistInDb) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return
    }

    const blogs = await postsQueryRepository.getAll({...queryParamsFromValidator, blogId: req.params.blogId, userId:req.userId!});
    res.send(blogs)
}