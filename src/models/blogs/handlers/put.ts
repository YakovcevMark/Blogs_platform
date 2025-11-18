import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {BlogInputModel} from "../types/blog.input.model";
import {blogsService} from "../application/blogs.service";

export const updateBlogHandler = async (req: Request<RequestEntityId, BlogInputModel>, res: Response) => {
    const isUpdated = await blogsService.update(req.params.id, req.body);
    res.sendStatus(
        isUpdated
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.NOT_FOUND_404
    )
}