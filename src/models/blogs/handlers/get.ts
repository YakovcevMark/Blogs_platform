import {Request, Response} from 'express'
import {BlogsQueryList} from "../types/blogs.query.list";
import {matchedData} from "express-validator";
import {BlogsQueryRepository} from "../repositories/query.repository";
import {ioc} from "../../../core/index";

const blogsQueryRepository = ioc.get(BlogsQueryRepository)
export const getBlogsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as BlogsQueryList;
    const blogs = await blogsQueryRepository.getAll({...req.query, ...queryParamsFromValidator});
    res.send(blogs)
}