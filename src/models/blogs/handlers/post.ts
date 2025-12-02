import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {BlogInputModel} from "../types/blog.input.model";
import {blogsService} from "../application/blogs.service";
import {blogsQueryRepository} from "../repositories/query.repository";

export const createBlogHandler = async (req: Request<RequestEntityId, BlogInputModel>, res: Response) => {
    const id = await blogsService.create(req.body);
    const blog = await blogsQueryRepository.getById(id)
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(blog)
}