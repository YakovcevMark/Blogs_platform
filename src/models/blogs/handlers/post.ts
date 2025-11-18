import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {BlogInputModel} from "../types/blog.input.model";
import {blogsService} from "../application/blogs.service";

export const createBlogHandler = async (req: Request<RequestEntityId, BlogInputModel>, res: Response) => {
    const blog = await blogsService.create(req.body);
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(blog)
}