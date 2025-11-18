import {Request, Response} from 'express'
import {blogsService} from "../application/blogs.service";
import {BlogsQueryList} from "../types/blogs.query.list";
import {matchedData} from "express-validator";

export const getBlogsHandler = async (req: Request, res: Response) => {
    const queryParamsFromValidator = matchedData(req, {locations: ['query']}) as BlogsQueryList;
    const blogs = await blogsService.getAll({...req.query, ...queryParamsFromValidator});
    res.send(blogs)
}