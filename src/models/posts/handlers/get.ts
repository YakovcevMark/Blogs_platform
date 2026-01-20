import {Request, Response} from 'express'
import {matchedData} from "express-validator";
import {PostsQueryList} from "../types/posts.query.list";
import {ioc} from "../../../core/index";
import {PostsQueryRepository} from "../repositories/query-repo";

const postsQueryRepository = ioc.get(PostsQueryRepository)
export const getPostsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as PostsQueryList;

    const posts = await postsQueryRepository.getAll({...req.query, ...queryParamsFromValidator, userId: req.userId!});
    res.send(posts)
}