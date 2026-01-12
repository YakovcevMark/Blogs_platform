import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {CommentsService} from "../application/comments.service";
import {ioc} from "../../../core/index";
import {CommentsQueryRepository} from "../repositories/query-repo";

const commentsService = ioc.get(CommentsService)
const commentsQueryRepository = ioc.get(CommentsQueryRepository)
export const deleteCommentHandler = async (req: Request, res: Response) => {
    const comment = await commentsQueryRepository.getById(req.params.commentId, req.userId!);

    if (!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
        return;
    }

    if (comment.commentatorInfo.userId !== req!.userId) {
        res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN_403)
        return;
    }


    const isRemoved = await commentsService.remove(req.params.commentId);

    res.sendStatus(
        isRemoved
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.NOT_FOUND_404
    )
}