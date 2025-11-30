import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {CommentInputModel} from "../types/comment.input.model";
import {commentsService} from "../application/comments.service";
import {commentsQueryRepository} from "../repositories/query-repo";

export const updateCommentHandler = async (req: Request<{ commentId: string }, CommentInputModel>, res: Response) => {
    const comment = await commentsQueryRepository.getById({id: req.params.commentId});

    if (!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
        return;
    }

    if (comment.commentatorInfo.userId !== req.user!.id) {
        res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN_403)
        return;
    }

    const isUpdated = await commentsService.update({id: req.params.commentId, body: req.body});

    res.sendStatus(isUpdated ? HTTP_STATUS_CODES.NO_CONTENT_204 : HTTP_STATUS_CODES.NOT_FOUND_404)
}