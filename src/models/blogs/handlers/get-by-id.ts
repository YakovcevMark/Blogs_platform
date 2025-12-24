import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {BlogsQueryRepository} from "../repositories/query.repository";
import {ioc} from "../../../core/index";

const blogsQueryRepository = ioc.get(BlogsQueryRepository)
export const getBlogByIdHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const blog = await blogsQueryRepository.getById(req.params.id);
    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
    } else {
        res.send(blog);
    }
}