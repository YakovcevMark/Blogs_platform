import {Request, Response} from 'express'
import {BlogsQueryList} from "../types/blogs.query.list";
import {matchedData} from "express-validator";
import {blogsQueryRepository} from "../repositories/query.repository";

export const getBlogsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as BlogsQueryList;
    const blogs = await blogsQueryRepository.getAll({...req.query, ...queryParamsFromValidator});
    res.send(blogs)
}