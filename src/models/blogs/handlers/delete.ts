import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {blogsService} from "../application/blogs.service";

export const deleteBlogHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const isRemoved = await blogsService.remove(req.params.id);
    res.sendStatus(
        isRemoved
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.NOT_FOUND_404
    )
}