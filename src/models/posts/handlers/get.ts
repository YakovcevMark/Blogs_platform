import {Request, Response} from 'express'
import {postsService} from "../application/posts.service";
import {matchedData} from "express-validator";
import {PostsQueryList} from "../types/posts.query.list";

export const getPostsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as PostsQueryList;
    const posts = await postsService.getAll(queryParamsFromValidator);
    res.send(posts)
}