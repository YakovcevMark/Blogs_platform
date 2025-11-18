import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {blogsService} from "../application/blogs.service";

export const getBlogByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const blog = await blogsService.getById(req.params.id);
    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
    } else {
        res.send(blog);
    }
}