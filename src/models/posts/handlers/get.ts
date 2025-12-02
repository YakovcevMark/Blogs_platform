import {Request, Response} from 'express'
import {matchedData} from "express-validator";
import {PostsQueryList} from "../types/posts.query.list";
import {postsQueryRepository} from "../repositories/query-repo";

export const getPostsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as PostsQueryList;

    const posts = await postsQueryRepository.getAll({...req.query, ...queryParamsFromValidator});
    res.send(posts)
}