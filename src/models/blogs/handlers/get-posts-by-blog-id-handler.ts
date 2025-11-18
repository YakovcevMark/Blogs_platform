import {Request, Response} from 'express'
import {matchedData} from "express-validator";
import {postsService} from "../../posts/application/posts.service";
import {PostsQueryList} from "../../posts/types/posts.query.list";

export const getPostsByBlogIdHandler = async (req: Request<{ blogId: string }>, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as Omit<PostsQueryList, 'blogId'>;
    const blogs = await postsService.getAll({...queryParamsFromValidator, blogId: req.params.blogId});
    res.send(blogs)
}